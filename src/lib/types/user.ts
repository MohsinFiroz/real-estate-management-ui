export type UserRole = 'admin' | 'user';

// Constants for roles
export const RoleAdmin: UserRole = 'admin';
export const RoleUser: UserRole = 'user';

// User interface representing a user record
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Response from the API for paginated users list
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
