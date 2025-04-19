<script lang="ts">
  import { Card, Button, Spinner, Label, Input, Select, Checkbox, Badge } from 'flowbite-svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Owner } from '$lib/types/owner.js'; // Updated type for Owner
  import type { APIResponse } from '$lib/types/common';
  import { communicationOptions } from '$lib/types/option.js';

  export let data;
  let response = data.owner;
  let owner = response.data as Owner;  // Changed to use Owner type
  let loading = false;

  function goBack() {
    goto(`/owners/${owner.id}`);
  }

  const handleSubmit: SubmitFunction = () => {
    loading = true;

    return async ({ result, update }) => {
      loading = false;

      if (result.type === "redirect") {
        goto(result.location);
        return;
      }

      if (result.type === "failure" || result.type === "success") {
        const response = result.data as APIResponse<any>;

        if (!response.success) {
          toast
            .error(`${response?.error || "Unknown error"}`)
            .code((response?.statusCode || 500).toString())
            .show();
          return;
        }

        toast.success("Owner updated successfully!").show();
        goto("/owners");
      } else {
        update();
      }
    };
  };
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to Owner Details
    </Button>
    <h1 class="text-2xl font-bold">Edit Owner</h1>
  </div>

  <Card class="max-w-3xl">
    <form method="POST" action="?/update" use:enhance={handleSubmit}>
      <input type="hidden" name="id" value={owner.id} />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="name" class="mb-2">Name *</Label>
          <Input id="name" name="name" bind:value={owner.name} required />
        </div>

        <div>
          <Label for="mobile" class="mb-2">Mobile *</Label>
          <Input id="mobile" name="mobile" bind:value={owner.mobile} required />
        </div>

        <div>
          <Label for="email" class="mb-2">Email *</Label>
          <Input id="email" type="email" name="email" bind:value={owner.email} required />
        </div>

        <div>
          <Label for="communicationMedium" class="mb-2">Communication Medium *</Label>
          <Select
            id="communicationMedium"
            name="communicationMedium"
            items={communicationOptions}
            bind:value={owner.communicationMedium}
          />
        </div>

        <div>
          <Label for="insurance" class="mb-2">Insurance *</Label>
          <Input id="insurance" name="insurance" bind:value={owner.insurance} required />
        </div>

        <div>
          <Label for="accountNumber" class="mb-2">Account Number *</Label>
          <Input id="accountNumber" name="accountNumber" bind:value={owner.accountNumber} required />
        </div>

        <div>
          <Label for="bsb" class="mb-2">BSB *</Label>
          <Input id="bsb" name="bsb" bind:value={owner.bsb} required />
        </div>

        <div>
          <Label for="identification" class="mb-2">Identification *</Label>
          <Input id="identification" name="identification" bind:value={owner.identification} required />
        </div>

        <div>
          <Label for="address" class="mb-2">Address *</Label>
          <Input id="address" name="address" bind:value={owner.address} required />
        </div>

        <div>
          <Label for="isActive" class="mb-2">Status *</Label>
          <div class="flex items-center gap-3">
            <Select id="isActive" name="isActive" bind:value={owner.isActive} class="w-full">
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </Select>
            <Badge color={owner.isActive ? "green" : "red"} class="whitespace-nowrap">
              {owner.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
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