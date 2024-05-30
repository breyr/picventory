<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth, user } from '$lib/firebase';
    import { signOut } from 'firebase/auth';
    import { fly } from 'svelte/transition';
    import ProviderButton from '../../lib/components/ProviderButton.svelte';

    async function signOutSSR() {
        const res = await fetch("/api/signin", { method: "DELETE" })
        await signOut(auth);
    }
</script>

<div class="flex sm:items-center flex-col justify-center">
    <h2 class="mx-auto text-3xl font-bold mb-3">Log into Picventory</h2>
    {#if $user}
        <div in:fly={{ x:'-100%', duration: 500 }} class="flex flex-col">
            <h2 class="text-center">Welcome, <span class="text-blue-400 font-semibold">{$user.displayName}</span></h2>
            <button class="btn btn-neutral my-3" on:click={async () => await goto("/register/username")}>continue <i class="fa-solid fa-arrow-right"></i></button>
            <button class="btn btn-error" on:click={signOutSSR}>wrong account? sign out</button>
            
        </div>
    {:else}
        <div class="mt-3">
            <ProviderButton />
        </div>
    {/if}
</div>