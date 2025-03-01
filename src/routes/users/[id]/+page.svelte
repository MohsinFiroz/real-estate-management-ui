<script lang="ts">
    import { Card, Button, Spinner, Badge } from 'flowbite-svelte';
    import { ArrowLeftOutline } from 'flowbite-svelte-icons';
    import { goto } from '$app/navigation';
    import { Modal, Alert } from 'flowbite-svelte';
    export let data;
    
    let user = data.user;
    let loading = false;
    let error = '';
    let showDeleteModal = false;
    let deleteSuccess = false;
    
    function formatDate(dateString: string | null) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString();
    }
    
    function goBack() {
      goto('/users');
    }
    
    function editUser() {
      goto(`/users/${user.id}/edit`);
    }
  
    // Toggle delete modal
    function toggleDeleteModal() {
      showDeleteModal = !showDeleteModal;
    }
  </script>
  
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center gap-4">
      <Button color="light" class="flex items-center gap-2" on:click={goBack}>
        <ArrowLeftOutline class="w-4 h-4" />
        Back to Users
      </Button>
      <h1 class="text-2xl font-bold">User Details</h1>
    </div>
  
    {#if deleteSuccess}
      <Alert color="green" class="mb-4">
        User deleted successfully. Redirecting...
      </Alert>
    {/if}
    
    {#if error}
      <Alert color="red" class="mb-4">
        {error}
      </Alert>
    {/if}
  
    {#if loading}
      <div class="flex justify-center my-8">
        <Spinner size="xl" />
      </div>
    {:else}
      <Card class="max-w-3xl">
        <h2 class="text-xl font-semibold mb-6">{user.firstName} {user.lastName}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500">Email</h3>
            <p>{user.email}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Phone</h3>
            <p>{user.phone || 'N/A'}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Role</h3>
            <Badge color={user.role === 'admin' ? 'purple' : 'blue'}>
              {user.role}
            </Badge>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Status</h3>
            <Badge color={user.isActive ? 'green' : 'red'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Created At</h3>
            <p>{formatDate(user.createdAt)}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">Last Login</h3>
            <p>{formatDate(user.lastLogin)}</p>
          </div>
        </div>
  
        <div class="flex gap-2 justify-end">
          <Button color="purple" on:click={editUser}>Edit User</Button>
          <!-- Button to open delete modal -->
          <Button color="red" on:click={toggleDeleteModal}>Delete User</Button>
        </div>
      </Card>
    {/if}
  </div>
  
  <Modal bind:open={showDeleteModal} size="md" autoclose>
    <div class="text-center">
      <h3 class="mb-5 text-lg font-normal text-gray-500">
        Are you sure you want to delete this user?
      </h3>
      <div class="flex justify-center gap-4">
        <form method="POST" action="?/deleteUser" class="inline">
          <Button color="red" type="submit" disabled={loading}>
            {#if loading}
              <Spinner size="sm" class="mr-2" />
            {/if}
            Yes, delete user
          </Button>
        </form>
        <Button color="light" on:click={toggleDeleteModal}>No, cancel</Button>
      </div>
    </div>
  </Modal>
  