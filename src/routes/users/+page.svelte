<script lang="ts">
  import { invalidate } from '$app/navigation'; // For invalidating and triggering re-fetch of data
  import UserTable from '$lib/components/UserTable.svelte';

  export let data;

  let response = data.listResponse;
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  // Function to handle user deletion
  const handleDeleteUser = async (userID: string) => {
    // Call the deleteUser action
    const result = await fetch('/users', {
      method: 'POST',
      body: new URLSearchParams({ id: userID })
    }).then((res) => res.json());

    if (result.success) {
      // On success, show success message
      successMessage = 'User deleted successfully';
      errorMessage = null;
      // Invalidate to refetch the updated list of users
      await invalidate('listResponse');
    } else {
      // On failure, show error message
      errorMessage = result.error || 'An unknown error occurred';
      successMessage = null;
    }
  };
</script>

<UserTable data={response} deleteUser={handleDeleteUser} />

{#if successMessage}
  <p class="success">{successMessage}</p>
{/if}
{#if errorMessage}
  <p class="error">{errorMessage}</p>
{/if}
