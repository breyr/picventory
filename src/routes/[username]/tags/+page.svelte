<script lang="ts">
	import { enhance } from "$app/forms";
	import NewTagForm from "$lib/components/NewTagForm.svelte";
	import ServerActionMessageToast from "$lib/components/ServerActionMessageToast.svelte";
	import { userData } from "$lib/firebase";
	import { writable } from "svelte/store";
	import type { ActionData } from "./$types";

    export let form: ActionData;

    let showFormStore = writable(false);
    // pattern for filtering items
    // keep track of the original user state and derive another variable from that
    // reactive state so filteredTags gets additions/deletions
    let searchTerm = "";
    let loading = false;
    let userTags: string[] | undefined;
    let filteredTags: string[] | undefined;
    $: userTags = $userData?.tags;
    $: {
        loading = true;
        filteredTags = userTags?.filter(t => t.includes(searchTerm));
        loading = false;
    }
</script>

<div class="flex-1 px-5 sm:w-3/4 sm:mx-auto w-full flex flex-col h-3/4">
    <div class="flex sm:gap-3 sm:h-auto flex-col mb-5 ">
        <label class="input input-bordered flex items-center gap-2 sm:mb-0 mb-2">
            <input type="text" class="grow" placeholder="Search" bind:value={searchTerm}/>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
        </label>
        {#if $showFormStore}
            <NewTagForm {showFormStore} />
        {:else}
            <button class="btn btn-neutral sm:w-96 sm:mx-auto w-full" on:click={() => showFormStore.set(!$showFormStore)}>
                add tag
            </button>
        {/if}
    </div>
    <div class="flex-1 flex-grow overflow-auto flex flex-col gap-2 sm:w-48 sm:mx-auto">
        <!-- this is here for when filtering takes a while, or we don't have tags loaded yet  -->
        {#if loading || !filteredTags}
            <span class="loading loading-dots loading-sm mx-auto"></span>
        {:else}
            {#each filteredTags as tag}
                <div class="flex flex-row justify-between items-center bg-base-300 p-3 rounded-md">
                    <p class="font-semibold text-md">#{tag}</p>
                    <form method="POST" use:enhance>
                        <input type="hidden" value={tag} name="tagName" />
                        <button type="submit" class="btn btn-error btn-outline"><i class="fa-solid fa-trash-can"></i></button>
                    </form>
                </div>
            {/each}
        {/if}
    </div>
    {#if form?.message}
        <ServerActionMessageToast customMessage={form.message}/>
    {/if}
</div>