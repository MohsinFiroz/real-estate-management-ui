<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
  import { PlusOutline, ChevronRightOutline, ChevronLeftOutline, TrashBinSolid, EditSolid, FilterSolid, ArrowUpOutline, ArrowDownOutline } from 'flowbite-svelte-icons';

  export let data;

  // Reactive states
  let searchTerm = page.url.searchParams.get('searchQuery') || '';
  let selectedRoles = data.roleFilters || [];
  let sortCriteria = data.sortCriteria || [];

  // Update URL based on current state
  function updateUrl() {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchQuery', searchTerm);
    if (selectedRoles.length > 0) params.set('roles', selectedRoles.join(','));
    if (sortCriteria.length > 0) {
      const sortParam = sortCriteria.map(s => `${s.field}:${s.direction}`).join(',');
      params.set('sortBy', sortParam);
    }
    params.set('page', data.listResponse.page.toString());
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

  // Role filter toggle
  function toggleRoleFilter(role: string) {
    selectedRoles = selectedRoles.includes(role) ? selectedRoles.filter(r => r !== role) : [...selectedRoles, role];
    updateUrl();
  }

  // Reset role filters
  function resetRoleFilters() {
    selectedRoles = [];
    updateUrl();
  }

  // Debounce search
  let searchTimeout: number;
  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(updateUrl, 500) as unknown as number;
  }

  const allRoles = ['admin', 'user'];

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
        <Button>Filter Roles
          {#if selectedRoles.length > 0}
            <span class="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">{selectedRoles.length}</span>
          {/if}
          <FilterSolid class="w-4 h-4 ml-2" />
        </Button>
        <Dropdown class="w-44 p-3 space-y-3 text-sm">
          {#each allRoles as role}
            <li><Checkbox checked={selectedRoles.includes(role)} on:change={() => toggleRoleFilter(role)}>{role.charAt(0).toUpperCase() + role.slice(1)}</Checkbox></li>
          {/each}
          <li class="border-t pt-2 flex justify-between">
            <Button size="xs" color="alternative" on:click={resetRoleFilters}>Reset</Button>
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
          {#if data.listResponse.entities.length === 0}
            <TableBodyRow>
              <TableBodyCell colspan={7} class="text-center py-4 text-gray-500">No data found</TableBodyCell>
            </TableBodyRow>
          {:else}
            {#each data.listResponse.entities as user (user.id)}
              <TableBodyRow class="cursor-pointer hover:bg-gray-100" on:click={() => goto(`/users/${user.id}`)}>
                <TableBodyCell>{user.firstName} {user.lastName || ''}</TableBodyCell>
                <TableBodyCell>{user.email}</TableBodyCell>
                <TableBodyCell>{user.role}</TableBodyCell>
                <TableBodyCell><span class={user.isActive ? 'text-green-600' : 'text-red-600'}>{user.isActive ? 'Active' : 'Inactive'}</span></TableBodyCell>
                <TableBodyCell>{formatDate(user.updatedAt)}</TableBodyCell>
                <TableBodyCell>{formatDate(user.lastLogin)}</TableBodyCell>
                <TableBodyCell>
                  <div class="flex space-x-2">
                    <Button href={`/users/${user.id}/edit`} color="yellow" size="xs" on:click={(e) => { e.stopPropagation(); goto(`/users/${user.id}/edit`); }}><EditSolid class="w-3 h-3" /></Button>
                    <form method="POST" action="?/deleteUser" use:enhance>
                      <input type="hidden" name="id" value={user.id} />
                      <Button color="red" size="xs" type="submit" on:click={(e) => { e.stopPropagation(); }}><TrashBinSolid class="w-3 h-3" /></Button>
                    </form>
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
        Showing {((data.listResponse.page - 1) * data.listResponse.pageSize) + 1}- 
        {Math.min(data.listResponse.page * data.listResponse.pageSize, data.listResponse.totalCount)} of {data.listResponse.totalCount}
      </span>
      <ButtonGroup>
        <Button href={`?page=${data.listResponse.page - 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${selectedRoles.length > 0 ? `&roles=${selectedRoles.join(',')}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} disabled={data.listResponse.page === 1}>
          <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        {#each { length: data.listResponse.totalPages } as _, i (i)}
          <Button href={`?page=${i + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${selectedRoles.length > 0 ? `&roles=${selectedRoles.join(',')}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} color={data.listResponse.page === i + 1 ? 'primary' : 'alternative'}>
            {i + 1}
          </Button>
        {/each}
        <Button href={`?page=${data.listResponse.page + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${selectedRoles.length > 0 ? `&roles=${selectedRoles.join(',')}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} disabled={data.listResponse.page === data.listResponse.totalPages}>
          <ChevronRightOutline size='xs' class='m-1.5'/>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</div>
