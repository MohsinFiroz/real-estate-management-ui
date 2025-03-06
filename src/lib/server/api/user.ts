import { API_BASE_URL } from '$lib/common/constants';
import type { SearchResponse } from '$lib/types/common';
import type { User } from '$lib/types/user';


/**
 * Fetches users with pagination, search, and sorting
 */
export async function listUsers(params: {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  isActive?: string;
  sortBy?: string;
}): Promise<SearchResponse<User>> {
  const { page = 1, pageSize = 10, searchQuery = '', isActive = '', sortBy = '' } = params;
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (page) queryParams.set('page', page.toString());
  if (pageSize) queryParams.set('pageSize', pageSize.toString());
  if (searchQuery) queryParams.set('searchQuery', searchQuery);
  if (isActive) queryParams.set('isActive', isActive);
  if (sortBy) queryParams.set('sortBy', sortBy);
  
  const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      // Add auth header here if needed
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch users');
  }
  
  const data = await response.json();
  return data.data as SearchResponse<User>;
}

/**
 * Fetches a single user by ID
 */
export async function getUserByID(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      // Add auth header here if needed
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch user');
  }
  
  const data = await response.json();
  return data.data as User;
}

/**
 * Creates a new user
 */
export async function createUser(userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header here if needed
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create user');
  }
  
  const data = await response.json();
  return data.data as User;
}

/**
 * Updates an existing user
 */
export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header here if needed
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user');
  }
  
  const data = await response.json();
  return data.data as User;
}

/**
 * Deletes a user
 */
export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header here if needed
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete user');
  }
}