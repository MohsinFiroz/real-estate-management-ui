import { tenantAPI } from '$lib/server/api/tenant';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import type { Tenant } from '$lib/types/tenant';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const tenantID = params.id;
    const tenant = await tenantAPI.getByID(tenantID);

    return { tenant };
  } catch (err) {
    throw error(404, { message: 'Tenant not found' });
  }
};

// Action to handle tenant update
export const actions: Actions = {
  updateTenant: async ({ request, params }) => {
    const tenantID = params.id;
    const formData = await request.formData();

    const updatedData: Partial<Tenant> = {
      name: formData.get('name') as string,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      communicationMedium: formData.get('communicationMedium') as string,
    };

    return tenantAPI.update(tenantID, updatedData);
  }
};