import { useState, useEffect } from 'react';
import { hotelService } from '../services/crudService';
import { handleSupabaseError } from '../utils/errorHandler';

/**
 * Custom hook for hotel form management
 * Handles form state, loading, validation, and API operations
 */
export const useHotelForm = (hotelId, agencyId) => {
  const isEditMode = Boolean(hotelId);
  
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
    status: '',
    total_rooms_count: '',
    per_person_chargers: '',
    hotel_rating: '',
    email: '',
    phone: '',
    website: '',
    is_wifi: false,
    is_balcony: false,
    is_spa: false,
    is_room_service: false,
    is_swimming_pool: false,
    is_air_conditioned: false,
    is_family_rooms: false,
    is_gym: false,
    images: []
  });

  const [originalData, setOriginalData] = useState(null);

  /**
   * Load hotel data in edit mode
   */
  useEffect(() => {
    if (!isEditMode || !agencyId) return;

    const loadHotel = async () => {
      try {
        setPageLoading(true);
        const data = await hotelService.fetch(hotelId, agencyId);

        const cleanedData = {
          name: data.name || '',
          description: data.description || '',
          district: data.district || '',
          city: data.city || '',
          country: data.country || '',
          status: data.status || '',
          total_rooms_count: data.total_rooms_count || '',
          per_person_chargers: data.per_person_chargers || '',
          hotel_rating: data.hotel_rating || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          is_wifi: data.is_wifi || false,
          is_balcony: data.is_balcony || false,
          is_spa: data.is_spa || false,
          is_room_service: data.is_room_service || false,
          is_swimming_pool: data.is_swimming_pool || false,
          is_air_conditioned: data.is_air_conditioned || false,
          is_family_rooms: data.is_family_rooms || false,
          is_gym: data.is_gym || false,
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

        console.log('✅ Loaded hotel:', cleanedData);
      } catch (err) {
        setError(handleSupabaseError(err, 'Failed to load hotel'));
      } finally {
        setPageLoading(false);
      }
    };

    loadHotel();
  }, [isEditMode, hotelId, agencyId]);

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
   * Save hotel (create or update)
   */
  const saveHotel = async (payload) => {
    if (!agencyId) {
      throw new Error('Agency not found. Please re-login.');
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (isEditMode) {
        result = await hotelService.update(hotelId, payload, agencyId);
      } else {
        result = await hotelService.create(payload, agencyId);
      }

      console.log('✅ Hotel saved:', result);
      return result;
    } catch (err) {
      const errorMsg = handleSupabaseError(err, 'Failed to save hotel');
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
    saveHotel,
    clearError
  };
};
