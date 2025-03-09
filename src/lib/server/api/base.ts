import { API_BASE_URL } from "$lib/common/constants";
import type { APIResponse } from "$lib/types/common";

export class BaseAPI {
  protected baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Handles API responses with minimal error handling
   */
  protected async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    try {
      const data = await response.json();
      data.statusCode = response.status
      return data;
    } catch {
      return { success: false, error: 'Failed to parse API response', statusCode: response.status, data: null };
    }
  }

  protected createFetchOptions(method = "GET", body?: any): RequestInit {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);
    return options;
  }

  protected createUrl(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseUrl}${endpoint}`;
    if (!params) return url;
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return `${url}?${queryParams.toString()}`;
  }

}
