/**
 * Agency Authentication Service
 * Handles login and logout API calls
 */

import { ApiClient } from "./apiClient";

const apiClient = new ApiClient("/api/agency");

export const authService = {
  /**
   * Login agency user
   */
  async login(email, password) {
    try {
      const response = await apiClient.post("/auth", {
        email,
        password,
      });
      return response;
    } catch (error) {
      throw {
        message: error.message || "Login failed",
        status: error.status,
        details: error.data,
      };
    }
  },

  /**
   * Logout agency user
   */
  async logout(userId, agencyId, role) {
    try {
      const response = await apiClient.delete("/auth", {
        userId,
        agencyId,
        role,
      });
      return response;
    } catch (error) {
      throw {
        message: error.message || "Logout failed",
        status: error.status,
        details: error.data,
      };
    }
  },
};
