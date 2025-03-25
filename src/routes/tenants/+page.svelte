<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import type { SearchResponse } from '$lib/types/common.js';
  import type { Tenant } from '$lib/types/tenant.js';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, Badge, Modal } from 'flowbite-svelte';
  import { PlusOutline, ChevronRightOutline, ChevronLeftOutline, TrashBinSolid, EditSolid, FilterSolid, ArrowUpOutline, ArrowDownOutline } from 'flowbite-svelte-icons';

  export let data;

  $: tenantList = data.listResponse.data as SearchResponse<Tenant>;

  let searchTerm = page.url.searchParams.get('searchQuery') || '';
  let sortCriteria = data.sortCriteria || [];

  let loading = false;
  let showDeleteModal = false;
  let tenantIDToDelete = '';

  function openDeleteModal(id: string) {
    tenantIDToDelete = id;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    tenantIDToDelete = '';
    showDeleteModal = false;
  }

  async function handleDelete(event: any) {
    loading = true;
    event.preventDefault();
    
    try {
      const response = await fetch(`/deleteTenant`, {
        method: 'POST',
        body: JSON.stringify({ id: tenantIDToDelete }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        showDeleteModal = false;
        goto(page.url.pathname, { invalidateAll: true });
      } else {
        console.error('Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
    } finally {
      loading = false;
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchQuery', searchTerm);
    if (sortCriteria.length > 0) {
      const sortParam = sortCriteria.map(s => `${s.field}:${s.direction}`).join(',');
      params.set('sortBy', sortParam);
    }
    params.set('page', tenantList.page.toString());
    goto(`?${params.toString()}`, { keepFocus: true });
  }

  function handleSort(field: string) {
    const existingSort = sortCriteria.find(s => s.field === field);
    if (existingSort) {
      const newSortCriteria = [...sortCriteria];
      const index = newSortCriteria.findIndex(s => s.field === field);
      existingSort.direction === 'asc'
        ? (newSortCriteria[index] = { ...existingSort, direction: 'desc' })
        : newSortCriteria.splice(index, 1);
      sortCriteria = newSortCriteria;
    } else {
      sortCriteria = [...sortCriteria, { field, direction: 'asc' }];
    }
    updateUrl();
  }

  function getSortIcon(field: string) {
    const sort = sortCriteria.find(s => s.field === field);
    return sort ? (sort.direction === 'asc' ? ArrowUpOutline : ArrowDownOutline) : null;
  }

  function getSortPriority(field: string) {
    return sortCriteria.findIndex(s => s.field === field) + 1;
  }

    // Debounce search
    let searchTimeout: number;
  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(updateUrl, 500) as unknown as number;
  }

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
      <h1 class="text-2xl font-semibold">Tenant Management</h1>
      <Button href="/tenants/new"><PlusOutline class="h-3.5 w-3.5 mr-2" />Add Tenant</Button>
    </div>

    <div class="flex mb-4 space-x-4">
      <input 
        type="text" 
        placeholder="Search tenants" 
        class="w-full p-2 border rounded"
        bind:value={searchTerm}
        on:input={handleSearchInput}
      />
    </div>

    <div class="flex-grow overflow-auto">
      <Table>
        <TableHead>
          {#each [
            { field: 'name', label: 'Name' },
            { field: 'mobile', label: 'Mobile' },
            { field: 'email', label: 'Email' },
            { field: 'communicationMedium', label: 'Communication Medium' },
            { field: 'notes', label: 'Notes' },
            { field: 'createdAt', label: 'Created At' },
            { field: 'updatedAt', label: 'Updated At' }
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
          {#if tenantList?.totalCount === 0}
            <TableBodyRow>
              <TableBodyCell colspan={8} class="text-center py-4 text-gray-500">No tenants found</TableBodyCell>
            </TableBodyRow>
          {:else}
            {#each tenantList.entities as tenant (tenant.id)}
              <TableBodyRow class="cursor-pointer hover:bg-gray-100" on:click={() => goto(`/tenants/${tenant.id}`)}>
                <TableBodyCell>{tenant.name}</TableBodyCell>
                <TableBodyCell>{tenant.mobile}</TableBodyCell>
                <TableBodyCell>{tenant.email}</TableBodyCell>
                <TableBodyCell>{tenant.communicationMedium}</TableBodyCell>
                <TableBodyCell>{tenant.notes}</TableBodyCell>
                <TableBodyCell>{formatDate(tenant.createdAt)}</TableBodyCell>
                <TableBodyCell>{formatDate(tenant.updatedAt)}</TableBodyCell>
                <TableBodyCell>
                  <Button href={`/tenants/${tenant.id}/edit`} color="yellow" size="xs"><EditSolid class="w-3 h-3" /></Button>
                  <Button color="red" size="xs" on:click={() => openDeleteModal(tenant.id)}><TrashBinSolid class="w-3 h-3" /></Button>
                </TableBodyCell>  
              </TableBodyRow>
            {/each}
          {/if}
        </TableBody>
      </Table>
    </div>
  </div>
</div>
