import { supabase } from "../supabaseClient";

/**
 * Image Service - Handles S3 storage operations
 */
export const imageService = {
  /**
   * Upload image to Supabase S3
   * @param {File} file - Image file to upload
   * @param {string} bucketName - S3 bucket name
   * @param {string} filePath - File path in bucket
   * @returns {Promise<string>} - Public URL of uploaded image
   */
  async uploadImage(file, bucketName, filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Generate public URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${data.path}`;
      
      console.log('✅ Uploaded image URL:', publicUrl);
      return publicUrl;
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      throw new Error(`Image upload failed: ${err.message}`);
    }
  },

  /**
   * Upload multiple images
   * @param {File[]} files - Array of image files
   * @param {string} bucketName - S3 bucket name
   * @param {string} agencyId - Agency ID for file organization
   * @param {string} locationId - Location ID (optional)
   * @returns {Promise<string[]>} - Array of public URLs
   */
  async uploadMultipleImages(files, bucketName, agencyId, locationId = 'temp') {
    const uploadedUrls = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${agencyId}/${locationId}-${Date.now()}.${fileExt}`;
      const publicUrl = await this.uploadImage(file, bucketName, fileName);
      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  },

  /**
   * Delete image from S3
   * @param {string} imageUrl - Full image URL
   * @param {string} bucketName - S3 bucket name
   */
  async deleteImage(imageUrl, bucketName) {
    try {
      // Extract file path from URL
      const pathParts = imageUrl.split(`/storage/v1/object/public/${bucketName}/`);
      
      if (pathParts.length !== 2) {
        throw new Error('Invalid image URL format');
      }

      const filePath = pathParts[1];
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;
      console.log('🗑️ Deleted from S3:', filePath);
    } catch (err) {
      console.error('❌ Failed to delete image from S3:', err);
      throw err;
    }
  },

  /**
   * Delete multiple images from S3
   * @param {string[]} imageUrls - Array of image URLs
   * @param {string} bucketName - S3 bucket name
   */
  async deleteMultipleImages(imageUrls, bucketName) {
    for (const url of imageUrls) {
      try {
        await this.deleteImage(url, bucketName);
      } catch (err) {
        console.error(`Failed to delete image: ${url}`, err);
      }
    }
  }
};
