<script lang="ts">
  import { Card, Button, Badge } from "flowbite-svelte";
  import { ArrowLeftOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import { Modal, Alert } from "flowbite-svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";
  import type { User } from "$lib/types/user.js";
  import { enhance } from "$app/forms";
  import type { APIResponse } from "$lib/types/common.js";
  import { toast } from "$lib/stores/toast.js";
  import type { SubmitFunction } from "@sveltejs/kit";

  export let data;
  
  let response = data.userResponse;
  let user = response.data as User;
  let loading = false;
  let showDeleteModal = false;

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  }

  function goBack() {
    goto("/users");
  }

  function editUser() {
    goto(`/users/${user.id}/edit`);
  }

  // Toggle delete modal
  function toggleDeleteModal() {
    showDeleteModal = !showDeleteModal;
  }

  const handleSubmit: SubmitFunction = () => {
  loading = true;
  
  return async ({ result }) => {
    loading = false;

    if (result.type === "redirect") {
      goto(result.location);
      return;
    }

    if (result.type === "failure") {
      toast.error("Failed to delete user.").show();
      return;
    }

    toast.success("User deleted successfully!").show();
    showDeleteModal = false;
    goto("/users");
  };
};

</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center gap-4">
    <Button color="light" class="flex items-center gap-2" on:click={goBack}>
      <ArrowLeftOutline class="w-4 h-4" />
      Back to Users
    </Button>
    <h1 class="text-2xl font-bold">User Details</h1>
  </div>
  {#if loading}
    <div class="flex justify-center my-8">
      <Spinner />
    </div>
  {:else}
    <Card class="max-w-3xl">
      <h2 class="text-xl font-semibold mb-6">
        {user.firstName} {user.lastName}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Email</h3>
          <p>{user.email}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Phone</h3>
          <p>{user.phone || "N/A"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Role</h3>
          <Badge color={user.role === "admin" ? "purple" : "blue"}>
            {user.role}
          </Badge>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Status</h3>
          <Badge color={user.isActive ? "green" : "red"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Updated At</h3>
          <p>{formatDate(user.updatedAt)}</p>
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
      <form method="POST" action="?/deleteUser" use:enhance={handleSubmit}>
        <input type="hidden" name="id" value={user.id} />
        <Button color="red" type="submit" disabled={loading}>
          {#if loading}
            <Spinner />
          {/if}
          Yes, delete user
        </Button>
      </form>      
      <Button color="light" on:click={toggleDeleteModal}>No, cancel</Button>
    </div>
  </div>
</Modal>
