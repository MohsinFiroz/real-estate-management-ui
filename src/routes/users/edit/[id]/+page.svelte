<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button, Card, Input, Label,Radio, Toggle } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    import { RoleAdmin, RoleUser } from '$lib/types/user';
    import type { PageData } from './$types';
  
    export let data: PageData;
  
    // Form fields
    let firstName = data.user.firstName;
    let lastName = data.user.lastName;
    let phone = data.user.phone || '';
    let role = data.user.role;
    let isActive = data.user.isActive;
    let serverError = '';
  
    // Handle cancel
    function cancelEdit() {
      goto('/users');
    }
  </script>
  
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Edit User</h1>
    <Card class="max-w-lg mx-auto">
      {#if serverError}
        <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {serverError}
        </div>
      {/if}
  
      <form method="POST" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'failure') {
            serverError = JSON.stringify(result.data?.error) || 'Failed to update user';
          }
        };
      }}>
        <div class="grid gap-6 mb-6">
          <div class="grid md:grid-cols-2 md:gap-4">
            <div>
              <Label for="firstName">First Name <span class="text-red-500">*</span></Label>
              <Input id="firstName" name="firstName" required bind:value={firstName} />
            </div>
            <div>
              <Label for="lastName">Last Name <span class="text-red-500">*</span></Label>
              <Input id="lastName" name="lastName" required bind:value={lastName} />
            </div>
          </div>
          <div>
            <Label for="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" bind:value={phone} placeholder="Optional" />
          </div>
          <div>
            <Label>User Role <span class="text-red-500">*</span></Label>
            <div class="flex gap-4">
              <Radio name="role" value={RoleUser} bind:group={role}>User</Radio>
              <Radio name="role" value={RoleAdmin} bind:group={role}>Admin</Radio>
            </div>
          </div>
          <div>
            <Label for="isActive" class="flex items-center gap-2">
              <Toggle id="isActive" name="isActive" bind:checked={isActive} />
              <span>Active Account</span>
            </Label>
            <input type="hidden" name="isActive" value={isActive.toString()} />
          </div>
        </div>
        <div class="flex items-center justify-end space-x-3 mt-6">
          <Button color="alternative" on:click={cancelEdit}>Cancel</Button>
          <Button type="submit" color="primary">Save Changes</Button>
        </div>
      </form>
    </Card>
  </div>