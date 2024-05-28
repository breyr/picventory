<script>
    import { page } from "$app/stores";
    import { fade } from "svelte/transition";
</script>

<!-- key causes re-render when $page.url changes -->
{#key $page.url}
    <div in:fade={{ duration: 500 }}>
        <slot />
    </div>
{/key}