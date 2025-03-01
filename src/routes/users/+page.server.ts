// src/routes/users/+page.server.ts
import { listUsers, deleteUser } from '$lib/server/api/user'; // Import deleteUser function
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  let page = parseInt(url.searchParams.get('page') || '1');
  let pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  let searchQuery = url.searchParams.get('searchQuery') || '';
  let sortBy = url.searchParams.get('sortBy') || 'createdAt:desc';

  const listResponse = await listUsers({ page, pageSize, searchQuery, sortBy });

  return {
    listResponse
  };
};

// Action to handle user deletion
export const actions: Actions = {
  deleteUser: async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const userID = formData.get('id'); // Get userId from the form data

    if (!userID) {
      return { error: 'User ID is required' };
    }

    try {
      await deleteUser(userID); // Call the deleteUser function
      // Redirect to the users list after successful deletion
      throw redirect(303, '/users');
    } catch (err) {
      return { error: 'Failed to delete user' };
    }
  }
};
