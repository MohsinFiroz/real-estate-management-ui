import { writable } from 'svelte/store';

export const sidebarStore = writable<boolean>(true); // Default: Sidebar open
