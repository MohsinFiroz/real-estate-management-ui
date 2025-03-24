<script lang="ts">
  import { Card, Button, Badge } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { Modal, Alert } from "flowbite-svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";
  import type { Property } from "$lib/types/property.js";
  import { enhance } from "$app/forms";
  import type { APIResponse } from "$lib/types/common.js";
  import { toast } from "$lib/stores/toast.js";
  import type { SubmitFunction } from "@sveltejs/kit";

  export let data;
  
  let response = data.propertyResponse;
  let property = response.data as Property;
  let loading = false;
  let showDeleteModal = false;

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  }

  function goBack() {
    goto("/properties");
  }

  function editProperty() {
    goto(`/properties/${property.id}/edit`);
  }

  // Toggle delete modal
  function toggleDeleteModal() {
    showDeleteModal = !showDeleteModal;
  }

  const handleSubmit: SubmitFunction = () => {
  loading = true;
  
  return async ({ result }) => {
    loading = false;
    
    if (result.type === "redirect") {
      goto(result.location);
      return;
    }

    if (result.type === "failure") {
      toast.error("Failed to delete property.").show();
      return;
    }

    toast.success("Property deleted successfully!").show();
    showDeleteModal = false;
    goto("/properties");
  };
};

</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to Properties
    </Button>
    <h1 class="text-2xl font-bold">Property Details</h1>
  </div>
  {#if loading}
    <div class="flex justify-center my-8">
      <Spinner />
    </div>
  {:else}
    <Card class="max-w-3xl">
      <h2 class="text-xl font-semibold mb-6">
        {property.address}, {property.suburb}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Postcode</h3>
          <p>{property.postcode}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Key Number</h3>
          <p>{property.keyNo || "N/A"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Management Fee</h3>
          <p>{property.managementFee}%</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Water Bill Account</h3>
          <p>{property.waterBillAccount || "N/A"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Last Water Bill Reading</h3>
          <p>{property.lastWaterBillReading || "N/A"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Updated At</h3>
          <p>{formatDate(property.updatedAt)}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Created At</h3>
          <p>{formatDate(property.createdAt)}</p>
        </div>
      </div>

      {#if property.notes}
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Notes</h3>
          <p class="text-gray-700">{property.notes}</p>
        </div>
      {/if}

      {#if property.other}
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Other Information</h3>
          <p class="text-gray-700">{property.other}</p>
        </div>
      {/if}

      <div class="flex gap-2 justify-end">
        <Button color="purple" on:click={editProperty}>Edit Property</Button>
        <Button color="red" on:click={toggleDeleteModal}>Delete Property</Button>
      </div>
    </Card>
  {/if}
</div>

<Modal bind:open={showDeleteModal} size="md">
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Are you sure you want to delete this property?
    </h3>
    <div class="flex justify-center gap-4">
      <form method="POST" action="?/delete" use:enhance={handleSubmit}>
        <input type="hidden" name="id" value={property.id} />
        <Button color="red" type="submit" disabled={loading}>
          {#if loading}
            <Spinner />
          {/if}
          Yes, delete property
        </Button>
      </form>      
      <Button color="light" on:click={toggleDeleteModal}>No, cancel</Button>
    </div>
  </div>
</Modal>