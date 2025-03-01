<script lang="ts">
  import { Card, Button, Spinner, Label, Input, Select, Checkbox, Alert } from 'flowbite-svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  export let data;
  let { user } = data;
  let success = false;
  let error = '';

  function goBack() {
    goto(`/users/${user.id}`);
  }

  async function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: form.method,
      body: formData
    });

    if (response.ok) {
      success = true;
      error = '';
      setTimeout(() => goto('/users'), 2000); // Redirect after success
    } else {
      const data = await response.json();
      error = data.error || 'Failed to update user';
      success = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to User Details
    </Button>
    <h1 class="text-2xl font-bold">Edit User</h1>
  </div>

  {#if success}
    <Alert color="green" class="mb-4">User updated successfully! Redirecting...</Alert>
  {/if}

  {#if error}
    <Alert color="red" class="mb-4">{error}</Alert>
  {/if}

  <Card class="max-w-3xl">
    <form method="post" action="?/updateUser" use:enhance on:submit|preventDefault={handleSubmit}>
      <input type="hidden" name="id" value={user.id} />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label for="firstName">First Name *</Label>
          <Input id="firstName" name="firstName" bind:value={user.firstName} required />
        </div>

        <div>
          <Label for="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" bind:value={user.lastName} />
        </div>

        <div>
          <Label for="email">Email *</Label>
          <Input id="email" type="email" name="email" bind:value={user.email} required />
        </div>

        <div>
          <Label for="phone">Phone</Label>
          <Input id="phone" type="tel" name="phone" bind:value={user.phone} />
        </div>

        <div>
          <Label for="password">Password (leave empty to keep current)</Label>
          <Input id="password" type="password" name="password" />
        </div>

        <div>
          <Label for="role">Role *</Label>
          <Select id="role" name="role" bind:value={user.role} required>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Select>
        </div>

        <div class="flex items-center">
          <Checkbox id="isActive" name="isActive" bind:checked={user.isActive} />
          <Label for="isActive" class="ml-2">Active</Label>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button color="light" on:click={goBack}>Cancel</Button>
        <Button type="submit" color="purple">Save Changes</Button>
      </div>
    </form>
  </Card>
</div>
