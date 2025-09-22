/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/serverApi.ts
import axiosInstance from "./axios";
import { AxiosRequestConfig } from "axios";

interface ExternalApiOptions {
  apiKey?: string;
  apiKeyHeader?: "Authorization" | "X-API-Key" | string;
  apiKeyPrefix?: "Bearer" | string;
  timeout?: number;
}

/**
 * Server-side API utility (for use in API routes, not React components)
 * Uses the same axios configuration as the client-side useApi hook
 */
class ServerApi {
  /**
   * Make a GET request
   * @param url - API endpoint
   * @param config - Axios request config
   * @returns Response data
   */
  static async get(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Axios request config
   * @returns Response data
   */
  static async post(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Axios request config
   * @returns Response data
   */
  static async put(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param url - API endpoint
   * @param config - Axios request config
   * @returns Response data
   */
  static async delete(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request to external URL (bypasses axios instance base configuration)
   * @param url - Full URL to external API
   * @param data - Request payload
   * @param options - External API options (authentication, timeout, etc.)
   * @param config - Additional Axios request config
   * @returns Response data
   */
  static async postExternal(
    url: string,
    data?: any,
    options?: ExternalApiOptions,
    config?: AxiosRequestConfig
  ) {
    try {
      // Import axios directly for external calls
      const axios = (await import("axios")).default;

      // Build authentication headers
      const authHeaders: Record<string, string> = {};

      if (options?.apiKey) {
        const header = options.apiKeyHeader || "Authorization";
        const prefix = options.apiKeyPrefix || "Bearer";
        const value = prefix ? `${prefix} ${options.apiKey}` : options.apiKey;
        authHeaders[header] = value;
      }

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          ...config?.headers,
        },
        timeout: options?.timeout || 30000,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`POST External ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a GET request to external URL (bypasses axios instance base configuration)
   * @param url - Full URL to external API
   * @param options - External API options (authentication, timeout, etc.)
   * @param config - Additional Axios request config
   * @returns Response data
   */
  static async getExternal(
    url: string,
    options?: ExternalApiOptions,
    config?: AxiosRequestConfig
  ) {
    try {
      const axios = (await import("axios")).default;

      // Build authentication headers
      const authHeaders: Record<string, string> = {};

      if (options?.apiKey) {
        const header = options.apiKeyHeader || "Authorization";
        const prefix = options.apiKeyPrefix || "Bearer";
        const value = prefix ? `${prefix} ${options.apiKey}` : options.apiKey;
        authHeaders[header] = value;
      }

      const response = await axios.get(url, {
        headers: {
          ...authHeaders,
          ...config?.headers,
        },
        timeout: options?.timeout || 30000,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`GET External ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request to external URL (bypasses axios instance base configuration)
   * @param url - Full URL to external API
   * @param data - Request payload
   * @param options - External API options (authentication, timeout, etc.)
   * @param config - Additional Axios request config
   * @returns Response data
   */
  static async putExternal(
    url: string,
    data?: any,
    options?: ExternalApiOptions,
    config?: AxiosRequestConfig
  ) {
    try {
      const axios = (await import("axios")).default;

      // Build authentication headers
      const authHeaders: Record<string, string> = {};

      if (options?.apiKey) {
        const header = options.apiKeyHeader || "Authorization";
        const prefix = options.apiKeyPrefix || "Bearer";
        const value = prefix ? `${prefix} ${options.apiKey}` : options.apiKey;
        authHeaders[header] = value;
      }

      const response = await axios.put(url, data, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          ...config?.headers,
        },
        timeout: options?.timeout || 30000,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`PUT External ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request to external URL (bypasses axios instance base configuration)
   * @param url - Full URL to external API
   * @param options - External API options (authentication, timeout, etc.)
   * @param config - Additional Axios request config
   * @returns Response data
   */
  static async deleteExternal(
    url: string,
    options?: ExternalApiOptions,
    config?: AxiosRequestConfig
  ) {
    try {
      const axios = (await import("axios")).default;

      // Build authentication headers
      const authHeaders: Record<string, string> = {};

      if (options?.apiKey) {
        const header = options.apiKeyHeader || "Authorization";
        const prefix = options.apiKeyPrefix || "Bearer";
        const value = prefix ? `${prefix} ${options.apiKey}` : options.apiKey;
        authHeaders[header] = value;
      }

      const response = await axios.delete(url, {
        headers: {
          ...authHeaders,
          ...config?.headers,
        },
        timeout: options?.timeout || 30000,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`DELETE External ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Convenience method for calling APIs with Bearer token authentication
   * @param url - Full URL to external API
   * @param data - Request payload (for POST/PUT)
   * @param apiKey - Bearer token
   * @param method - HTTP method
   * @param config - Additional Axios request config
   * @returns Response data
   */
  static async callWithBearerToken(
    url: string,
    data: any = null,
    apiKey: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    config?: AxiosRequestConfig
  ) {
    const options: ExternalApiOptions = {
      apiKey,
      apiKeyHeader: "Authorization",
      apiKeyPrefix: "Bearer",
    };

    switch (method) {
      case "GET":
        return this.getExternal(url, options, config);
      case "POST":
        return this.postExternal(url, data, options, config);
      case "PUT":
        return this.putExternal(url, data, options, config);
      case "DELETE":
        return this.deleteExternal(url, options, config);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  /**
   * Convenience method for calling APIs with API Key header authentication
   * @param url - Full URL to external API
   * @param data - Request payload (for POST/PUT)
   * @param apiKey - API key
   * @param method - HTTP method
   * @param config - Additional Axios request config
   * @returns Response data
   */
  static async callWithApiKey(
    url: string,
    data: any = null,
    apiKey: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    config?: AxiosRequestConfig
  ) {
    const options: ExternalApiOptions = {
      apiKey,
      apiKeyHeader: "X-API-Key",
      apiKeyPrefix: "", // No prefix for API key header
    };

    switch (method) {
      case "GET":
        return this.getExternal(url, options, config);
      case "POST":
        return this.postExternal(url, data, options, config);
      case "PUT":
        return this.putExternal(url, data, options, config);
      case "DELETE":
        return this.deleteExternal(url, options, config);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}

export default ServerApi;
