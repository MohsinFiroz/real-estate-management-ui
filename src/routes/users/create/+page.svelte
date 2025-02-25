<script lang="ts">
    import { enhance } from '$app/forms';
    import { 
      Button, 
      Card, 
      Input, 
      Label, 
      Radio,
    } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    import { RoleAdmin, RoleUser } from '$lib/types/user';
  
    // Form fields
    let email = '';
    let password = '';
    let firstName = '';
    let lastName = '';
    let phone = '';
    let role = RoleUser;
    let isActive = true;
    let serverError = '';
    
    // Handle cancel
    function cancelCreate() {
      goto('/users');
    }
  </script>
  
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Create New User</h1>
    
    <Card class="max-w-lg mx-auto">
      {#if serverError}
        <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {serverError}
        </div>
      {/if}
      
      <form method="POST" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'failure') {
            serverError = JSON.stringify(result.data?.error) || 'Failed to create user';
          }
        };
      }}>
        <div class="grid gap-6 mb-6">
          <div>
            <Label for="email">Email Address <span class="text-red-500">*</span></Label>
            <Input id="email" name="email" type="email" required bind:value={email} placeholder="email@example.com" />
          </div>
          
          <div>
            <Label for="password">Password <span class="text-red-500">*</span></Label>
            <Input id="password" name="password" type="password" required bind:value={password} minlength={8} />
          </div>
          
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
        </div>
        
        <div class="flex items-center justify-end space-x-3 mt-6">
          <Button color="alternative" on:click={cancelCreate}>Cancel</Button>
          <Button type="submit">Create User</Button>
        </div>
      </form>
    </Card>
  </div>