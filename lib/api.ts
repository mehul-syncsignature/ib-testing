/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axiosInstance from "./axios";
import { AxiosRequestConfig, isAxiosError } from "axios";

const handleApiError = (error: any): Error => {
  if (isAxiosError(error)) {
    const apiErrorMessage = error.response?.data?.error;
    if (apiErrorMessage && typeof apiErrorMessage === "string") {
      return new Error(apiErrorMessage);
    }
    return new Error(error.message);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error("An unexpected error occurred.");
};

/**
 * Hook for making API calls with Axios.
 * Auth headers are automatically handled by axios interceptors.
 * It now provides intelligent, user-friendly error messages.
 * @returns API fetching utilities and state.
 */
export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Make a GET request
   */
  const get = async (url: string, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      // Add cache-busting headers and params
      const enhancedConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
        },
        params: {
          ...config?.params,
        },
      };

      const response = await axiosInstance.get(url, enhancedConfig);
      return response.data;
    } catch (err) {
      const processedError = handleApiError(err);
      setError(processedError);
      throw processedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Make a POST request
   */
  const post = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (err) {
      const processedError = handleApiError(err);
      setError(processedError);
      throw processedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Make a PUT request
   */
  const put = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (err) {
      const processedError = handleApiError(err);
      setError(processedError);
      throw processedError;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Make a DELETE request
   */
  const del = async (url: string, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (err) {
      const processedError = handleApiError(err);
      setError(processedError);
      throw processedError;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    clearError,
  };
};

export default useApi;
