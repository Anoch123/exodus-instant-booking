import { useState, useCallback } from 'react';
import { imageService } from '../services/imageService';

/**
 * Custom hook for image management
 * Handles image selection, preview, upload, and deletion
 */
export const useImageManager = (bucketName, agencyId, locationId = 'temp') => {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Handle image file selection
   */
  const handleImageSelect = useCallback((files) => {
    const validatedFiles = [];
    
    // Check total limit
    if (imagePreviews.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    // Validate each file
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds 5MB`);
        return;
      }
      validatedFiles.push(file);
    });

    if (validatedFiles.length === 0) return;

    // Add to file state
    setImageFiles(prev => [...prev, ...validatedFiles]);

    // Generate previews
    validatedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  }, [imagePreviews.length]);

  /**
   * Remove image by index
   */
  const removeImage = useCallback(async (index) => {
    const imageUrl = imagePreviews[index];
    const isExistingImage = typeof imageUrl === 'string' && imageUrl.startsWith('http');

    try {
      if (isExistingImage) {
        // Delete from S3
        await imageService.deleteImage(imageUrl, bucketName);
      } else {
        // Remove from new uploads
        const fileIndex = imagePreviews
          .slice(0, index)
          .filter(p => !p.startsWith('http')).length;
        
        setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }

      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      setError(null);
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
    }
  }, [imagePreviews, bucketName]);

  /**
   * Upload all new images to S3
   */
  const uploadNewImages = useCallback(async (existingUrls = []) => {
    if (imageFiles.length === 0) return existingUrls;

    setUploading(true);
    try {
      const newUrls = await imageService.uploadMultipleImages(
        imageFiles,
        bucketName,
        agencyId,
        locationId
      );
      
      setImageFiles([]);
      return [...existingUrls, ...newUrls];
    } catch (err) {
      setError(err.message || 'Failed to upload images');
      throw err;
    } finally {
      setUploading(false);
    }
  }, [imageFiles, bucketName, agencyId, locationId]);

  /**
   * Set existing images (for edit mode)
   */
  const setExistingImages = useCallback((images) => {
    let imagesArray = [];
    
    if (typeof images === 'string') {
      try {
        imagesArray = JSON.parse(images);
      } catch {
        imagesArray = [];
      }
    } else if (Array.isArray(images)) {
      imagesArray = images;
    }

    setImagePreviews(imagesArray);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    imageFiles,
    imagePreviews,
    uploading,
    error,
    handleImageSelect,
    removeImage,
    uploadNewImages,
    setExistingImages,
    clearError,
    totalImages: imagePreviews.length,
    canAddMore: imagePreviews.length < MAX_IMAGES
  };
};
