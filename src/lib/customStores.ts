import { writable } from "svelte/store";

export const notification = writable<string | null>(null);
export const selectedTagsStore = writable<string[]>([]);