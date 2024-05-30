<script lang="ts">
    import { selectedTagsStore } from "$lib/customStores";

    export let text: string;

    let thisTagSelected = false;
    let selected: string[] | [];

    $: selected = $selectedTagsStore;

    function handleClick() {
        // update if the tag is selected or not
        thisTagSelected = !thisTagSelected;
        if (thisTagSelected) {
            // the tag is not selected, add it to the store
            selectedTagsStore.set([...selected, text]);
        } else {
            // the tag is already selected, remove it from the store
            selectedTagsStore.set(selected.filter(tag => tag !== text));
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

