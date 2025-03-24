import { propertyAPI } from '$lib/server/api/property';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import type { Property } from '$lib/types/property';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const propertyID = params.id;
    const property = await propertyAPI.getByID(propertyID);

    return { property };
  } catch (err) {
    throw error(404, { message: 'Property not found' });
  }
};

// Action to handle property update
export const actions: Actions = {
  updateProperty: async ({ request, params }) => {
    const propertyID = params.id;
    const formData = await request.formData();

    const updatedData: Partial<Property> = {
      address: formData.get('address') as string,
      suburb: formData.get('suburb') as string,
      postcode: formData.get('postcode') as string,
      keyNo: formData.get('keyNo') as string,
      managementFee: parseFloat(formData.get('managementFee') as string),
      waterBillAccount: formData.get('waterBillAccount') as string,
      lastWaterBillReading: parseFloat(formData.get('lastWaterBillReading') as string || '0'),
      notes: formData.get('notes') as string,
      other: formData.get('other') as string
    };

    return propertyAPI.update(propertyID, updatedData);
  }
};