import type { APIResponse, SearchResponse } from "$lib/types/common";
import type { Owner } from "$lib/types/owner";
import { json } from "@sveltejs/kit";
import { BaseAPI } from "./base";

export class OwnerAPI extends BaseAPI {
  private endpoint = "/owners";

  /**
   * Fetches users with pagination, search, and sorting
   */
  async list(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    isActive?: string;
    sortBy?: string;
  }): Promise<APIResponse<SearchResponse<Owner>>> {
    const url = this.createUrl(this.endpoint, {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      searchQuery: params.searchQuery || "",
      sortBy: params.sortBy || "",
    });

    const response = await fetch(url, this.createFetchOptions());    
    return await this.handleResponse<SearchResponse<Owner>>(response);
  }

  /**
   * Fetches a single user by ID
   */
  async getByID(id: string): Promise<APIResponse<Owner>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions());
    return await this.handleResponse<Owner>(response);
  }

  /**
   * Creates a new user
   */
  async create(userData: Partial<Owner>): Promise<APIResponse<Owner>> {
    const url = this.createUrl(this.endpoint);
    const response = await fetch(url, this.createFetchOptions("POST", userData));
    return await this.handleResponse<Owner>(response);
  }

  /**
   * Updates an existing user
   */
  async update(
    id: string,
    userData: Partial<Owner>
  ): Promise<APIResponse<Owner>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions("PUT", userData));
    return await this.handleResponse<Owner>(response);
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

export const ownerAPI = new OwnerAPI();
