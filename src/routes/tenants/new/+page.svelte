<script lang="ts">
  import {
    Card,
    Button,
    Spinner,
    Label,
    Input,
    Select,
    Checkbox,
    Textarea,
  } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { toast } from "$lib/stores/toast";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { APIResponse } from "$lib/types/common";

  let tenantData = {
    name: "",
    mobile: "",
    email: "",
    communicationMedium: "",
    notes: "",
  };

  let loading = false;

  const communicationMediumOptions = [
    { value: "email", name: "Email" },
    { value: "phone", name: "Phone" },
    { value: "both", name: "Both" },
  ];

  function goBack() {
    goto("/tenants");
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

        toast.success("Tenant created successfully!").show();
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
      Back to Tenants
    </Button>
    <h1 class="text-2xl font-bold">Create New Tenant</h1>
  </div>

  <Card class="max-w-3xl">
    <form method="POST" action="?/createTenant" use:enhance={handleSubmit}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="name" class="mb-2">Name *</Label>
          <Input id="name" name="name" bind:value={tenantData.name} required />
        </div>

        <div>
          <Label for="mobile" class="mb-2">Mobile Number</Label>
          <Input id="mobile" name="mobile" type="tel" bind:value={tenantData.mobile} />
        </div>

        <div>
          <Label for="email" class="mb-2">Email *</Label>
          <Input id="email" name="email" type="email" bind:value={tenantData.email} required />
        </div>

        <div>
          <Label for="communicationMedium" class="mb-2">Communication Medium *</Label>
          <Select
            id="communicationMedium"
            name="communicationMedium"
            items={communicationMediumOptions}
            bind:value={tenantData.communicationMedium}
            required
          />
        </div>

        <div class="md:col-span-2">
          <Label for="notes" class="mb-2">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            bind:value={tenantData.notes} 
          />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button color="light" on:click={goBack}>Cancel</Button>
        <Button type="submit" color="green" disabled={loading}>
          {#if loading}
            <Spinner size="sm" class="mr-2" />
          {/if}
          Create Tenant
        </Button>
      </div>
    </form>
  </Card>
</div>