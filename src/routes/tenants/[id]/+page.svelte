<script lang="ts">
  import { Card, Button, Badge } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { Modal, Alert } from "flowbite-svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";
  import type { Tenant } from "$lib/types/tenant.js";
  import { enhance } from "$app/forms";
  import type { APIResponse } from "$lib/types/common.js";
  import { toast } from "$lib/stores/toast.js";
  import type { SubmitFunction } from "@sveltejs/kit";

  export let data;
  
  let response = data.tenantResponse;
  let tenant = response.data as Tenant;
  let loading = false;
  let showDeleteModal = false;

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  }

  function goBack() {
    goto("/tenants");
  }

  function editTenant() {
    goto(`/tenants/${tenant.id}/edit`);
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
        toast.error("Failed to delete tenant.").show();
        return;
      }

      toast.success("Tenant deleted successfully!").show();
      showDeleteModal = false;
      goto("/tenants");
    };
  };
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to Tenants
    </Button>
    <h1 class="text-2xl font-bold">Tenant Details</h1>
  </div>
  {#if loading}
    <div class="flex justify-center my-8">
      <Spinner />
    </div>
  {:else}
    <Card class="max-w-3xl">
      <h2 class="text-xl font-semibold mb-6">
        {tenant.name}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Email</h3>
          <p>{tenant.email}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Mobile</h3>
          <p>{tenant.mobile || "N/A"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Communication Medium</h3>
          <Badge color="blue">
            {tenant.communicationMedium}
          </Badge>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Notes</h3>
          <p>{tenant.notes || "N/A"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Updated At</h3>
          <p>{formatDate(tenant.updatedAt)}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Created At</h3>
          <p>{formatDate(tenant.createdAt)}</p>
        </div>
      </div>

      <div class="flex gap-2 justify-end">
        <Button color="purple" on:click={editTenant}>Edit Tenant</Button>
        <Button color="red" on:click={toggleDeleteModal}>Delete Tenant</Button>
      </div>
    </Card>
  {/if}
</div>

<Modal bind:open={showDeleteModal} size="md">
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Are you sure you want to delete this tenant?
    </h3>
    <div class="flex justify-center gap-4">
      <form method="POST" action="?/deleteTenant" use:enhance={handleSubmit}>
        <input type="hidden" name="id" value={tenant.id} />
        <Button color="red" type="submit" disabled={loading}>
          {#if loading}
            <Spinner />
          {/if}
          Yes, delete tenant
        </Button>
      </form>      
      <Button color="light" on:click={toggleDeleteModal}>No, cancel</Button>
    </div>
  </div>
</Modal>