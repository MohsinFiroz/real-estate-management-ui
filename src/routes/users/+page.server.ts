import { userAPI } from '$lib/server/api/user';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Helper function to parse sorting criteria
function parseSortCriteria(sortParam: string | null) {
  return sortParam?.split(',').map(sortItem => {
    const [field, direction] = sortItem.split(':');
    return { field, direction: direction === 'desc' ? 'desc' : 'asc' };
  });
}

// Helper function to parse role filters
function parseRoleFilters(rolesParam: string | null) {
  return rolesParam ? rolesParam.split(',') : [];
}

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const searchQuery = url.searchParams.get('searchQuery') || '';
  const isActive = url.searchParams.get('isActive') || '';
  const sortParam = url.searchParams.get('sortBy');

  // Parse sorting and role filters
  const sortCriteria = parseSortCriteria(sortParam);

  const sortBy = sortCriteria?.map(s => `${s.field}:${s.direction}`).join(',');

  const listResponse = await userAPI.listUsers({
    page,
    pageSize,
    searchQuery,
    isActive,
    sortBy,
  });

  return {
    listResponse,
    sortCriteria,
  };
};

// Action to handle user deletion
export const actions: Actions = {
  deleteUser: async ({ request }) => {
    const formData = await request.formData();
    const userID = formData.get('id');

    if (!userID) {
      return { error: 'User ID is required' };
    }

    try {
      await userAPI.deleteUser(userID.toString());
      throw redirect(303, '/users');
    } catch (err) {
      return { error: 'Failed to delete user' };
    }
  }
};
