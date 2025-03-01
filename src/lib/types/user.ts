// Define user role type
export type Role = 'admin' | 'user';

// User model
export interface User {
  id: string;
  email: string;
  password?: string; // Optional as it may not be returned from the API
  firstName: string;
  lastName?: string;
  phone: string;
  role: Role;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}