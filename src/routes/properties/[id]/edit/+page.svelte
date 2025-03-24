<script lang="ts">
  import { Card, Button, Spinner, Label, Input, Textarea } from 'flowbite-svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Property } from '$lib/types/property.js';
  import type { APIResponse } from '$lib/types/common';

  export let data;
  let response = data.property;
  let property = response.data as Property;
  let loading = false;

  function goBack() {
    goto(`/properties/${property.id}`);
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

        toast.success("Property updated successfully!").show();
        goto("/properties");
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
      Back to Property Details
    </Button>
    <h1 class="text-2xl font-bold">Edit Property</h1>
  </div>

  <Card class="max-w-3xl">
    <form method="POST" action="?/updateProperty" use:enhance={handleSubmit}>
      <input type="hidden" name="id" value={property.id} />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="address" class="mb-2">Address *</Label>
          <Input id="address" name="address" bind:value={property.address} required />
        </div>

        <div>
          <Label for="suburb" class="mb-2">Suburb *</Label>
          <Input id="suburb" name="suburb" bind:value={property.suburb} required />
        </div>

        <div>
          <Label for="postcode" class="mb-2">Postcode *</Label>
          <Input id="postcode" name="postcode" bind:value={property.postcode} required />
        </div>

        <div>
          <Label for="keyNo" class="mb-2">Key Number</Label>
          <Input id="keyNo" name="keyNo" bind:value={property.keyNo} />
        </div>

        <div>
          <Label for="managementFee" class="mb-2">Management Fee (%) *</Label>
          <Input id="managementFee" type="number" step="0.01" name="managementFee" bind:value={property.managementFee} required />
        </div>

        <div>
          <Label for="waterBillAccount" class="mb-2">Water Bill Account</Label>
          <Input id="waterBillAccount" name="waterBillAccount" bind:value={property.waterBillAccount} />
        </div>

        <div>
          <Label for="lastWaterBillReading" class="mb-2">Last Water Bill Reading</Label>
          <Input id="lastWaterBillReading" type="number" step="0.01" name="lastWaterBillReading" bind:value={property.lastWaterBillReading} />
        </div>
      </div>

      <div class="mb-6">
        <Label for="notes" class="mb-2">Notes</Label>
        <Textarea id="notes" name="notes" bind:value={property.notes} />
      </div>

      <div class="mb-6">
        <Label for="other" class="mb-2">Other Information</Label>
        <Textarea id="other" name="other" bind:value={property.other} />
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