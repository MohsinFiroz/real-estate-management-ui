import { userAPI } from '$lib/server/api/user';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const userID = params.id;
    const userResponse = await userAPI.getUserByID(userID);

    return {
      userResponse
    };
  } catch (err) {
    throw error(404, {
      message: 'User not found'
    });
  }
};

// Action to handle user deletion
export const actions: Actions = {
  deleteUser: async ({ request }) => {
    console.log("hjjkhjkhjh")

    const formData = await request.formData();
    const userID = formData.get('id');

    if (!userID) {
      return { error: 'User ID is required' };
    }
    return userAPI.deleteUser(userID.toString());
  }
};
