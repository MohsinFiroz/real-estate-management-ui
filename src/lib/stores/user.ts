import { writable } from "svelte/store";
import type { User } from "$lib/types/user";

export const users = writable<User[]>([]);
export const editingUser = writable<User | null>(null);
export const isLoading = writable<boolean>(false);
