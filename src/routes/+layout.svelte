<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import {
    Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Navbar, NavBrand, Avatar, Dropdown,
    DropdownHeader, DropdownItem, DropdownDivider
  } from 'flowbite-svelte';
  import { ChartPieSolid, GridSolid, UserSolid, ServerOutline, HomeSolid, HammerSolid, ReceiptSolid, SearchSolid, UsersSolid } from 'flowbite-svelte-icons';

  $: activeUrl = page.url.pathname;

  let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
  let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
  let sidebarHidden = true;  // Control sidebar visibility for small screens

  const toggleSidebar = () => {
    sidebarHidden = !sidebarHidden;
  };
</script>

<div class="flex flex-col h-screen">
  <!-- Navbar -->
  <Navbar fluid={true} class="border-b">
    <NavBrand href="/">
      <img src="https://fakeimg.pl/250x250/ededed/4f4b61?text=REM&font=museo&font_size=100" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Real Estate Management</span>
    </NavBrand>

    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" src="https://picsum.photos/200" />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
        <span class="block text-sm">Ruhul Amin</span>
        <span class="block truncate text-sm font-medium">ruhul@softcelia.com</span>
      </DropdownHeader>
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Tasks</DropdownItem>
      <DropdownDivider />
      <DropdownItem>Sign out</DropdownItem>
    </Dropdown>

    <!-- Hamburger Icon for Mobile -->
    <button class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" on:click={toggleSidebar}>
      <span class="sr-only">Open sidebar</span>
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M4.5 5.5a.75.75 0 011.5 0v12a.75.75 0 01-1.5 0v-12zM10.5 5.5a.75.75 0 011.5 0v12a.75.75 0 01-1.5 0v-12zM16.5 5.5a.75.75 0 011.5 0v12a.75.75 0 01-1.5 0v-12z" />
      </svg>
    </button>
  </Navbar>

  <div class="flex flex-1">
    <!-- Sidebar -->
    <Sidebar {activeUrl} {activeClass} {nonActiveClass} class={`border-r md:block md:w-64 md:flex-shrink-0 ${sidebarHidden ? 'hidden' : ''}`}>
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarItem label="Dashboard" href="/">
            <svelte:fragment slot="icon">
              <ChartPieSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Rents" href="/rents">
            <svelte:fragment slot="icon">
              <GridSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Properties" href="/properties">
            <svelte:fragment slot="icon">
              <HomeSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Maintance" href="/Maintance">
            <svelte:fragment slot="icon">
              <HammerSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Bills" href="/bills">
            <svelte:fragment slot="icon">
              <ReceiptSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Inspections" href="/inspections">
            <svelte:fragment slot="icon">
              <SearchSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
          <SidebarItem label="Owners" href="/owners">
            <svelte:fragment slot="icon">
              <UsersSolid class="w-6 h-6" />
            </svelte:fragment>
          </SidebarItem>
        </SidebarGroup>

        <!-- Bottom Buttons -->
        <div class="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <div class="group">
            <a href="/monitor" class="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ServerOutline class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <div class="absolute bottom-full left-0 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                <span class="bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  Server monitor page
                </span>
              </div>
            </a>
          </div>
          <div class="group">
            <a href="/users" class="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <UserSolid class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <div class="absolute bottom-full left-0 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                <span class="bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  User Management
                </span>
              </div>
            </a>
          </div>
        </div>
      </SidebarWrapper>
    </Sidebar>

    <!-- Page content -->
    <main class="p-4 flex-1 overflow-auto">
      <slot></slot>
    </main>
  </div>
</div>
