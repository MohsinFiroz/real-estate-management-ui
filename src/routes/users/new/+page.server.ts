import type { Actions } from "./$types";
import { userAPI } from "$lib/server/api/user";
import type { Role, User } from "$lib/types/user";
import type { APIResponse } from "$lib/types/common";
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  createUser: async ({ request }) => {
    const formData = await request.formData();

    // Extract form values
    const firstName = formData.get("firstName")?.toString().trim() || "";
    const lastName = formData.get("lastName")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const role = formData.get("role") as Role | null;
    const isActive = formData.has("isActive");

    // Create user
    const userData: Partial<User> = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role as Role,
      isActive,
    };

    return await userAPI.createUser(userData);      
  },
};