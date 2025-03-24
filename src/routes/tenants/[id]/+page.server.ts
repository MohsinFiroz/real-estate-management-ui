import { tenantAPI } from '$lib/server/api/tenant';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const tenantID = params.id;
    const tenantResponse = await tenantAPI.getByID(tenantID);

    return {
      tenantResponse
    };
  } catch (err) {
    throw error(404, {
      message: 'Tenant not found'
    });
  }
};

// Action to handle tenant deletion
export const actions: Actions = {
  deleteTenant: async ({ request }) => {
    console.log("Delete tenant action triggered");

    const formData = await request.formData();
    const tenantID = formData.get('id');

    if (!tenantID) {
      return { success: false, error: 'Tenant ID is required' };
    }
    
    try {
      const result = await tenantAPI.delete(tenantID.toString());
      console.log("Delete API result:", result);
      
      // Redirect after successful deletion
      throw redirect(303, '/tenants');
    } catch (err) {
      console.error("Error deleting tenant:", err);
      return { success: false, error: 'Failed to delete tenant' };
    }
  }
};