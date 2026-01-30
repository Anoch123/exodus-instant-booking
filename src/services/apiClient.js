/**
 * API Client Service
 * Centralized HTTP client for API calls
 * Handles requests, responses, and error handling
 */

class ApiClient {
  constructor(baseURL = "") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const {
      method = "GET",
      body = null,
      headers = {},
      ...otherOptions
    } = options;

    // Normalize certain query parameter keys (e.g. agencyId -> agency_id)
    const normalizedEndpoint = typeof endpoint === "string"
      ? endpoint.replaceAll("agencyId=", "agency_id=")
      : endpoint;

    const url = `${this.baseURL}${normalizedEndpoint}`;
    const config = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      ...otherOptions,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type") || "";
      let data = null;
      let text = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Response is not JSON (likely HTML). Read as text for debug.
        text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = null;
        }
      }

      if (!response.ok) {
        const errMsg = (data && (data.error || data.message)) || text || "Request failed";
        throw new ApiError(errMsg, response.status, data || text);
      }

      // Prefer parsed JSON, otherwise return raw text
      return data !== null ? data : text;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error.message || "Network error",
        0,
        error
      );
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, body = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
      body,
    });
  }

  /**
   * Set authorization header
   */
  setAuthToken(token) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  /**
   * Clear authorization header
   */
  clearAuthToken() {
    delete this.defaultHeaders.Authorization;
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export { ApiClient, ApiError };
