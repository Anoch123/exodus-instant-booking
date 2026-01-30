/**
 * Hotel Service
 * Handles all hotel CRUD operations
 */

import { ApiClient } from "./apiClient";

const apiClient = new ApiClient("/api/agency");

export const hotelService = {
  /**
   * Fetch all hotels for agency with pagination
   */
  async getAll(agencyId, page = 1, limit = 10) {
    try {
      const response = await apiClient.get(
        `/hotels?agencyId=${agencyId}&page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to fetch hotels",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Fetch single hotel by ID
   */
  async getById(hotelId, agencyId) {
    try {
      const response = await apiClient.get(
        `/hotels/${hotelId}?agencyId=${agencyId}`
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to fetch hotel",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Create new hotel
   */
  async create(hotelData) {
    try {
      const response = await apiClient.post("/hotels", hotelData);
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to create hotel",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Update hotel
   */
  async update(hotelId, updateData) {
    try {
      const response = await apiClient.put(
        `/hotels/${hotelId}`,
        updateData
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to update hotel",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Delete hotel
   */
  async delete(hotelId, agencyId, agencyUserId, role) {
    try {
      const response = await apiClient.delete(
        `/hotels/${hotelId}`,
        {
          agencyId,
          agencyUserId,
          role,
        }
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to delete hotel",
        status: error.status,
        details: error.data,
      };
    }
  },
};
