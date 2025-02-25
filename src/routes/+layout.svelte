<script lang="ts">
  import "../app.css"
  import { page } from '$app/state';
    import {
      Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem,
      DropdownHeader, DropdownDivider,
      Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper
    } from 'flowbite-svelte';
  
  import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline, ServerOutline } from 'flowbite-svelte-icons';
  $: activeUrl =  page.url.pathname
  let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
  let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
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
        <!-- <NavHamburger class1="w-full md:flex md:w-auto md:order-1" /> -->
      </div>
      <Dropdown placement="bottom" triggeredBy="#avatar-menu">
        <DropdownHeader>
          <span class="block text-sm">Bonnie Green</span>
          <span class="block truncate text-sm font-medium">name@flowbite.com</span>
        </DropdownHeader>
        <DropdownItem>Dashboard</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Earnings</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Sign out</DropdownItem>
      </Dropdown>
      <NavUl>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/about">About</NavLi>
        <NavLi href="/docs/components/navbar">Navbar</NavLi>
        <NavLi href="/pricing">Pricing</NavLi>
        <NavLi href="/contact">Contact</NavLi>
      </NavUl>
    </Navbar>
  
    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar {activeUrl} {activeClass} {nonActiveClass} class="border-r">
        <SidebarWrapper>
          <SidebarGroup>
            <SidebarItem label="Dashboard" href="/">
              <svelte:fragment slot="icon">
                <ChartPieSolid class="w-6 h-6" />
              </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Accordion" href="/docs/components/accordion">
              <svelte:fragment slot="icon">
                <GridSolid class="w-6 h-6" />
              </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Alert" href="/docs/components/alert">
              <svelte:fragment slot="icon">
                <MailBoxSolid class="w-6 h-6" />
              </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Sidebar" href="/docs/components/sidebar">
              <svelte:fragment slot="icon">
                <UserSolid class="w-6 h-6" />
              </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Badge" href="/docs/components/badge">
              <svelte:fragment slot="icon">
                <ArrowRightToBracketOutline class="w-6 h-6" />
              </svelte:fragment>
            </SidebarItem>
          </SidebarGroup>
        
          <!-- Bottom Metrics Button -->
          <div class="absolute bottom-4 left-4 group">
            <a href="/monitor" class="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ServerOutline
              class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <div class="absolute bottom-full left-0 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                <span class="bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  Server monitor page
                </span>
              </div>
            </a>
          </div>
        </SidebarWrapper>
        
      </Sidebar>
  
      <!-- Page content -->
      <main class="p-4 flex-1 overflow-auto">
        <slot></slot>
      </main>
    </div>
  </div>
  