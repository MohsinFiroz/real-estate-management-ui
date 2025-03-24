<script lang="ts">
  import {
    Card,
    Button,
    Spinner,
    Label,
    Input,
    Checkbox,
    Textarea,
  } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { toast } from "$lib/stores/toast";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { APIResponse } from "$lib/types/common";

  let propertyData = {
    ownerID: "",
    address: "",
    suburb: "",
    postcode: "",
    keyNo: "",
    managementFee: 0,
    waterBillAccount: "",
    lastWaterBillReading: 0,
    notes: "",
    other: "",
  };

  let loading = false;

  function goBack() {
    goto("/properties");
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

        toast.success("Property created successfully!").show();
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
      Back to Properties
    </Button>
    <h1 class="text-2xl font-bold">Create New Property</h1>
  </div>

  <Card class="max-w-3xl">
    <form method="POST" action="?/createProperty" use:enhance={handleSubmit}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="ownerID" class="mb-2">Owner ID *</Label>
          <Input id="ownerID" name="ownerID" bind:value={propertyData.ownerID} required />
        </div>

        <div>
          <Label for="address" class="mb-2">Address *</Label>
          <Input id="address" name="address" bind:value={propertyData.address} required />
        </div>

        <div>
          <Label for="suburb" class="mb-2">Suburb *</Label>
          <Input id="suburb" name="suburb" bind:value={propertyData.suburb} required />
        </div>

        <div>
          <Label for="postcode" class="mb-2">Postcode *</Label>
          <Input id="postcode" name="postcode" bind:value={propertyData.postcode} required />
        </div>

        <div>
          <Label for="keyNo" class="mb-2">Key Number</Label>
          <Input id="keyNo" name="keyNo" bind:value={propertyData.keyNo} />
        </div>

        <div>
          <Label for="managementFee" class="mb-2">Management Fee (%)</Label>
          <Input 
            id="managementFee" 
            name="managementFee" 
            type="number" 
            step="0.01" 
            bind:value={propertyData.managementFee} 
          />
        </div>

        <div>
          <Label for="waterBillAccount" class="mb-2">Water Bill Account</Label>
          <Input id="waterBillAccount" name="waterBillAccount" bind:value={propertyData.waterBillAccount} />
        </div>

        <div>
          <Label for="lastWaterBillReading" class="mb-2">Last Water Bill Reading</Label>
          <Input 
            id="lastWaterBillReading" 
            name="lastWaterBillReading" 
            type="number" 
            step="0.01" 
            bind:value={propertyData.lastWaterBillReading} 
          />
        </div>

        <div class="md:col-span-2">
          <Label for="notes" class="mb-2">Notes</Label>
          <Textarea id="notes" name="notes" bind:value={propertyData.notes} rows={3} />
        </div>

        <div class="md:col-span-2">
          <Label for="other" class="mb-2">Other Information</Label>
          <Textarea id="other" name="other" bind:value={propertyData.other} rows={3} />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button color="light" on:click={goBack}>Cancel</Button>
        <Button type="submit" color="green" disabled={loading}>
          {#if loading}
            <Spinner size="sm" class="mr-2" />
          {/if}
          Create Property
        </Button>
      </div>
    </form>
  </Card>
</div>