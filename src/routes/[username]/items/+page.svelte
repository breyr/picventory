<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import ClickableItem from '$lib/components/ClickableItem.svelte';
    import ClickableTag from '$lib/components/ClickableTag.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import { selectedFilterTagsStore } from '$lib/customStores';
    import type { UserItem } from '$lib/customtypes';
    import { userData, userItems } from '$lib/firebase';

    let showModal = false;
    let searchTerm = "";
    let loading = false;
    let storedTags: string[] | undefined;
    let selectedTags = [];
    let storedItems: { id: string, data: UserItem }[] | null;
    let filteredItems: { id: string, data: UserItem }[] | undefined;
    let filteredItemsLength = 0;

    // TODO add custom sorting in the filter modal
    $: storedItems = $userItems;
    $: storedTags = $userData?.tags;
    $: selectedTags = $selectedFilterTagsStore;
    $: {
        loading = true;
        filteredItems = storedItems?.filter(item => 
            item.data.name.toLocaleLowerCase().includes(searchTerm.toLowerCase())
            &&
            (selectedTags.length === 0 || item.data.tags.some(tag => selectedTags.includes(tag)))
        );
        filteredItemsLength = filteredItems ? filteredItems.length : 0;
        loading = false;
    }
</script>

<AuthCheck>
    <main class="flex-1 px-5 sm:w-3/4 w-full sm:mx-auto">
        <div class="flex sm:flex-row sm:gap-3 flex-col sm:h-28 mb-5">
            <label class="input input-bordered flex items-center gap-2 sm:flex-1 sm:mb-0 mb-2">
                <input type="text" class="grow" placeholder="Search" bind:value={searchTerm}/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
            </label>
            <div class="flex flex-row gap-2">
                <a class="btn flex-grow" href={`/${$userData?.username}/items/add`}>
                    <i class="fa-solid fa-plus"></i>
                    Add
                </a>
                <button class="btn flex-grow" on:click={() => showModal = true}>
                    <i class="fa-solid fa-filter"></i>
                    Filter
                </button>
            </div>
            
        </div>
        {#if loading }
            <div class="flex flex-row justify-center">
                <span class="loading loading-dots loading-sm mx-auto"></span>
            </div>
        {:else if filteredItemsLength === 0}
            {#if searchTerm && selectedTags.length > 0}
            <p class="text-center">no items matching search: <span class="font-semibold text-blue-400">{searchTerm}</span></p>
            <p class="text-center">no items matching tag(s): <span class="font-semibold text-blue-400">{selectedTags.toString()}</span></p>
            {:else if selectedTags.length > 0 && !searchTerm}
            <!-- didn't find anything for search term -->
            <p class="text-center">no items matching tag(s): <span class="font-semibold text-blue-400">{selectedTags.toString()}</span></p>
            {:else if searchTerm && selectedTags.length == 0}
            <p class="text-center">no items matching search: <span class="font-semibold text-blue-400">{searchTerm}</span></p>
            <!-- didn't find anything for search term -->
            {:else}
            <div class="text-center">
                <p>You have no items stored.</p>
                <a href={`/${$userData?.username}/items/add`} class="text-primary">add one <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            {/if}
        {:else}
            <div class="flex flex-wrap sm:justify-normal justify-around sm:gap-5 gap-2">
                <!-- might not have any items stored to begin with so we must check -->
                {#if filteredItems}
                    {#each filteredItems as item (item.id)}
                        <ClickableItem {item} />
                    {/each}
                {/if}
            </div>
        {/if}
        <!-- filter by selecting tags modal -->
        <Modal bind:showModal>
            <h2 slot="header" class="font-semibold">
                Filter Items by Tags:
            </h2>
            <!-- put tags here -->
            {#if storedTags}
                <div class="flex flex-wrap justify-center gap-2 mb-10">
                    {#each storedTags as tag}
                        <ClickableTag text={tag} storeName="filter" />
                    {/each}
                </div>
            {/if}
            <div class="flex flex-row justify-end">
                <button class="btn btn-error" on:click={() => selectedFilterTagsStore.set([])}>clear filter</button>
            </div>
        </Modal>
    </main>
</AuthCheck>