import { userAPI } from '$lib/server/api/user';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import type { Role, User } from '$lib/types/user';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const userID = params.id;
    const user = await userAPI.getUserByID(userID);

    return { user };
  } catch (err) {
    throw error(404, { message: 'User not found' });
  }
};

// Action to handle user update
export const actions: Actions = {
  updateUser: async ({ request, params }) => {
    const userID = params.id;
    const formData = await request.formData();

    const updatedData: Partial<User> = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') ? (formData.get('password') as string) : undefined, // Optional
      role: formData.get('role') as Role,
      isActive: formData.get('isActive') === 'on' // Convert checkbox to boolean
    };

    return userAPI.updateUser(userID, updatedData);

  }
};
