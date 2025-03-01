import { getUserByID, deleteUser } from '$lib/server/api/user';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const userID = params.id;
    const user = await getUserByID(userID);

    return {
      user
    };
  } catch (err) {
    throw error(404, {
      message: 'User not found'
    });
  }
};

// Action to handle user deletion
export const actions: Actions = {
  deleteUser: async ({ request, params }) => {
    // const formData = new URLSearchParams(await request.text());
    const userID = params.id;

    try {
      await deleteUser(userID);
      // Redirect to users list after successful deletion
      throw redirect(303, '/users');
    } catch (err) {
      return { error: 'Failed to delete user' };
    }
  }
};
