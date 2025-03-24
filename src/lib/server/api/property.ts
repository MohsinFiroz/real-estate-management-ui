import type { APIResponse, SearchResponse } from "$lib/types/common";
import type { Property } from "$lib/types/property";
import { BaseAPI } from "./base";

export class PropertyAPI extends BaseAPI {
  private endpoint = "/properties";

  /**
   * Fetches users with pagination, search, and sorting
   */
  async list(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    isActive?: string;
    sortBy?: string;
  }): Promise<APIResponse<SearchResponse<Property>>> {
    const url = this.createUrl(this.endpoint, {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      searchQuery: params.searchQuery || "",
      sortBy: params.sortBy || "",
    });

    const response = await fetch(url, this.createFetchOptions());
    return await this.handleResponse<SearchResponse<Property>>(response);
  }

  /**
   * Fetches a single user by ID
   */
  async getByID(id: string): Promise<APIResponse<Property>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions());    
    return await this.handleResponse<Property>(response);
  }

  /**
   * Creates a new user
   */
  async create(userData: Partial<Property>): Promise<APIResponse<Property>> {
    const url = this.createUrl(this.endpoint);
    const response = await fetch(url, this.createFetchOptions("POST", userData));
    return await this.handleResponse<Property>(response);
  }

  /**
   * Updates an existing user
   */
  async update(
    id: string,
    userData: Partial<Property>
  ): Promise<APIResponse<Property>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions("PUT", userData));
    return await this.handleResponse<Property>(response);
  }

  /**
   * Deletes a user
   */
  async delete(id: string): Promise<APIResponse<void>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions("DELETE"));
    return await this.handleResponse<void>(response);
  }
}

export const propertyAPI = new PropertyAPI();
