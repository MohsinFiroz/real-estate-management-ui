<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import type { SearchResponse } from '$lib/types/common.js';
  import type { Property } from '$lib/types/property.js';
  import { 
    Button, 
    Dropdown, 
    Modal, 
    Card, 
    Checkbox, 
    ButtonGroup, 
    Badge, 
    Input 
  } from 'flowbite-svelte';
  import { 
    PlusOutline, 
    ChevronRightOutline, 
    ChevronLeftOutline, 
    TrashBinSolid, 
    EditSolid, 
    FilterSolid, 
    ArrowUpOutline, 
    ArrowDownOutline,
    HomeOutline,
    MapPinAltSolid,
    CashOutline,
    ClockOutline,
    SortOutline
  } from 'flowbite-svelte-icons';

  export let data;

  $: propertyList = data.listResponse.data as SearchResponse<Property>

  // Sorting configuration
  const sortableFields = [
    { field: 'address', label: 'Address' },
    { field: 'suburb', label: 'Suburb' },
    { field: 'postcode', label: 'Postcode' },
    { field: 'managementFee', label: 'Management Fee' },
    { field: 'updatedAt', label: 'Updated Date' }
  ];

  // Reactive states
  let searchTerm = page.url.searchParams.get('searchQuery') || '';
  let sortCriteria = data.sortCriteria || [];
  let showSortDropdown = false;

  // Delete
  let loading = false;
  let showDeleteModal = false;
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
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('id', propertyIDToDelete);
      
      const response = await fetch('?/delete', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        showDeleteModal = false;
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

  // URL and sorting functions
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

  function handleSort(field: string) {
    const existingSort = sortCriteria.find(s => s.field === field);
    if (existingSort) {
      const newSortCriteria = [...sortCriteria];
      const index = newSortCriteria.findIndex(s => s.field === field);
      existingSort.direction === 'asc' 
        ? newSortCriteria[index] = { ...existingSort, direction: 'desc' } 
        : newSortCriteria.splice(index, 1);
      sortCriteria = newSortCriteria;
    } else {
      sortCriteria = [...sortCriteria, { field, direction: 'asc' }];
    }
    updateUrl();
  }

  function clearSort() {
    sortCriteria = [];
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

  // Demo status generation (you'd replace this with actual data)
  function generatePropertyStatus(property: Property) {
    type BadgeColor = "yellow" | "green" | "red" | "blue" | "dark" | "primary" | "purple" | "indigo";
    
    const statuses: Array<{ 
      label: string, 
      color: BadgeColor, 
      condition: boolean 
    }> = [
      { 
        label: 'Inspection Due', 
        color: 'yellow', 
        condition: Math.random() > 0.7 
      },
      { 
        label: 'Rent Check', 
        color: 'green', 
        condition: Math.random() > 0.6 
      },
      { 
        label: 'Maintenance', 
        color: 'red', 
        condition: Math.random() > 0.8 
      }
    ];

    return statuses.filter(status => status.condition);
  }
</script>

<div class="flex flex-col h-screen bg-gray-50">
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold text-gray-800">Property Portfolio</h1>
      <Button href="/properties/new" class="bg-primary-600 hover:bg-primary-700">
        <PlusOutline class="h-4 w-4 mr-2" />Add Property
      </Button>
    </div>

    <div class="flex mb-4 space-x-4">
      <div class="flex-grow">
        <Input 
          type="text" 
          placeholder="Search properties by address, suburb, or postcode" 
          bind:value={searchTerm}
          on:input={handleSearchInput}
          class="w-full"
        >
          <svelte:fragment slot="left">
            <MapPinAltSolid class="w-5 h-5 text-gray-500" />
          </svelte:fragment>
        </Input>
      </div>
      
      <div class="flex mb-4 space-x-4">
        <!-- Sort Button -->
        <div class="relative">
          <Button class="bg-gray-200 text-gray-800 hover:bg-gray-300" on:click={() => showSortDropdown = !showSortDropdown}>
            Sort
            <SortOutline class="w-4 h-4 ml-2" />
          </Button>
            <Dropdown class="w-64 p-3 space-y-3 text-sm">
              <div class="space-y-2">
                {#each sortableFields as field}
                  <div class="flex items-center justify-between">
                    <button 
                      class="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded w-full"
                      on:click={() => {
                        handleSort(field.field);
                        showSortDropdown = false;
                      }}
                    >
                      <span>{field.label}</span>
                      {#if getSortIcon(field.field)}
                        <svelte:component 
                          this={getSortIcon(field.field)} 
                          class="w-4 h-4 {getSortIcon(field.field) === ArrowUpOutline ? 'text-green-500' : 'text-red-500'}"
                        />
                      {/if}
                    </button>
                    {#if getSortPriority(field.field)}
                      <Badge color="blue" class="ml-2">{getSortPriority(field.field)}</Badge>
                    {/if}
                  </div>
                {/each}
              </div>
              {#if sortCriteria.length > 0}
                <div class="border-t pt-2 mt-2 flex justify-between">
                  <Button size="xs" color="alternative" on:click={() => { 
                    clearSort(); 
                    showSortDropdown = false; 
                  }}>
                    Clear Sort
                  </Button>
                </div>
              {/if}
            </Dropdown>
      
        </div>
      
        <!-- Filter Button -->
        <div class="relative">
          <Button class="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Filter
            <FilterSolid class="w-4 h-4 ml-2" />
          </Button>
          <Dropdown class="w-64 p-3 space-y-3 text-sm">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox>Show Inspection Due</Checkbox>
                <Badge color="yellow" class="ml-2">3</Badge>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox>Show Maintenance Needed</Checkbox>
                <Badge color="red" class="ml-2">2</Badge>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox>Show Rent Check</Checkbox>
                <Badge color="green" class="ml-2">1</Badge>
              </div>
            </div>
            <div class="border-t pt-2 mt-2 flex justify-between">
              <Button size="xs" color="alternative" on:click={() => { updateUrl(); }}>
                Reset Filters
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>
      
    </div>

    {#if sortCriteria.length > 0}
      <div class="mb-4 flex space-x-2">
        <span class="font-semibold text-gray-700">Sorted by:</span>
        {#each sortCriteria as sort}
          <Badge color="blue" dismissable on:close={() => handleSort(sort.field)}>
            {sortableFields.find(f => f.field === sort.field)?.label} 
            {sort.direction === 'asc' ? '▲' : '▼'}
          </Badge>
        {/each}
      </div>
    {/if}

    {#if propertyList?.totalCount === 0}
      <div class="text-center py-8 bg-white rounded-lg shadow">
        <p class="text-xl text-gray-500">No properties found</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each propertyList.entities as property (property.id)}
          <Card 
            class="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            on:click={() => goto(`/properties/${property.id}`)}
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center space-x-2">
                <HomeOutline class="w-6 h-6 text-primary-600" />
                <h3 class="text-lg font-semibold text-gray-800 truncate max-w-[200px]">
                  {property.address}
                </h3>
              </div>
              <div class="flex space-x-2">
                <Button 
                  href={`/properties/${property.id}/edit`} 
                  color="yellow" 
                  size="xs" 
                  on:click={(e) => { 
                    e.stopPropagation(); 
                    goto(`/properties/${property.id}/edit`); 
                  }}
                >
                  <EditSolid class="w-3 h-3" />
                </Button>
                <Button 
                  color="red" 
                  size="xs" 
                  on:click={(e) => { 
                    e.stopPropagation(); 
                    openDeleteModal(property.id); 
                  }}
                >
                  <TrashBinSolid class="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <MapPinAltSolid class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  {property.suburb}, {property.postcode}
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <CashOutline class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  Management Fee: {property.managementFee}%
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <ClockOutline class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  Updated: {formatDate(property.updatedAt)}
                </span>
              </div>
              
              <div class="flex flex-wrap gap-2 mt-2">
                {#each generatePropertyStatus(property) as status}
                  <Badge color={status.color}>{status.label}</Badge>
                {/each}
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {/if}

    <div class="flex justify-between items-center mt-4 bg-white p-3 rounded-lg shadow">
      <span class="text-sm text-gray-600">
        Showing {((propertyList.page - 1) * propertyList.pageSize) + 1}- 
        {Math.min(propertyList.page * propertyList.pageSize, propertyList.totalCount)} of {propertyList.totalCount}
      </span>
      <ButtonGroup>
        <Button 
          href={`?page=${propertyList.page - 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} 
          disabled={propertyList.page === 1}
        >
          <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        {#each { length: propertyList.totalPages } as _, i (i)}
          <Button 
            href={`?page=${i + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`}
          >
            {i + 1}
          </Button>
        {/each}
        <Button 
          href={`?page=${propertyList.page + 1}${searchTerm ? `&searchQuery=${searchTerm}` : ''}${sortCriteria.length > 0 ? `&sort=${sortCriteria.map(s => `${s.field}:${s.direction}`).join(',')}` : ''}`} 
          disabled={propertyList.page === propertyList.totalPages}
        >
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