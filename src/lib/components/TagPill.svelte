<script lang="ts">
    export let text: string;
    export let selected = false;
</script>

<button on:click={() => selected = !selected} class="btn btn-neutral btn-sm" class:btn-outline={!selected}>
    {#if !selected}
    <i class="fa-solid fa-plus"></i>
    {:else}
    <i class="fa-solid fa-check"></i>
    {/if}
    {text}
</button>
