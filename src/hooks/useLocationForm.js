import { useState, useEffect } from 'react';
import { locationService } from '../services/crudService';
import { handleSupabaseError } from '../utils/errorHandler';

/**
 * Custom hook for location form management
 * Handles form state, loading, validation, and API operations
 */
export const useLocationForm = (locationId, agencyId) => {
  const isEditMode = Boolean(locationId);
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    district: '',
    city: '',
    country: '',
    location_type: '',
    status: '',
    images: []
  });

  const [originalData, setOriginalData] = useState(null);

  /**
   * Load location data in edit mode
   */
  useEffect(() => {
    if (!isEditMode || !agencyId) return;

    const loadLocation = async () => {
      try {
        setPageLoading(true);
        const data = await locationService.fetch(locationId, agencyId);

        const cleanedData = {
          name: data.name || '',
          description: data.description || '',
          district: data.district || '',
          city: data.city || '',
          country: data.country || '',
          location_type: data.location_type || '',
          status: data.status || '',
          images: data.images || []
        };

        // Parse images if stored as string
        let imagesArray = [];
        if (typeof cleanedData.images === 'string') {
          try {
            imagesArray = JSON.parse(cleanedData.images);
            cleanedData.images = imagesArray;
          } catch {
            cleanedData.images = [];
          }
        }

        setFormData(cleanedData);
        setOriginalData(cleanedData);
        setSelectedDistrict(data.district || '');

        console.log('✅ Loaded location:', cleanedData);
      } catch (err) {
        setError(handleSupabaseError(err, 'Failed to load location'));
      } finally {
        setPageLoading(false);
      }
    };

    loadLocation();
  }, [isEditMode, locationId, agencyId]);

  /**
   * Update form field
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Update district and reset city
   */
  const updateDistrict = (district) => {
    setSelectedDistrict(district);
    setFormData(prev => ({ ...prev, district, city: '' }));
  };

  /**
   * Update images
   */
  const updateImages = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  /**
   * Save location (create or update)
   */
  const saveLocation = async (payload) => {
    if (!agencyId) {
      throw new Error('Agency not found. Please re-login.');
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (isEditMode) {
        result = await locationService.update(locationId, payload, agencyId);
      } else {
        result = await locationService.create(payload, agencyId);
      }
      
      console.log('✅ Location saved:', result);
      return result;
    } catch (err) {
      const errorMsg = handleSupabaseError(err, 'Failed to save location');
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    formData,
    setFormData,
    originalData,
    loading,
    pageLoading,
    error,
    selectedDistrict,
    isEditMode,
    updateField,
    updateDistrict,
    updateImages,
    saveLocation,
    clearError
  };
};
