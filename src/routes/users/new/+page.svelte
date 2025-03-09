<script lang="ts">
  import {
    Card,
    Button,
    Spinner,
    Label,
    Input,
    Select,
    Checkbox,
  } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { toast } from "$lib/stores/toast";
  import type { APIResponse } from "$lib/types/common";


  let userData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    isActive: true,
  };

  let loading = false;

  const roleOptions = [
    { value: "admin", name: "Admin" },
    { value: "user", name: "User" },
  ];

  function goBack() {
    goto("/users");
  }

  async function handleSubmit() {
  loading = true;

  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  try {
    const response = await fetch("/users/new", {
      method: "POST",
      body: formData,
    });

    let errorMessage = "An unknown error occurred";

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log(JSON.stringify(errorData))
        errorMessage = errorData?.error || `Error ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data: APIResponse<any> = await response.json();

    if (data.error) {
      toast.error(`API Error: ${data.error}`).code(response.status.toString()).show();
      return;
    }

    toast.success("User created successfully!").show();
    goto("/users");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
    console.log(JSON.stringify(err))
    toast.error(`Submission failed: ${errorMessage}`).show();
  } finally {
    loading = false;
  }
}




</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to Users
    </Button>
    <h1 class="text-2xl font-bold">Create New User</h1>
  </div>

  <Card class="max-w-3xl">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="firstName" class="mb-2">First Name *</Label>
          <Input id="firstName" bind:value={userData.firstName} required />
        </div>

        <div>
          <Label for="lastName" class="mb-2">Last Name</Label>
          <Input id="lastName" bind:value={userData.lastName} />
        </div>

        <div>
          <Label for="email" class="mb-2">Email *</Label>
          <Input id="email" type="email" bind:value={userData.email} required />
        </div>

        <div>
          <Label for="phone" class="mb-2">Phone</Label>
          <Input id="phone" type="tel" bind:value={userData.phone} />
        </div>

        <div>
          <Label for="password" class="mb-2">Password *</Label>
          <Input
            id="password"
            type="password"
            bind:value={userData.password}
            required
          />
        </div>

        <div>
          <Label for="role" class="mb-2">Role *</Label>
          <Select
            id="role"
            items={roleOptions}
            bind:value={userData.role}
            required
          />
        </div>

        <div class="flex items-center">
          <Checkbox id="isActive" bind:checked={userData.isActive} />
          <Label for="isActive" class="ml-2">Active</Label>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button color="light" on:click={goBack}>Cancel</Button>
        <Button type="submit" color="green" disabled={loading}>
          {#if loading}
            <Spinner size="sm" class="mr-2" />
          {/if}
          Create User
        </Button>
      </div>
    </form>
  </Card>
</div>