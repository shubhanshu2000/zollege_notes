/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useApi.ts
import { useState, useCallback } from "react";

// Types
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiOptions {
  endpoint: string;
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  NOTES: {
    GET_ALL: "/notes",
    CREATE: "/notes",
    UPDATE: (id: string) => `/notes/${id}`,
    DELETE: (id: string) => `/notes/${id}`,
  },
  USER: {
    UPDATE_PROFILE: "/user/profile",
  },
} as const;

export const useApi = <T>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const handleError = (error: any): ApiError => {
    // Network error
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      return {
        message:
          "Unable to connect to the server. Please check your internet connection.",
        code: "NETWORK_ERROR",
        status: 0,
      };
    }

    // Timeout error
    if (error.name === "AbortError") {
      return {
        message: "Request timed out. Please try again.",
        code: "TIMEOUT_ERROR",
        status: 408,
      };
    }

    // Standard error object
    if (error instanceof Error) {
      return {
        message: error.message,
        code: "UNKNOWN_ERROR",
        status: 500,
      };
    }

    // API error object
    if (error.message && error.code) {
      return error;
    }

    // Default error
    return {
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      status: 500,
      details: error,
    };
  };

  const execute = useCallback(
    async ({
      endpoint,
      method = "GET",
      body,
      headers = {},
      requiresAuth = false,
    }: ApiOptions): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = `${baseUrl}${endpoint}`;

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        // Default headers
        const defaultHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...headers,
        };

        // Add auth token if required
        if (requiresAuth) {
          const token = localStorage.getItem("authToken");
          if (!token) {
            throw {
              message: "Authentication required",
              code: "AUTH_REQUIRED",
              status: 401,
            };
          }
          defaultHeaders["Authorization"] = `Bearer ${token}`;
        }

        const options: RequestInit = {
          method,
          headers: defaultHeaders,
          signal: controller.signal,
        };

        if (method !== "GET" && body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        clearTimeout(timeoutId);

        const data = await response.json();

        // Handle different response status codes
        if (!response.ok) {
          const error: ApiError = {
            message: data.message || "An error occurred",
            code: data.code || `ERROR_${response.status}`,
            status: response.status,
            details: data,
          };

          setState((prev) => ({ ...prev, error, isLoading: false }));
          return { data: null, error, status: response.status };
        }

        setState((prev) => ({
          ...prev,
          data,
          error: null,
          isLoading: false,
        }));

        return { data, error: null, status: response.status };
      } catch (error) {
        const processedError = handleError(error);

        setState((prev) => ({
          ...prev,
          error: processedError,
          isLoading: false,
        }));

        return {
          data: null,
          error: processedError,
          status: (error as any)?.status || 500,
        };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
