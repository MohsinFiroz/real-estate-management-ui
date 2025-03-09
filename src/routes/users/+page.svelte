<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, Badge, Modal } from 'flowbite-svelte';
  import { PlusOutline, ChevronRightOutline, ChevronLeftOutline, TrashBinSolid, EditSolid, FilterSolid, ArrowUpOutline, ArrowDownOutline } from 'flowbite-svelte-icons';

  export let data;

  let userList = data.listResponse

  // Reactive states
  let searchTerm = page.url.searchParams.get('searchQuery') || '';
  let isActiveFilter = page.url.searchParams.get('isActive') || '';
  let sortCriteria = data.sortCriteria || [];

  // Delete
  let loading = false;
  let showDeleteModal = false;
  // Reactive state to store the selected user for deletion
  let userIDToDelete = '';

  function openDeleteModal(id: string) {
    userIDToDelete = id;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    userIDToDelete = '';
    showDeleteModal = false;
  }

  async function handleDelete(event: any) {
    loading = true;
    // Prevent the default form submission behavior
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('id', userIDToDelete);
      
      const response = await fetch('?/deleteUser', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        // Only close the modal after successful deletion
        showDeleteModal = false;
        // Refresh the page to show updated user list
        goto(page.url.pathname, { invalidateAll: true });
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      loading = false;
    }
  }

  // Update URL based on current state
  function updateUrl() {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchQuery', searchTerm);
    if (isActiveFilter) params.set('isActive', isActiveFilter);
    if (sortCriteria.length > 0) {
      const sortParam = sortCriteria.map(s => `${s.field}:${s.direction}`).join(',');
      params.set('sortBy', sortParam);
    }
    params.set('page', userList.page.toString());
    goto(`?${params.toString()}`, { keepFocus: true });
  }

  // Handle sorting (no limit on number of sorted columns)
  function handleSort(field: string) {
    const existingSort = sortCriteria.find(s => s.field === field);
    if (existingSort) {
      const newSortCriteria = [...sortCriteria];
      const index = newSortCriteria.findIndex(s => s.field === field);
      existingSort.direction === 'asc' ? newSortCriteria[index] = { ...existingSort, direction: 'desc' } : newSortCriteria.splice(index, 1);
      sortCriteria = newSortCriteria;
    } else {
      sortCriteria = [...sortCriteria, { field, direction: 'asc' }];
    }
    updateUrl();
  }

  // Sorting icon and priority
  function getSortIcon(field: string) {
    const sort = sortCriteria.find(s => s.field === field);
    return sort ? (sort.direction === 'asc' ? ArrowUpOutline : ArrowDownOutline) : null;
  }

  function getSortPriority(field: string) {
    return sortCriteria.findIndex(s => s.field === field) + 1;
  }

  // Active filter toggle
  function toggleActiveFilter(value: string) {
    if (value === 'active') {
      isActiveFilter = isActiveFilter === 'true' ? '' : 'true';
    } else if (value === 'inactive') {
      isActiveFilter = isActiveFilter === 'false' ? '' : 'false';
    }
    updateUrl();
  }

  // Debounce search
  let searchTimeout: number;
  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(updateUrl, 500) as unknown as number;
  }

  // Date formatting
  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
</script>

<div class="flex flex-col h-screen">
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Users Management</h1>
      <Button href="/users/new"><PlusOutline class="h-3.5 w-3.5 mr-2" />Add User</Button>
    </div>

    <div class="flex mb-4 space-x-4">
      <input 
        type="text" 
        placeholder="Search users" 
        class="w-full p-2 border rounded"
        bind:value={searchTerm}
        on:input={handleSearchInput}
      />
      <div class="relative">
        <Button>Filter
          {#if isActiveFilter}
            <span class="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">{isActiveFilter === 'true' ? 'Active' : 'Inactive'}</span>
          {/if}
          <FilterSolid class="w-4 h-4 ml-2" />
        </Button>
        <Dropdown class="w-44 p-3 space-y-3 text-sm">
          <li>
            <Checkbox checked={isActiveFilter === 'true'} on:change={() => toggleActiveFilter('active')}>
              Active Users
            </Checkbox>
          </li>
          <li>
            <Checkbox checked={isActiveFilter === 'false'} on:change={() => toggleActiveFilter('inactive')}>
              Inactive Users
            </Checkbox>
          </li>
          <li class="border-t pt-2 flex justify-between">
            <Button size="xs" color="alternative" on:click={() => { isActiveFilter = ''; updateUrl(); }} >
              Reset
            </Button>
          </li>
        </Dropdown>
      </div>
    </div>

    <div class="flex-grow overflow-auto">
      <Table>
        <TableHead>
          {#each [
            { field: 'firstName', label: 'Name' },
            { field: 'email', label: 'Email' },
            { field: 'role', label: 'Role' },
            { field: 'isActive', label: 'Status' },
            { field: 'updatedAt', label: 'Updated At' },
            { field: 'lastLogin', label: 'Last Login' }
          ] as column}
            <TableHeadCell class="cursor-pointer hover:bg-gray-100 relative" on:click={() => handleSort(column.field)}>
              <div class="flex items-center gap-2">
                {column.label}
                {#if getSortIcon(column.field)}
                  <svelte:component this={getSortIcon(column.field)} class="w-4 h-4" />
                {/if}
                {#if getSortPriority(column.field)}
                  <span class="absolute top-0 right-0 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {getSortPriority(column.field)}
                  </span>
                {/if}
              </div>
            </TableHeadCell>
          {/each}
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody>
          {#if userList.totalCount === 0}
            <TableBodyRow>
              <TableBodyCell colspan={7} class="text-center py-4 text-gray-500">No data found</TableBodyCell>
            </TableBodyRow>
          {:else}
            {#each userList.entities as user (user.id)}
              <TableBodyRow class="cursor-pointer hover:bg-gray-100" on:click={() => goto(`/users/${user.id}`)}>
                <TableBodyCell>{user.firstName} {user.lastName || ''}</TableBodyCell>
                <TableBodyCell>{user.email}</TableBodyCell>
                <TableBodyCell>
                  <Badge color={user.role === 'admin' ? 'purple' : 'blue'}>
                    {user.role}
                  </Badge>
                </TableBodyCell>
                <TableBodyCell>
                  <Badge color={user.isActive ? 'green' : 'red'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableBodyCell>
                <TableBodyCell>{formatDate(user.updatedAt)}</TableBodyCell>
                <TableBodyCell>{formatDate(user.lastLogin)}</TableBodyCell>
                <TableBodyCell>
                  <div class="flex space-x-2">
                    <Button href={`/users/${user.id}/edit`} color="yellow" size="xs" on:click={(e) => { e.stopPropagation(); goto(`/users/${user.id}/edit`); }}><EditSolid class="w-3 h-3" /></Button>
                    <Button color="red" size="xs" on:click={(e) => { e.stopPropagation(); openDeleteModal(user.id); }}><TrashBinSolid class="w-3 h-3" /></Button>
                  </div>
                </TableBodyCell>  
              </TableBodyRow>
            {/each}
          {/if}
        </TableBody>
      </Table>
    </div>

    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600">
        Showing {((userList.page - 1) * userList.pageSize) + 1}- 
        {Math.min(userList.page * userList.pageSize, userList.totalCount)} of {userList.totalCount}
      </span>
      <ButtonGroup>
        <Button href={`?page=${userList.page - 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${isActiveFilter ? `&isActive=${isActiveFilter}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} disabled={userList.page === 1}>
          <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        {#each { length: userList.totalPages } as _, i (i)}
          <Button href={`?page=${i + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${isActiveFilter ? `&isActive=${isActiveFilter}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`}>
            {i + 1}
          </Button>
        {/each}
        <Button href={`?page=${userList.page + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${isActiveFilter ? `&isActive=${isActiveFilter}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} disabled={userList.page === userList.totalPages}>
          <ChevronRightOutline size='xs' class='m-1.5'/>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</div>

<!-- Modified Modal to prevent auto-closing -->
<Modal bind:open={showDeleteModal} size="md" autoclose={false}>
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Are you sure you want to delete this user?
    </h3>
    <div class="flex justify-center gap-4">
      <!-- Changed to use the custom handler instead of form action -->
      <Button color="red" on:click={handleDelete} disabled={loading}>
        {#if loading}
          <Spinner/>
        {:else}
          Yes, delete user
        {/if}
      </Button>
      <Button color="light" on:click={closeDeleteModal}>No, cancel</Button>
    </div>
  </div>
</Modal>