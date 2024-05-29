<script lang="ts">
	import { goto } from "$app/navigation";
	import ProviderButton from "$lib/components/ProviderButton.svelte";
	import { user, userData } from "$lib/firebase";

    // if store is not null redirect to items - account has been setup
    $: if ($userData) {
        goto(`/${$userData?.username}/items`);
    }
</script>
<main class="flex-1 flex flex-col justify-center p-5">
    <h1 class="text-5xl mb-10 text-center font-bold">Picventory</h1>
    <a href="/register" class="btn btn-primary">Get Started</a>
    <div class="text-center my-5">
        <span class="text-neutral">|</span>
        <p>or login if you have an account already setup</p>
        <span class="text-neutral">|</span>
    </div>
    {#if !$user} 
        <ProviderButton />
    <!-- user signed in, but no associated data means account hasn't been set up yet -->
    {:else if ($user && !$userData)} 
        {goto('/register')}
    {/if}
</main>