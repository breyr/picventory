<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<svelte:head>
    <title>@{data.username} Items</title>
</svelte:head>

<AuthCheck>
    <main>
    </main>
</AuthCheck>
