<script lang="ts">
  import { Card, Button, Spinner, Label, Input, Select } from 'flowbite-svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Tenant } from '$lib/types/tenant.js';
  import type { APIResponse } from '$lib/types/common';
  import { communicationOptions } from '$lib/types/option.js';

  export let data;
  let response = data.tenant;
  let tenant = response.data as Tenant;
  let loading = false;

  function goBack() {
    goto(`/tenants/${tenant.id}`);
  }

  const handleSubmit: SubmitFunction = () => {
    loading = true;

    return async ({ result, update }) => {
      loading = false;

      if (result.type === "redirect") {
        // Redirect responses don't have `data`, so handle them separately.
        goto(result.location);
        return;
      }

      if (result.type === "failure" || result.type === "success") {
        // Now TypeScript knows `data` exists.
        const response = result.data as APIResponse<any>;

        if (!response.success) {
          toast
            .error(`${response?.error || "Unknown error"}`)
            .code((response?.statusCode || 500).toString())
            .show();
          return;
        }

        toast.success("Tenant updated successfully!").show();
        goto("/tenants");
      } else {
        // Handle unexpected case
        update();
      }
    };
  };
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to Tenant Details
    </Button>
    <h1 class="text-2xl font-bold">Edit Tenant</h1>
  </div>

  <Card class="max-w-3xl">
    <form method="POST" action="?/updateTenant" use:enhance={handleSubmit}>
      <input type="hidden" name="id" value={tenant.id} />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="name" class="mb-2">Name *</Label>
          <Input id="name" name="name" bind:value={tenant.name} required />
        </div>

        <div>
          <Label for="mobile" class="mb-2">Mobile *</Label>
          <Input id="mobile" name="mobile" bind:value={tenant.mobile} required />
        </div>

        <div>
          <Label for="email" class="mb-2">Email *</Label>
          <Input id="email" type="email" name="email" bind:value={tenant.email} required />
        </div>

        <div>
          <Label for="communicationMedium" class="mb-2">Communication Medium *</Label>
          <Select
            id="communicationMedium"
            name="communicationMedium"
            items={communicationOptions}
            bind:value={tenant.communicationMedium}
          />
        </div>

        <div class="col-span-full">
          <Label for="notes" class="mb-2">Notes</Label>
          <Input 
            id="notes" 
            name="notes" 
            bind:value={tenant.notes} 
            placeholder="Additional information"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button color="light" on:click={goBack}>Cancel</Button>
        <Button type="submit" color="purple" disabled={loading}>
          {#if loading}
            <Spinner size="sm" class="mr-2" />
          {/if}
          Save Changes
        </Button>
      </div>
    </form>
  </Card>
</div>