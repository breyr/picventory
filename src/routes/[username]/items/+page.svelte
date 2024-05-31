<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import ClickableTag from '$lib/components/ClickableTag.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import { selectedTagsStore } from '$lib/customStores';
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

    $: storedItems = $userItems;
    $: storedTags = $userData?.tags;
    $: selectedTags = $selectedTagsStore;
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
            <button class="btn" on:click={() => showModal = true}>
                <i class="fa-solid fa-filter"></i>
                Filter
            </button>
        </div>
        {#if loading }
            <span class="loading loading-dots loading-sm mx-auto"></span>
        {:else if filteredItemsLength === 0}
            {#if selectedTags.length === 0}
            <!-- didn't find anything for search term -->
            <p class="text-center">no items matching search: <span class="font-semibold text-blue-400">{searchTerm}</span></p>
            {:else}
            <!-- didn't find anything for search term -->
            <p class="text-center">no items matching tag(s): <span class="font-semibold text-blue-400">{selectedTags.toString()}</span></p>
            {/if}
        {:else}
            <div class="flex flex-wrap justify-around gap-2">
                <!-- might not have any items stored to begin with so we must check -->
                {#if filteredItems}
                    {#each filteredItems as item (item.id)}
                        <a href={`/${$userData?.username}/items/${item.id}/edit`}>
                            <div class="card bg-base-200 shadow-xl mb-3 transform transition-all duration-200 hover:scale-105">
                                <figure><img src={item.data.photoURL} alt="photoURL" /></figure>
                                <div class="card-body">
                                    <h2 class="card-title">
                                    {item.data.name}
                                    </h2>
                                    <div class="card-actions justify-between">
                                        <div>
                                            {#each item.data.tags as tag}
                                                <div class="badge badge-primary font-bold"># {tag}</div> 
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each}
                {/if}
            </div>
        {/if}
        <!-- filter by selecting tags modal -->
        <Modal bind:showModal>
            <h2 slot="header" class="font-bold text-lg text-blue-400">
                Filter Items by Tags
            </h2>
            <!-- put tags here -->
            {#if storedTags}
                <div class="flex flex-wrap justify-center gap-2">
                    {#each storedTags as tag}
                        <ClickableTag text={tag} />
                    {/each}
                </div>
            {/if}
        </Modal>
    </main>
</AuthCheck>
