import { createUser } from '$lib/server/api/user';
import type { UserRole } from '$lib/types/user';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    
    // Extract and validate form data
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();
    const phone = formData.get('phone')?.toString();
    const role = formData.get('role')?.toString() as UserRole
    
    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      return fail(400, { 
        error: 'All required fields must be filled out' 
      });
    }
    
    try {
      await createUser(fetch, {
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined,
        role,
        isActive: true,
      });
      
      throw redirect(303, '/users');
    } catch (error) {
      console.error('Error creating user:', error);
      return fail(500, { 
        error: 'Failed to create user' 
      });
    }
  }
};