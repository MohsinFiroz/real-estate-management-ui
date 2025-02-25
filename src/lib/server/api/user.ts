import { API_BASE_URL } from '$lib/common/constants';
import type { User, UserListResponse } from '$lib/types/user';
import type { UserQueryParams } from '$lib/types/common';

/**
 * Server-side function to fetch users with pagination, filtering, and sorting
 */
export async function fetchUsers(
  fetch: typeof window.fetch,
  { page = 1, limit = 10, roleFilter = '', statusFilter = '', sortBy = [] }: UserQueryParams
): Promise<UserListResponse> {
  const offset = (page - 1) * limit;
  const sortByParam = sortBy.map(sort => `${sort.field}:${sort.order}`).join(',');

  const url = new URL(`${API_BASE_URL}/v1/users`);
  url.searchParams.append('offset', offset.toString());
  url.searchParams.append('limit', limit.toString());
  
  if (roleFilter) url.searchParams.append('role', roleFilter);
  if (statusFilter) url.searchParams.append('status', statusFilter);
  if (sortByParam) url.searchParams.append('sortBy', sortByParam);
  
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer Token` // Using middleware/auth token
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Server-side function to create a new user
 */
export async function createUser(
  fetch: typeof window.fetch,
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/v1/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer Token`
    },
    body: JSON.stringify(user)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(`Error creating user: ${error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Server-side function to update a user
 */
export async function updateUser(
  fetch: typeof window.fetch,
  id: string,
  userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer Token`
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(`Error updating user: ${error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Server-side function to delete a user
 */
export async function deleteUser(
  fetch: typeof window.fetch,
  id: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
    method: 'DELETE',
    headers: {
      // 'Authorization': `Bearer Token`
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(`Error deleting user: ${error?.message || response.statusText}`);
  }
}

/**
 * Server-side function to get a single user by ID
 */
export async function getUserByID(
  fetch: typeof window.fetch,
  id: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
    headers: {
      // 'Authorization': `Bearer Token`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  
  return response.json();
}