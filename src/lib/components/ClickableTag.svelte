<script lang="ts">
    import { selectedFilterTagsStore, selectedNewItemTagsStore } from "$lib/customStores";

    export let text: string;
    export let storeName: "filter" | "new item";

    let thisTagSelected = false;
    let selected: string[] | [];

    let store = storeName === 'filter' ? selectedFilterTagsStore : selectedNewItemTagsStore;

    $: {
        selected = $store;
        thisTagSelected = selected.includes(text);
    }

    function handleClick() {
        // update if the tag is selected or not
        thisTagSelected = !thisTagSelected;
        if (thisTagSelected) {
            // the tag is not selected, add it to the store
            store.set([...selected, text]);
        } else {
            // the tag is already selected, remove it from the store
            store.set(selected.filter(tag => tag !== text));
        }
    }
</script>

<button class="btn btn-neutral" class:btn-outline={!thisTagSelected} on:click={handleClick}>
    {#if !thisTagSelected}
        <i class="fa-solid fa-plus"></i>
    {:else}
        <i class="fa-solid fa-check"></i>
    {/if}
    {text}
</button>

