import { ownerAPI } from '$lib/server/api/owner';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const ownerID = params.id;
    const ownerResponse = await ownerAPI.getByID(ownerID);

    return {
      ownerResponse
    };
  } catch (err) {
    throw error(404, {
      message: 'Owner not found'
    });
  }
};

// Action to handle user deletion
export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const userID = formData.get('id');

    if (!userID) {
      return { success: false, error: 'Owner ID is required' };
    }
    
    try {
      const result = await ownerAPI.delete(userID.toString());
      console.log("Delete API result:", result);
      
      // Redirect after successful deletion
      throw redirect(303, '/owners');
    } catch (err) {
      console.error("Error deleting owner:", err);
      return { success: false, error: 'Failed to delete owner' };
    }
  }
};