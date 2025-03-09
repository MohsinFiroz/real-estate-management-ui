import { API_BASE_URL } from "$lib/common/constants";
import type { APIResponse } from "$lib/types/common";

/**
 * Custom API Error class to provide better error information
 */
export class APIError extends Error {
  statusCode: number;
  details?: any;
  
  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Base API class with common functionality for all API services
 */
export class BaseAPI {
  protected baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Handles API responses with proper error handling
   */
  protected async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let errorDetails = null;
  
      // Try to parse error details from response
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        errorDetails = errorData;
      } catch {
        // If cannot parse JSON, just use the status text
      }
  
      throw new APIError(errorMessage, response.status, errorDetails);
    }
  
    try {
      const data = await response.json();
  
      // Handle API-level errors (when response is 200 OK but operation failed)
      if (!data.success && data.error) {
        throw new APIError(data.error, response.status, data);
      }
  
      return data as APIResponse<T>;
    } catch (e) {
      // Ensure `e` is treated as an Error object
      if (e instanceof Error) {
        throw new APIError('Failed to parse API response', response.status, { originalError: e.message });
      } else {
        throw new APIError('Failed to parse API response', response.status, { originalError: String(e) });
      }
    }
  }  

  /**
   * Safely extracts data from API response or throws a meaningful error
   */
  protected extractData<T>(apiResponse: APIResponse<T>): T {
    if (!apiResponse.success || !apiResponse.data) {
      throw new APIError(apiResponse.error || 'Unknown API error', 200);
    }
    return apiResponse.data;
  }

  /**
   * Creates the fetch options with proper headers
   */
  protected createFetchOptions(method = "GET", body?: any): RequestInit {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        // Add auth header here if needed
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  }

  /**
   * Creates a URL with query parameters
   */
  protected createUrl(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseUrl}${endpoint}`;

    if (!params) {
      return url;
    }

    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.set(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }
}
