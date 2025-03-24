import { tenantAPI } from '$lib/server/api/tenant';
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

  // Parse sorting and role filters
  const sortCriteria = parseSortCriteria(sortParam);

  const sortBy = sortCriteria?.map(s => `${s.field}:${s.direction}`).join(',');

  const listResponse = await tenantAPI.list({
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

// Action to handle user deletion
export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const tenantID = formData.get('id');

    if (!tenantID) {
      return { error: 'Tenant ID is required' };
    }

    try {
      await tenantAPI.delete(tenantID.toString());
      throw redirect(303, '/tenants');
    } catch (err) {
      return { error: 'Failed to delete tenant' };
    }
  }
};
