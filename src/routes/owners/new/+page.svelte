<script lang="ts">
  import {
    Card,
    Button,
    Spinner,
    Label,
    Input,
    Select,
  } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { toast } from "$lib/stores/toast";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { APIResponse } from "$lib/types/common";
  import { communicationOptions } from "$lib/types/option";

  let ownerData = {
    name: "",
    mobile: "",
    email: "",
    communicationMedium: "",
    insurance: "",
    accountNumber: "",
    bsb: "",
    identification: "",
    address: "",
  };

  let loading = false;

  function goBack() {
    goto("/owners");  // Navigate to owners page
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
        const response = result.data as APIResponse<any>;

        if (!response.success) {
          toast
            .error(`${response?.error || "Unknown error"}`)
            .code((response?.statusCode || 500).toString())
            .show();
          return;
        }

        toast.success("Owner created successfully!").show();
        goto("/owners");  // Redirect to owners list after successful creation
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
      Back to Owners
    </Button>
    <h1 class="text-2xl font-bold">Create New Owner</h1>
  </div>

  <Card class="max-w-3xl">
    <form method="POST" action="?/create" use:enhance={handleSubmit}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="name" class="mb-2">Name *</Label>
          <Input id="name" name="name" bind:value={ownerData.name} required />
        </div>

        <div>
          <Label for="mobile" class="mb-2">Mobile *</Label>
          <Input id="mobile" name="mobile" bind:value={ownerData.mobile} required />
        </div>

        <div>
          <Label for="email" class="mb-2">Email *</Label>
          <Input id="email" name="email" type="email" bind:value={ownerData.email} required />
        </div>

        <div>
          <Label for="communicationMedium" class="mb-2">Communication Medium *</Label>
          <Select
            id="communicationMedium"
            name="communicationMedium"
            items={communicationOptions}
            bind:value={ownerData.communicationMedium}
          />
        </div>

        <div>
          <Label for="insurance" class="mb-2">Insurance</Label>
          <Input id="insurance" name="insurance" bind:value={ownerData.insurance} />
        </div>

        <div>
          <Label for="accountNumber" class="mb-2">Account Number *</Label>
          <Input id="accountNumber" name="accountNumber" bind:value={ownerData.accountNumber} required />
        </div>

        <div>
          <Label for="bsb" class="mb-2">BSB *</Label>
          <Input id="bsb" name="bsb" bind:value={ownerData.bsb} required />
        </div>

        <div>
          <Label for="identification" class="mb-2">Identification *</Label>
          <Input id="identification" name="identification" bind:value={ownerData.identification} required />
        </div>

        <div>
          <Label for="address" class="mb-2">Address</Label>
          <Input id="address" name="address" bind:value={ownerData.address} />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button color="light" on:click={goBack}>Cancel</Button>
        <Button type="submit" color="green" disabled={loading}>
          {#if loading}
            <Spinner size="sm" class="mr-2" />
          {/if}
          Create Owner
        </Button>
      </div>
    </form>
  </Card>
</div>
