import type { Actions } from "./$types";
import { ownerAPI } from "$lib/server/api/owner";  // Assuming you have an API for Owner
import type { Owner } from "$lib/types/owner";  // Using the Owner type
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();

    // Extract form values
    const name = formData.get("name")?.toString().trim() || "";
    const mobile = formData.get("mobile")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const communicationMedium = formData.get("communicationMedium")?.toString().trim() || "";
    const insurance = formData.get("insurance")?.toString().trim() || "";
    const accountNumber = formData.get("accountNumber")?.toString().trim() || "";
    const bsb = formData.get("bsb")?.toString().trim() || "";
    const identification = formData.get("identification")?.toString().trim() || "";
    const address = formData.get("address")?.toString().trim() || "";
    const notes = formData.get("notes")?.toString().trim() || "";

    // Create owner
    const ownerData: Partial<Owner> = {
      name,
      mobile,
      email,
      communicationMedium,
      insurance,
      accountNumber,
      bsb,
      identification,
      address,
      notes
    };

    try {
      return await ownerAPI.create(ownerData); // Assuming you have an API method for creating an owner
    } catch (error) {
      return fail(500, { message: 'Error creating owner' });
    }
  },
};
