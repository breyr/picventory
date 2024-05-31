<script lang="ts">
    import { page } from "$app/stores";
    import { user, userData } from "$lib/firebase";
    import { onMount } from 'svelte';

    let loading: boolean;
    
    // fetch item here becuase firebase auth emulator cannot generate cookies so we can't fetch authorized data
    // otherwise would use page.server.ts to fetch item data
    onMount(() => {
        loading = true;
    });
</script>

<div class="flex-1 flex flex-col justify-center sm:px-0 px-5 sm:w-96 w-full sm:mx-auto">
    <a href={`/${$userData?.username}/items`}><i class="fa-solid fa-arrow-left"></i> back</a>
    {#if loading}
        <div class="flex flex-col gap-4 w-full sm:w-96">
            <div class="skeleton mx-auto w-40 h-40"></div>
            <div class="skeleton h-4 w-1/4 mx-auto"></div>
            <div class="skeleton h-12 w-full"></div>
            <div class="skeleton h-12 w-full"></div>
            <div class="skeleton w-full h-24"></div>
        </div>
    {/if}
    <div class="flex flex-row justify-between gap-2 sm:mt-12 mt-8 px-10">
        <button class="btn btn-error btn-outline btn-sm" disabled={loading}><i class="fa-solid fa-trash"></i> Delete</button>
        <button class="btn btn-success btn-outline btn-sm" disabled={loading}><i class="fa-regular fa-floppy-disk"></i> Save</button>
    </div>
</div>