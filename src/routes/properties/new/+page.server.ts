import type { Actions } from "./$types";
import { propertyAPI } from "$lib/server/api/property";
import type { Property } from "$lib/types/property";
import type { APIResponse } from "$lib/types/common";
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  createProperty: async ({ request }) => {
    const formData = await request.formData();

    // Extract form values
    const ownerID = formData.get("ownerID")?.toString().trim() || "";
    const address = formData.get("address")?.toString().trim() || "";
    const suburb = formData.get("suburb")?.toString().trim() || "";
    const postcode = formData.get("postcode")?.toString().trim() || "";
    const keyNo = formData.get("keyNo")?.toString().trim() || "";
    const managementFee = parseFloat(formData.get("managementFee")?.toString() || "0");
    const waterBillAccount = formData.get("waterBillAccount")?.toString().trim() || "";
    const lastWaterBillReading = parseFloat(formData.get("lastWaterBillReading")?.toString() || "0");
    const notes = formData.get("notes")?.toString().trim() || "";
    const other = formData.get("other")?.toString().trim() || "";

    // Create property
    const propertyData: Partial<Property> = {
      ownerID,
      address,
      suburb,
      postcode,
      keyNo,
      managementFee,
      waterBillAccount,
      lastWaterBillReading,
      notes,
      other
    };

    return await propertyAPI.create(propertyData);      
  },
};