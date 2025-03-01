import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUser } from '$lib/server/api/user';
import type { Role, User } from '$lib/types/user';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    // Extract form values
    const firstName = formData.get('firstName')?.toString().trim() || '';
    const lastName = formData.get('lastName')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const password = formData.get('password')?.toString() || '';
    const role = formData.get('role') as Role | null;
    const isActive = formData.has('isActive');

    // Validation
    const errors: Record<string, string> = {};
    if (!firstName) errors.firstName = 'First name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!role) errors.role = 'Role is required';

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        error: 'Please fix the errors in the form',
        errors,
        data: { firstName, lastName, email, phone, role, isActive }
      });
    }

    try {
      // Create user
      const userData: Partial<User> = {
        firstName,
        lastName,
        email,
        phone,
        password,
        role: role as Role,
        isActive
      };

      await createUser(userData);

      // Redirect on success
      throw redirect(303, '/users');
    } catch (error) {
      console.error('Error creating user:', error);
      return fail(500, {
        error: error instanceof Error ? error.message : 'Failed to create user',
        data: { firstName, lastName, email, phone, role, isActive }
      });
    }
  }
};
