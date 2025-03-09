import type { APIResponse, SearchResponse } from '$lib/types/common';
import type { User } from '$lib/types/user';
import { BaseAPI, APIError } from './base';

export class UserAPI extends BaseAPI {
  private endpoint = '/users';

  /**
   * Fetches users with pagination, search, and sorting
   */
  async listUsers(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    isActive?: string;
    sortBy?: string;
  }): Promise<SearchResponse<User>> {
    try {
      const url = this.createUrl(this.endpoint, {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        searchQuery: params.searchQuery || '',
        isActive: params.isActive || '',
        sortBy: params.sortBy || ''
      });

      const response = await fetch(url, this.createFetchOptions());
      const apiResponse = await this.handleResponse<SearchResponse<User>>(response);
      return this.extractData(apiResponse);
    } catch (error) {
      this.handleAPIError(error, 'Failed to fetch users');
    }
  }

  /**
   * Fetches a single user by ID
   */
  async getUserByID(id: string): Promise<User> {
    try {
      const url = this.createUrl(`${this.endpoint}/${id}`);
      const response = await fetch(url, this.createFetchOptions());
      const apiResponse = await this.handleResponse<User>(response);
      return this.extractData(apiResponse);
    } catch (error) {
      this.handleAPIError(error, `Failed to fetch user with ID: ${id}`);
    }
  }

  /**
   * Creates a new user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const url = this.createUrl(this.endpoint);
      const response = await fetch(url, this.createFetchOptions('POST', userData));
      const apiResponse = await this.handleResponse<User>(response);
      return this.extractData(apiResponse);
    } catch (error) {
      this.handleAPIError(error, 'Failed to create user');
    }
  }

  /**
   * Updates an existing user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const url = this.createUrl(`${this.endpoint}/${id}`);
      const response = await fetch(url, this.createFetchOptions('PUT', userData));
      const apiResponse = await this.handleResponse<User>(response);
      return this.extractData(apiResponse);
    } catch (error) {
      this.handleAPIError(error, `Failed to update user with ID: ${id}`);
    }
  }

  /**
   * Deletes a user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const url = this.createUrl(`${this.endpoint}/${id}`);
      const response = await fetch(url, this.createFetchOptions('DELETE'));
      await this.handleResponse<void>(response);
      return;
    } catch (error) {
      this.handleAPIError(error, `Failed to delete user with ID: ${id}`);
    }
  }
  
  /**
   * Centralized error handling for API operations
   */
  private handleAPIError(error: any, fallbackMessage: string): never {
    if (error instanceof APIError) {
      // Rethrow the APIError as is
      throw error;
    } else {
      // Convert generic errors to APIError
      throw new APIError(
        error.message || fallbackMessage,
        error.statusCode || 500,
        error.details || { originalError: String(error) }
      );
    }
  }
}

export const userAPI = new UserAPI();