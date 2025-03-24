import { propertyAPI } from '$lib/server/api/property';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const propertyID = params.id;
    const propertyResponse = await propertyAPI.getByID(propertyID);

    return {
      propertyResponse
    };
  } catch (err) {
    throw error(404, {
      message: 'Property not found'
    });
  }
};

// Action to handle property deletion
export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const propertyID = formData.get('id');

    if (!propertyID) {
      return { success: false, error: 'Property ID is required' };
    }
    
    try {
      const result = await propertyAPI.delete(propertyID.toString());
      console.log("Delete API result:", result);
      
      // Redirect after successful deletion
      throw redirect(303, '/properties');
    } catch (err) {
      console.error("Error deleting property:", err);
      return { success: false, error: 'Failed to delete property' };
    }
  }
};