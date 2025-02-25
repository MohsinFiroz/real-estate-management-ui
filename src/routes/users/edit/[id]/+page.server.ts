import { getUserByID, updateUser } from '$lib/server/api/user';
import type { UserRole } from '$lib/types/user';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { id } = params;
  
  try {
    const user = await getUserByID(fetch, id);
    return { user };
  } catch (error) {
    console.error('Error loading user:', error);
    throw redirect(303, '/users');
  }
};

export const actions: Actions = {
  default: async ({ params, request, fetch }) => {
    const { id } = params;
    const formData = await request.formData();
    
    // Extract form data
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();
    const phone = formData.get('phone')?.toString();
    const role = formData.get('role')?.toString() as UserRole;
    const isActive = formData.get('isActive') === 'true';
    
    // Validation
    if (!firstName || !lastName || !role) {
      return fail(400, { 
        error: 'All required fields must be filled out' 
      });
    }
    
    try {
      await updateUser(fetch, id, {
        firstName,
        lastName,
        phone: phone || undefined,
        role,
        isActive
      });
      
      throw redirect(303, '/users');
    } catch (error) {
      console.error('Error updating user:', error);
      return fail(500, { 
        error: 'Failed to update user' 
      });
    }
  }
};