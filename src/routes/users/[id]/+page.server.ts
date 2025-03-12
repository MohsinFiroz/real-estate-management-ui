import { userAPI } from '$lib/server/api/user';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const userID = params.id;
    const userResponse = await userAPI.getUserByID(userID);

    return {
      userResponse
    };
  } catch (err) {
    throw error(404, {
      message: 'User not found'
    });
  }
};

// Action to handle user deletion
export const actions: Actions = {
  deleteUser: async ({ request }) => {
    console.log("Delete user action triggered");

    const formData = await request.formData();
    const userID = formData.get('id');

    if (!userID) {
      return { success: false, error: 'User ID is required' };
    }
    
    try {
      const result = await userAPI.deleteUser(userID.toString());
      console.log("Delete API result:", result);
      
      // Redirect after successful deletion
      throw redirect(303, '/users');
    } catch (err) {
      console.error("Error deleting user:", err);
      return { success: false, error: 'Failed to delete user' };
    }
  }
};