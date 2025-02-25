<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import type { User } from '$lib/types/user';
    import { goto } from '$app/navigation';
    import { 
      TableBody, 
      TableBodyCell, 
      TableBodyRow, 
      TableHead, 
      TableHeadCell, 
      TableSearch, 
      Button, 
      Dropdown, 
      DropdownItem, 
      Checkbox, 
      ButtonGroup, 
      Badge 
    } from 'flowbite-svelte';
    import { 
      PlusOutline, 
      FilterSolid, 
      ChevronRightOutline, 
      ChevronLeftOutline,
      SalePercentSolid,
      TrashBinSolid
    } from 'flowbite-svelte-icons';
    
    export let data: PageData;
    
    let searchTerm = '';
    
    // Reactive variables for updating URL parameters
    $: currentPage = data.pagination?.page || 1;
    $: itemsPerPage = data.pagination?.limit || 10;
    $: totalItems = data.pagination?.total || 0;
    $: totalPages = data.pagination?.totalPages || 0;
    
    // Calculate pagination display values
    $: startRange = ((currentPage - 1) * itemsPerPage) + 1;
    $: endRange = Math.min(currentPage * itemsPerPage, totalItems);

    $: roleFilterAsBoolean = roleFilter === 'admin';

    
    // Calculate pages to show
    $: {
      const showPages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
      const endPage = Math.min(startPage + showPages - 1, totalPages);
      startPage = Math.max(1, endPage - showPages + 1);
      pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
    
    let pagesToShow: number[] = [];
    let roleFilter = data.filters?.role || '';
    let statusFilter = data.filters?.status || '';
    let isAdminFilterActive = roleFilter === 'admin';
    let isUserFilterActive = roleFilter === 'user';
    let isActiveFilterActive = statusFilter === 'active';
    let isInactiveFilterActive = statusFilter === 'inactive';
    // Sort state
    let sortState = data.sort || [];
    
    // Handle sorting
    function toggleSort(field: string) {
      const currentSort = sortState.find(s => s.field === field);
      
      if (!currentSort) {
        // Add new sort
        sortState = [...sortState, { field, order: 'asc' }];
      } else if (currentSort.order === 'asc') {
        // Toggle to desc
        sortState = sortState.map(s => 
          s.field === field ? { ...s, order: 'desc' } : s
        );
      } else {
        // Remove sort
        sortState = sortState.filter(s => s.field !== field);
      }
      
      updateUrlAndNavigate();
    }
    
    // Update URL and navigate
    function updateUrlAndNavigate() {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());
      
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      
      if (sortState.length) {
        const sortParam = sortState.map(s => `${s.field}:${s.order}`).join(',');
        params.set('sortBy', sortParam);
      }
      
      goto(`?${params.toString()}`);
    }
    
    // Handle page change
    function goToPage(page: number) {
      currentPage = page;
      updateUrlAndNavigate();
    }
    
    // Handle filter changes
    function applyFilters() {
      currentPage = 1; // Reset to first page when filters change
      updateUrlAndNavigate();
    }
    
    // Handle create user
    function createUser() {
      goto('/users/create');
    }
    
    // Handle edit user
    function editUser(id: string) {
      goto(`/users/edit/${id}`);
    }
    
    // Get sort icon
    function getSortIcon(field: string) {
      const sort = sortState.find(s => s.field === field);
      if (!sort) return '';
      return sort.order === 'asc' ? '↑' : '↓';
    }
  </script>
  
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>
    
    {#if data.error}
      <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {data.error}
      </div>
    {/if}
    
    <TableSearch placeholder="Search by name or email" hoverable={true} bind:inputValue={searchTerm}>
      <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        <Button on:click={createUser}>
          <PlusOutline class="h-3.5 w-3.5 mr-2" />Add User
        </Button>
        
        <Button color='alternative'>
          Filter<FilterSolid class="w-3 h-3 ml-2" />
        </Button>
        <Dropdown class="w-48 p-3 space-y-2 text-sm">
          <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Role</h6>
          <li>
            <Checkbox bind:checked={isAdminFilterActive} on:change={() => { 
                roleFilter = isAdminFilterActive ? 'admin' : ''; 
              }}>
                Admin
              </Checkbox>
          </li>
          <li>
            <Checkbox bind:checked={isUserFilterActive} on:change={() => { 
              roleFilter = isUserFilterActive ? 'user' : ''; 
            }}>
              User
            </Checkbox>
          </li>
          
          <h6 class="mt-4 mb-3 text-sm font-medium text-gray-900 dark:text-white">Status</h6>
          <li>
            <Checkbox bind:checked={isActiveFilterActive} on:change={() => { 
              statusFilter = isActiveFilterActive ? 'active' : ''; 
            }}>
              Active
            </Checkbox>
          </li>
          <li>
            <Checkbox bind:checked={isInactiveFilterActive} on:change={() => { 
              statusFilter = isInactiveFilterActive ? 'inactive' : ''; 
            }}>
              Inactive
            </Checkbox>
          </li>
          
          <Button class="mt-4 w-full" on:click={applyFilters}>Apply Filters</Button>
        </Dropdown>
      </div>
      
      <TableHead>
        <TableHeadCell on:click={() => toggleSort('firstName')} class="cursor-pointer">
          Name {getSortIcon('firstName')}
        </TableHeadCell>
        <TableHeadCell on:click={() => toggleSort('email')} class="cursor-pointer">
          Email {getSortIcon('email')}
        </TableHeadCell>
        <TableHeadCell on:click={() => toggleSort('role')} class="cursor-pointer">
          Role {getSortIcon('role')}
        </TableHeadCell>
        <TableHeadCell on:click={() => toggleSort('isActive')} class="cursor-pointer">
          Status {getSortIcon('isActive')}
        </TableHeadCell>
        <TableHeadCell on:click={() => toggleSort('lastLogin')} class="cursor-pointer">
          Last Login {getSortIcon('lastLogin')}
        </TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      
      <TableBody class="divide-y">
        {#if data.users && data.users.length > 0}
          {#each data.users.filter((user: User) => 
            searchTerm === '' || 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          ) as user (user.id)}
            <TableBodyRow>
              <TableBodyCell>{user.firstName} {user.lastName}</TableBodyCell>
              <TableBodyCell>{user.email}</TableBodyCell>
              <TableBodyCell>
                <Badge color={user.role === 'admin' ? 'dark' : 'blue'}>
                  {user.role}
                </Badge>
              </TableBodyCell>
              <TableBodyCell>
                <form method="POST" action="?/toggleStatus" use:enhance>
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="currentStatus" value={user.isActive.toString()} />
                  <Badge
                    color={user.isActive ? 'green' : 'red'}
                    class="cursor-pointer"
                    on:click={() => document?.activeElement?.closest('form')?.requestSubmit()}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </form>
              </TableBodyCell>
              <TableBodyCell>
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
              </TableBodyCell>
              <TableBodyCell>
                <div class="flex space-x-2">
                  <Button size="xs" color="blue" on:click={() => editUser(user.id)}>
                    <SalePercentSolid class="h-3.5 w-3.5" />
                  </Button>
                  
                  <form method="POST" action="?/deleteUser" use:enhance>
                    <input type="hidden" name="userId" value={user.id} />
                    <Button size="xs" color="red" type="submit">
                      <TrashBinSolid class="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        {:else}
          <TableBodyRow>
            <TableBodyCell colspan={6} class="text-center py-4">
              No users found.
            </TableBodyCell>
          </TableBodyRow>
        {/if}
      </TableBody>
      
      <div slot="footer" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
        </span>
        <ButtonGroup>
          <Button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeftOutline size='xs' class='m-1.5'/>
          </Button>
          
          {#each pagesToShow as pageNumber}
            <Button 
              color={pageNumber === currentPage ? 'blue' : 'alternative'}
              on:click={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          {/each}
          
          <Button on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <ChevronRightOutline size='xs' class='m-1.5'/>
          </Button>
        </ButtonGroup>
      </div>
    </TableSearch>
  </div>