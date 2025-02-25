import { fetchUsers, updateUser, deleteUser } from '$lib/server/api/user';
import type { UserQueryParams } from '$lib/types/common';
import type { UserListResponse } from '$lib/types/user';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, url }) => {
  // Parse query parameters
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const roleFilter = url.searchParams.get('role') || '';
  const statusFilter = url.searchParams.get('status') || '';
  
  // Parse sorting parameters
  const sortParam = url.searchParams.get('sortBy') || '';
  const sortBy = sortParam ? 
    sortParam.split(',').map(s => {
      const [field, order] = s.split(':');
      return { field, order: order as 'asc' | 'desc' };
    }) : 
    [];

  const queryParams: UserQueryParams = {
    page,
    limit,
    roleFilter,
    statusFilter,
    sortBy
  };

  try {
    const usersData: UserListResponse = await fetchUsers(fetch, queryParams);
    
    return {
      users: usersData.users,
      pagination: {
        total: usersData.total,
        page: usersData.page,
        limit: usersData.limit,
        totalPages: usersData.totalPages
      },
      filters: {
        role: roleFilter,
        status: statusFilter
      },
      sort: sortBy
    };
  } catch (error) {
    console.error('Error loading users:', error);
    return {
      users: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      filters: { role: '', status: '' },
      sort: [],
      error: 'Failed to load users. Please try again later.'
    };
  }
};

export const actions: Actions = {
  deleteUser: async ({ request, fetch }) => {
    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();

    if (!userId) {
      return fail(400, { error: 'User ID is required' });
    }

    try {
      await deleteUser(fetch, userId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return fail(500, { error: 'Failed to delete user' });
    }
  },
  
  toggleStatus: async ({ request, fetch }) => {
    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();
    const currentStatus = formData.get('currentStatus') === 'true';

    if (!userId) {
      return fail(400, { error: 'User ID is required' });
    }

    try {
      await updateUser(fetch, userId, { isActive: !currentStatus });
      return { success: true };
    } catch (error) {
      console.error('Error toggling user status:', error);
      return fail(500, { error: 'Failed to update user status' });
    }
  }
};