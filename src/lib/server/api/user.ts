import type { APIResponse, SearchResponse } from "$lib/types/common";
import type { User } from "$lib/types/user";
import { BaseAPI } from "./base";

export class UserAPI extends BaseAPI {
  private endpoint = "/users";

  /**
   * Fetches users with pagination, search, and sorting
   */
  async listUsers(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    isActive?: string;
    sortBy?: string;
  }): Promise<APIResponse<SearchResponse<User>>> {
    const url = this.createUrl(this.endpoint, {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      searchQuery: params.searchQuery || "",
      isActive: params.isActive || "",
      sortBy: params.sortBy || "",
    });

    const response = await fetch(url, this.createFetchOptions());
    return await this.handleResponse<SearchResponse<User>>(response);
  }

  /**
   * Fetches a single user by ID
   */
  async getUserByID(id: string): Promise<APIResponse<User>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions());
    return await this.handleResponse<User>(response);
  }

  /**
   * Creates a new user
   */
  async createUser(userData: Partial<User>): Promise<APIResponse<User>> {
    const url = this.createUrl(this.endpoint);
    const response = await fetch(url, this.createFetchOptions("POST", userData));
    return await this.handleResponse<User>(response);
  }

  /**
   * Updates an existing user
   */
  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<APIResponse<User>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions("PUT", userData));
    return await this.handleResponse<User>(response);
  }

  /**
   * Deletes a user
   */
  async deleteUser(id: string): Promise<APIResponse<void>> {
    const url = this.createUrl(`${this.endpoint}/${id}`);
    const response = await fetch(url, this.createFetchOptions("DELETE"));
    return await this.handleResponse<void>(response);
  }
}

export const userAPI = new UserAPI();
