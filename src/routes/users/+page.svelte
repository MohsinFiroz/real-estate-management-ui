<script lang="ts">
  import { page } from '$app/state';
  import { enhance } from '$app/forms';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
  import { PlusOutline, ChevronRightOutline, ChevronLeftOutline, TrashBinSolid, EditSolid, FilterSolid } from 'flowbite-svelte-icons';

  // Component props
  export let data;

  // Search and pagination state
  let searchTerm = '';
  let selectedRoles: string[] = [];

  // Format date to dd/mm/yyyy with AM/PM time
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
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  // Derived state for filtered users
  $: filteredUsers = data.listResponse.entities.filter((user) => 
    (!searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedRoles.length === 0 || selectedRoles.includes(user.role))
  );

  // Create URL with current search and pagination parameters
  function createUrl(pageNumber: number, searchTerm = '', selectedRoles: string[] = []) {
    const params = new URLSearchParams(page.url.searchParams);
    params.set('page', pageNumber.toString());

    if (searchTerm) {
      params.set('searchQuery', searchTerm);
    } else {
      params.delete('searchQuery');
    }

    if (selectedRoles.length > 0) {
      params.set('roles', selectedRoles.join(','));
    } else {
      params.delete('roles');
    }

    return `?${params.toString()}`;
  }

  // Handle role filter toggle
  function toggleRoleFilter(role: string) {
    selectedRoles = selectedRoles.includes(role) 
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
  }

  // Reset role filters
  function resetRoleFilters() {
    selectedRoles = [];
  }

  // Available roles
  const allRoles = ['admin', 'user', 'manager', 'editor', 'viewer'];
</script>


<div class="flex flex-col h-screen">
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Users Management</h1>
      <Button href="/users/new">
        <PlusOutline class="h-3.5 w-3.5 mr-2" />Add User
      </Button>
    </div>

    <div class="flex mb-4 space-x-4">
      <div class="flex-grow">
        <input 
          type="text" 
          placeholder="Search users" 
          class="w-full p-2 border rounded"
          bind:value={searchTerm}
        />
      </div>
      <div class="relative">
        <Button>
          Filter Roles
          {#if selectedRoles.length > 0}
            <span class="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
              {selectedRoles.length}
            </span>
          {/if}
          <FilterSolid class="w-4 h-4 ml-2" />
        </Button>
        
        <Dropdown 
          class="w-44 p-3 space-y-3 text-sm"
        >
          {#each allRoles as role}
            <li>
              <Checkbox 
                checked={selectedRoles.includes(role)}
                on:change={() => toggleRoleFilter(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Checkbox>
            </li>
          {/each}
          
          <li class="border-t pt-2 flex justify-between">
            <Button 
              size="xs" 
              color="alternative" 
              on:click={resetRoleFilters}
            >
              Reset
            </Button>
          </li>
        </Dropdown>
      </div>
    </div>

    <div class="flex-grow overflow-auto">
      <Table>
        <TableHead>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Role</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Updated At</TableHeadCell>
          <TableHeadCell>Last Login</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each (searchTerm || selectedRoles.length ? filteredUsers : data.listResponse.entities) as user (user.id)}
            <TableBodyRow 
              class="cursor-pointer hover:bg-gray-100" 
              on:click={() => window.location.href = `/users/${user.id}`}
            >
              <TableBodyCell>
                {user.firstName} {user.lastName || ''}
              </TableBodyCell>
              <TableBodyCell>{user.email}</TableBodyCell>
              <TableBodyCell>{user.role}</TableBodyCell>
              <TableBodyCell>
                <span class={user.isActive ? 'text-green-600' : 'text-red-600'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableBodyCell>
              <TableBodyCell>{formatDate(user.updatedAt)}</TableBodyCell>
              <TableBodyCell>{formatDate(user.lastLogin)}</TableBodyCell>
              <TableBodyCell>
                <div class="flex space-x-2">
                  <Button href={`/users/${user.id}/edit`} color="yellow" size="xs">
                    <EditSolid class="w-3 h-3" />
                  </Button>
                  <form method="POST" action="?/deleteUser" use:enhance>
                    <input type="hidden" name="id" value={user.id} />
                    <Button color="red" size="xs" type="submit">
                      <TrashBinSolid class="w-3 h-3" />
                    </Button>
                  </form>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600">
        Showing 
        {((data.listResponse.page - 1) * data.listResponse.pageSize) + 1}-
        {Math.min(data.listResponse.page * data.listResponse.pageSize, data.listResponse.totalCount)}
        of {data.listResponse.totalCount}
      </span>
      
      <ButtonGroup>
        <Button 
          href={createUrl(data.listResponse.page - 1, searchTerm, selectedRoles)} 
          disabled={data.listResponse.page === 1}
        >
          <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        
        {#each { length: data.listResponse.totalPages } as _, i (i)}
          <Button 
            href={createUrl(i + 1, searchTerm, selectedRoles)}
            color={data.listResponse.page === i + 1 ? 'primary' : 'alternative'}
          >
            {i + 1}
          </Button>
        {/each}
        
        <Button 
          href={createUrl(data.listResponse.page + 1, searchTerm, selectedRoles)} 
          disabled={data.listResponse.page === data.listResponse.totalPages}
        >
          <ChevronRightOutline size='xs' class='m-1.5'/>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</div>