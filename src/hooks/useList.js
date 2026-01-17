import { useState, useEffect, useCallback } from 'react';
import { handleSupabaseError } from '../utils/errorHandler';

/**
 * Generic hook for fetching and managing lists of data
 * Handles pagination, loading, and error states
 * 
 * @param {Function} fetchFn - Function to fetch data
 * @param {Number} pageSize - Items per page
 */
export const useList = (fetchFn, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  /**
   * Fetch data
   */
  const fetch = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(currentPage, pageSize);
      
      // Handle both array and paginated response
      if (Array.isArray(result)) {
        setData(result);
        setHasMore(false);
      } else {
        // Paginated response
        setData(result.data || []);
        setTotal(result.total || 0);
        setHasMore(result.hasMore !== false);
      }
      
      setPage(currentPage);
    } catch (err) {
      const errorMsg = handleSupabaseError(err, 'Failed to load data');
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pageSize]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetch(1);
  }, [fetch]);

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (hasMore) {
      fetch(page + 1);
    }
  };

  /**
   * Go to previous page
   */
  const prevPage = () => {
    if (page > 1) {
      fetch(page - 1);
    }
  };

  /**
   * Refresh data
   */
  const refresh = () => {
    fetch(page);
  };

  /**
   * Add item to list
   */
  const addItem = (item) => {
    setData(prev => [item, ...prev]);
  };

  /**
   * Remove item from list
   */
  const removeItem = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Update item in list
   */
  const updateItem = (id, updates) => {
    setData(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const clearError = () => setError(null);

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    total,
    fetch,
    refresh,
    nextPage,
    prevPage,
    addItem,
    removeItem,
    updateItem,
    clearError
  };
};
