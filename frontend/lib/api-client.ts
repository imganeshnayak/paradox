/**
 * API client with automatic session header injection
 * Used for all requests to backend endpoints
 */

import { getSessionHeader } from '@/lib/session';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api` || '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Construct headers with session information
   */
  private getHeaders(customHeaders?: Record<string, string>) {
    const sessionHeaders = getSessionHeader();
    return {
      'Content-Type': 'application/json',
      ...sessionHeaders,
      ...customHeaders,
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API GET ${endpoint}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    payload?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: payload ? JSON.stringify(payload) : undefined,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API POST ${endpoint}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    payload?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: payload ? JSON.stringify(payload) : undefined,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API PUT ${endpoint}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API DELETE ${endpoint}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }
}

export const apiClient = new ApiClient();
