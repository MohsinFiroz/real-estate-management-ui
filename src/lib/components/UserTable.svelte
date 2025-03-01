<script lang="ts">
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Button, Pagination, Search, Select, Modal, Alert } from 'flowbite-svelte';
    import { ArrowUpOutline, ArrowDownOutline, TrashBinOutline } from 'flowbite-svelte-icons';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { SearchResponse } from '$lib/types/common';
    import type { User } from '$lib/types/user';
  import Spinner from './ui/Spinner.svelte';
    
    export let data: SearchResponse<User>;
    export let deleteUser: (userID: string) => void;
    
    let loading = false;
    let deleteLoading = false;
    let deleteError = '';
    let showDeleteModal = false;
    let userToDelete: User | null = null;
    
    $: searchQuery = $page.url.searchParams.get('searchQuery') || '';
    $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
    $: pageSize = parseInt($page.url.searchParams.get('pageSize') || '10');
    $: sortBy = $page.url.searchParams.get('sortBy') || 'createdAt:desc';
    
    const pageSizeOptions = [
      { value: '5', name: '5' },
      { value: '10', name: '10' },
      { value: '20', name: '20' },
      { value: '50', name: '50' }
    ];
  
    // Calculate total pages based on total count and page size
    $: totalPages = Math.ceil(data.totalCount / pageSize);
    
    // Create an array of page objects for the pagination
    $: pages = Array.from({ length: totalPages }, (_, index) => ({ name: `${index + 1}` }));
  
    // Determine sort direction for column
    function getSortDirection(column: string) {
      if (!sortBy) return null;
      const sorts = sortBy.split(',');
      for (const sort of sorts) {
        const [field, direction] = sort.split(':');
        if (field === column) {
          return direction;
        }
      }
      return null;
    }
  
    // Toggle sort for a column
    function toggleSort(column: string) {
      const currentDirection = getSortDirection(column);
      let newSortBy;
  
      if (!currentDirection) {
        newSortBy = `${column}:asc`;
      } else if (currentDirection === 'asc') {
        newSortBy = `${column}:desc`;
      } else {
        // Remove sort for this column
        const sorts = sortBy.split(',').filter(s => !s.startsWith(`${column}:`));
        newSortBy = sorts.length ? sorts.join(',') : 'createdAt:desc';
      }
  
      updateUrlAndFetch({ sortBy: newSortBy });
    }
  
    // Update URL parameters and refetch data
    function updateUrlAndFetch(params: Record<string, string | number>) {
      loading = true;
      const url = new URL(window.location.href);
  
      // Update existing parameters or add new ones
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        } else {
          url.searchParams.delete(key);
        }
      });
  
      // Reset to page 1 when changing search or sort
      if (params.searchQuery !== undefined || params.sortBy !== undefined || params.pageSize !== undefined) {
        url.searchParams.set('page', '1');
      }
  
      goto(url.toString());
    }
  
    function handleSearch() {
      updateUrlAndFetch({ searchQuery });
    }
  
    function handlePageChange(newPage: number) {
      // Validate page number is within bounds
      if (newPage >= 1 && newPage <= totalPages) {
        updateUrlAndFetch({ page: newPage });
      }
    }
  
    function handlePageSizeChange() {
      updateUrlAndFetch({ pageSize });
    }
  
    function formatDate(dateString: string | null) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString();
    }
  
    function editUser(id: string) {
      goto(`/users/${id}/edit`);
    }
  
    function viewUser(id: string) {
      goto(`/users/${id}`);
    }
    
    function confirmDelete(user: User) {
      userToDelete = user;
      showDeleteModal = true;
    }
    
    async function handleDelete() {
      if (!userToDelete) return;
      
      deleteLoading = true;
      deleteError = '';
      
      try {
        await deleteUser(userToDelete.id);
        showDeleteModal = false;
        
        // Refresh the page after successful deletion
        // This will trigger a new load of the data
        const url = new URL(window.location.href);
        goto(url.toString());
      } catch (err: unknown) {
        deleteError = err instanceof Error ? err.message : 'Failed to delete user';
      } finally {
        deleteLoading = false;
      }
    }
  </script>
  
  <div class="mb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
    <h1 class="text-2xl font-bold">Users</h1>
    <div class="flex gap-2">
      <Search bind:value={searchQuery} on:search={handleSearch} placeholder="Search users..." />
      <Button href="/users/new" color="green">Add User</Button>
    </div>
  </div>
  
  {#if loading}
    <div class="my-2">
      <Spinner/>
    </div>
  {/if}
  
  <div class="overflow-x-auto">
    <Table striped={true}>
      <TableHead>
        <TableHeadCell class="cursor-pointer" on:click={() => toggleSort('firstName')}>
          <div class="flex items-center gap-1">
            Name
            {#if getSortDirection('firstName') === 'asc'}
              <ArrowUpOutline class="w-4 h-4" />
            {:else if getSortDirection('firstName') === 'desc'}
              <ArrowDownOutline class="w-4 h-4" />
            {/if}
          </div>
        </TableHeadCell>
        <TableHeadCell class="cursor-pointer" on:click={() => toggleSort('email')}>
          <div class="flex items-center gap-1">
            Email
            {#if getSortDirection('email') === 'asc'}
              <ArrowUpOutline class="w-4 h-4" />
            {:else if getSortDirection('email') === 'desc'}
              <ArrowDownOutline class="w-4 h-4" />
            {/if}
          </div>
        </TableHeadCell>
        <TableHeadCell>Phone</TableHeadCell>
        <TableHeadCell>Role</TableHeadCell>
        <TableHeadCell class="cursor-pointer" on:click={() => toggleSort('createdAt')}>
          <div class="flex items-center gap-1">
            Created
            {#if getSortDirection('createdAt') === 'asc'}
              <ArrowUpOutline class="w-4 h-4" />
            {:else if getSortDirection('createdAt') === 'desc'}
              <ArrowDownOutline class="w-4 h-4" />
            {/if}
          </div>
        </TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#if loading && data.entities.length === 0}
          <TableBodyRow>
            <TableBodyCell colspan={7} class="text-center py-4">
              <Spinner/>
            </TableBodyCell>
          </TableBodyRow>
        {:else if data.entities.length === 0}
          <TableBodyRow>
            <TableBodyCell colspan={7} class="text-center py-4">No users found.</TableBodyCell>
          </TableBodyRow>
        {:else}
          {#each data.entities as user}
            <TableBodyRow>
              <TableBodyCell>{user.firstName} {user.lastName}</TableBodyCell>
              <TableBodyCell>{user.email}</TableBodyCell>
              <TableBodyCell>{user.phone || 'N/A'}</TableBodyCell>
              <TableBodyCell>
                <span class={user.role === 'admin' ? 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs' : 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'}>
                  {user.role}
                </span>
              </TableBodyCell>
              <TableBodyCell>{formatDate(user.createdAt)}</TableBodyCell>
              <TableBodyCell>
                <span class={user.isActive ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs' : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableBodyCell>
              <TableBodyCell>
                <div class="flex gap-2">
                  <Button size="xs" color="blue" on:click={() => viewUser(user.id)}>View</Button>
                  <Button size="xs" color="purple" on:click={() => editUser(user.id)}>Edit</Button>
                  <Button size="xs" color="red" class="p-1" on:click={() => confirmDelete(user)}>
                    <TrashBinOutline class="w-3 h-3" />
                  </Button>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  </div>
  
  <div class="flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
    <div class="flex items-center gap-2">
      <span class="text-sm">Rows per page:</span>
      <Select bind:value={pageSize} on:change={handlePageSizeChange} items={pageSizeOptions} class="w-16" />
      <span class="text-sm ml-4">
        Showing {data.entities.length} of {data.totalCount} results
      </span>
    </div>
  
    {#if totalPages > 1}
      <Pagination
        {pages}
        activeClass="bg-blue-600 text-white"
        on:previous={() => handlePageChange(currentPage - 1)}
        on:next={() => handlePageChange(currentPage + 1)}
        on:click={(e) => handlePageChange(e.detail)}
      />
    {/if}
  </div>
  
  <!-- Delete Confirmation Modal -->
  <Modal bind:open={showDeleteModal} size="md" autoclose>
    <div class="text-center">
      {#if deleteError}
        <Alert color="red" class="mb-4">
          {deleteError}
        </Alert>
      {/if}
      
      <h3 class="mb-5 text-lg font-normal text-gray-500">
        Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}?
      </h3>
      <div class="flex justify-center gap-4">
        <Button color="red" on:click={handleDelete} disabled={deleteLoading}>
          {#if deleteLoading}
            <Spinner/>
          {/if}
          Yes, delete user
        </Button>
        <Button color="light" on:click={() => showDeleteModal = false}>No, cancel</Button>
      </div>
    </div>
  </Modal>