import type { APIResponse, SearchResponse } from "$lib/types/common";
import type { Tenant } from "$lib/types/tenant";
import { BaseAPI } from "./base";

export class TenantAPI extends BaseAPI {
  private endpoint = "/tenants";

  /**
   * Fetches users with pagination, search, and sorting
   */
  async list(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    isActive?: string;
    sortBy?: string;
  }): Promise<APIResponse<SearchResponse<Tenant>>> {
    const url = this.createUrl(this.endpoint, {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      searchQuery: params.searchQuery || "",
      sortBy: params.sortBy || "",
    });

    const response = await fetch(url, this.createFetchOptions());
    return await this.handleResponse<SearchResponse<Tenant>>(response);
  }

  /**
   * Fetches a single user by ID
   */
  async getByID(id: string): Promise<APIResponse<Tenant>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions());
    return await this.handleResponse<Tenant>(response);
  }

  /**
   * Creates a new user
   */
  async create(userData: Partial<Tenant>): Promise<APIResponse<Tenant>> {
    const url = this.createUrl(this.endpoint);
    const response = await fetch(url, this.createFetchOptions("POST", userData));
    return await this.handleResponse<Tenant>(response);
  }

  /**
   * Updates an existing user
   */
  async update(
    id: string,
    userData: Partial<Tenant>
  ): Promise<APIResponse<Tenant>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions("PUT", userData));
    return await this.handleResponse<Tenant>(response);
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

export const tenantAPI = new TenantAPI();
