<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import type { SearchResponse } from '$lib/types/common.js';
  import type { Property } from '$lib/types/property.js';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, Badge, Modal } from 'flowbite-svelte';
  import { PlusOutline, ChevronRightOutline, ChevronLeftOutline, TrashBinSolid, EditSolid, FilterSolid, ArrowUpOutline, ArrowDownOutline } from 'flowbite-svelte-icons';

  export let data;

  $: propertyList = data.listResponse.data as SearchResponse<Property>

  // Reactive states
  let searchTerm = page.url.searchParams.get('searchQuery') || '';
  let sortCriteria = data.sortCriteria || [];

  // Delete
  let loading = false;
  let showDeleteModal = false;
  // Reactive state to store the selected property for deletion
  let propertyIDToDelete = '';

  function openDeleteModal(id: string) {
    propertyIDToDelete = id;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    propertyIDToDelete = '';
    showDeleteModal = false;
  }

  async function handleDelete(event: any) {
    loading = true;
    // Prevent the default form submission behavior
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('id', propertyIDToDelete);
      
      const response = await fetch('?/delete', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        // Only close the modal after successful deletion
        showDeleteModal = false;
        // Refresh the page to show updated property list
        goto(page.url.pathname, { invalidateAll: true });
      } else {
        console.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      loading = false;
    }
  }

  // Update URL based on current state
  function updateUrl() {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchQuery', searchTerm);
    if (sortCriteria.length > 0) {
      const sortParam = sortCriteria.map(s => `${s.field}:${s.direction}`).join(',');
      params.set('sortBy', sortParam);
    }
    params.set('page', propertyList.page.toString());
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
      <h1 class="text-2xl font-semibold">Properties Management</h1>
      <Button href="/properties/new"><PlusOutline class="h-3.5 w-3.5 mr-2" />Add Property</Button>
    </div>

    <div class="flex mb-4 space-x-4">
      <input 
        type="text" 
        placeholder="Search properties" 
        class="w-full p-2 border rounded"
        bind:value={searchTerm}
        on:input={handleSearchInput}
      />
      <div class="relative">
        <Button>Filter
          <FilterSolid class="w-4 h-4 ml-2" />
        </Button>
        <Dropdown class="w-44 p-3 space-y-3 text-sm">
          <li class="border-t pt-2 flex justify-between">
            <Button size="xs" color="alternative" on:click={() => { updateUrl(); }} >
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
            { field: 'address', label: 'Address' },
            { field: 'suburb', label: 'Suburb' },
            { field: 'postcode', label: 'Postcode' },
            { field: 'keyNo', label: 'Key No.' },
            { field: 'managementFee', label: 'Management Fee' },
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
          {#if propertyList?.totalCount === 0}
            <TableBodyRow>
              <TableBodyCell colspan={7} class="text-center py-4 text-gray-500">No properties found</TableBodyCell>
            </TableBodyRow>
          {:else}
            {#each propertyList.entities as property (property.id)}
              <TableBodyRow class="cursor-pointer hover:bg-gray-100" on:click={() => goto(`/properties/${property.id}`)}>
                <TableBodyCell>{property.address}</TableBodyCell>
                <TableBodyCell>{property.suburb}</TableBodyCell>
                <TableBodyCell>{property.postcode}</TableBodyCell>
                <TableBodyCell>{property.keyNo}</TableBodyCell>
                <TableBodyCell>{property.managementFee}%</TableBodyCell>
                <TableBodyCell>{formatDate(property.updatedAt)}</TableBodyCell>
                <TableBodyCell>
                  <div class="flex space-x-2">
                    <Button href={`/properties/${property.id}/edit`} color="yellow" size="xs" on:click={(e) => { e.stopPropagation(); goto(`/properties/${property.id}/edit`); }}><EditSolid class="w-3 h-3" /></Button>
                    <Button color="red" size="xs" on:click={(e) => { e.stopPropagation(); openDeleteModal(property.id); }}><TrashBinSolid class="w-3 h-3" /></Button>
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
        Showing {((propertyList.page - 1) * propertyList.pageSize) + 1}- 
        {Math.min(propertyList.page * propertyList.pageSize, propertyList.totalCount)} of {propertyList.totalCount}
      </span>
      <ButtonGroup>
        <Button href={`?page=${propertyList.page - 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} disabled={propertyList.page === 1}>
          <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        {#each { length: propertyList.totalPages } as _, i (i)}
          <Button href={`?page=${i + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`}>
            {i + 1}
          </Button>
        {/each}
        <Button href={`?page=${propertyList.page + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} disabled={propertyList.page === propertyList.totalPages}>
          <ChevronRightOutline size='xs' class='m-1.5'/>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</div>

<!-- Modal for property deletion -->
<Modal bind:open={showDeleteModal} size="md" autoclose={false}>
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Are you sure you want to delete this property?
    </h3>
    <div class="flex justify-center gap-4">
      <Button color="red" on:click={handleDelete} disabled={loading}>
        {#if loading}
          <Spinner/>
        {:else}
          Yes, delete property
        {/if}
      </Button>
      <Button color="light" on:click={closeDeleteModal}>No, cancel</Button>
    </div>
  </div>
</Modal>