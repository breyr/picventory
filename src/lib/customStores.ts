import { writable } from "svelte/store";

export const notificationStore = writable<string | null>(null);
export const selectedFilterTagsStore = writable<string[]>([]);
export const selectedNewItemTagsStore = writable<string[]>([]);