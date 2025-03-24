import { propertyAPI } from '$lib/server/api/property';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Helper function to parse sorting criteria
function parseSortCriteria(sortParam: string | null) {
  return sortParam?.split(',').map(sortItem => {
    const [field, direction] = sortItem.split(':');
    return { field, direction: direction === 'desc' ? 'desc' : 'asc' };
  });
}

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const searchQuery = url.searchParams.get('searchQuery') || '';
  const sortParam = url.searchParams.get('sortBy');

  // Parse sorting criteria
  const sortCriteria = parseSortCriteria(sortParam);

  const sortBy = sortCriteria?.map(s => `${s.field}:${s.direction}`).join(',');

  const listResponse = await propertyAPI.list({
    page,
    pageSize,
    searchQuery,
    sortBy,
  });

  return {
    listResponse,
    sortCriteria,
  };
};

// Action to handle property deletion
export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const propertyID = formData.get('id');

    if (!propertyID) {
      return { error: 'Property ID is required' };
    }

    try {
      await propertyAPI.delete(propertyID.toString());
      throw redirect(303, '/properties');
    } catch (err) {
      return { error: 'Failed to delete property' };
    }
  }
};