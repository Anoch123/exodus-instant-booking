import { useState, useEffect } from 'react';
import { handleSupabaseError } from '../utils/errorHandler';

/**
 * Generic form hook for CRUD operations
 * Handles form state, loading, validation, and API operations
 * 
 * @param {Function} fetchFn - Function to fetch existing data (for edit mode)
 * @param {Function} saveFn - Function to save data (create or update)
 * @param {Object} initialData - Initial form data structure
 * @param {Boolean} isEditMode - Whether in edit or create mode
 */
export const useForm = (fetchFn, saveFn, initialData, isEditMode = false) => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [originalData, setOriginalData] = useState(null);

  /**
   * Load data in edit mode
   */
  useEffect(() => {
    if (!isEditMode || !fetchFn) return;

    const loadData = async () => {
      try {
        setPageLoading(true);
        const data = await fetchFn();
        setFormData(data);
        setOriginalData(data);
      } catch (err) {
        setError(handleSupabaseError(err, 'Failed to load data'));
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [isEditMode, fetchFn]);

  /**
   * Update form field
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Update multiple fields
   */
  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  /**
   * Reset form to original data
   */
  const reset = () => {
    setFormData(originalData || initialData);
    setError(null);
  };

  /**
   * Save form data
   */
  const save = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await saveFn(payload, isEditMode);
      return result;
    } catch (err) {
      const errorMsg = handleSupabaseError(err, 'Failed to save data');
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
    isEditMode,
    updateField,
    updateFields,
    reset,
    save,
    clearError
  };
};
