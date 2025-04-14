import { ownerAPI } from '$lib/server/api/owner';  // Assuming you have an API for Owner
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import type { Owner } from '$lib/types/owner';  // Using the Owner type

export const load: PageServerLoad = async ({ params }) => {
  try {
    const ownerID = params.id;
    const owner = await ownerAPI.getByID(ownerID);  // Fetching owner instead of user

    return { owner };
  } catch (err) {
    throw error(404, { message: 'Owner not found' });
  }
};

// Action to handle owner update
export const actions: Actions = {
  update: async ({ request, params }) => {
    const ownerID = params.id;
    const formData = await request.formData();

    // Convert the string 'true'/'false' to actual boolean values
    const isActiveString = formData.get('isActive') as string;
    const isActive = isActiveString === 'true';

    const updatedData: Partial<Owner> = {
      name: formData.get('name') as string,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      communicationMedium: formData.get('communicationMedium') as string,
      insurance: formData.get('insurance') as string,
      accountNumber: formData.get('accountNumber') as string,
      bsb: formData.get('bsb') as string,
      identification: formData.get('identification') as string,
      address: formData.get('address') as string,
      isActive: isActive,  // Now properly converted to boolean
    };

    return ownerAPI.update(ownerID, updatedData);  // Update owner instead of user
  }
};