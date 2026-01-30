/**
 * Location Service
 * Handles all location CRUD operations
 */

import { ApiClient } from "./apiClient";

const apiClient = new ApiClient("/api/agency");

export const locationService = {
  /**
   * Fetch all locations for agency with pagination
   */
  async getAll(agencyId, page = 1, limit = 10) {
    try {
      const response = await apiClient.get(
        `/locations?agencyId=${agencyId}&page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to fetch locations",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Fetch single location by ID
   */
  async getById(locationId, agencyId) {
    try {
      const response = await apiClient.get(
        `/locations/${locationId}?agencyId=${agencyId}`
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to fetch location",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Create new location
   */
  async create(locationData) {
    try {
      const response = await apiClient.post("/locations", locationData);
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to create location",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Update location
   */
  async update(locationId, updateData) {
    try {
      const response = await apiClient.put(
        `/locations/${locationId}`,
        updateData
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to update location",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Delete location
   */
  async delete(locationId, agencyId, agencyUserId, role) {
    try {
      const response = await apiClient.delete(
        `/locations/${locationId}`,
        {
          agencyId,
          agencyUserId,
          role,
        }
      );
      return response;
    } catch (error) {
      throw {
        message: error.message || "Failed to delete location",
        status: error.status,
        details: error.data,
      };
    }
  },
};
