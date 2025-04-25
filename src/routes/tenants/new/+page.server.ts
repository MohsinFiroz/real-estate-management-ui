import type { Actions } from "./$types";
import { tenantAPI } from "$lib/server/api/tenant";
import type { Tenant } from "$lib/types/tenant";
import type { APIResponse } from "$lib/types/common";
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  createTenant: async ({ request }) => {
    const formData = await request.formData();

    // Extract form values
    const name = formData.get("name")?.toString().trim() || "";
    const mobile = formData.get("mobile")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const communicationMedium = formData.get("communicationMedium")?.toString() || "";

    // Create tenant
    const tenantData: Partial<Tenant> = {
      name,
      mobile,
      email,
      communicationMedium,
    };

    return await tenantAPI.create(tenantData);      
  },
};