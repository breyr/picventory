<script lang="ts">
    import { auth, user } from '$lib/firebase';
    import { signOut } from 'firebase/auth';
    import { fly } from 'svelte/transition';
    import ProviderButton from '../../lib/components/ProviderButton.svelte';

    async function signOutSSR() {
        const res = await fetch("/api/signin", { method: "DELETE" })
        await signOut(auth);
    }
</script>

<div class="flex sm:items-center flex-col justify-center gap-10">
    <h2 class="mx-auto text-3xl font-bold">Log into Picventory</h2>
    {#if $user}
        <div in:fly={{ x:'-100%', duration: 500 }} class="flex flex-col">
            <h2 class="text-center">Welcome, <span class="text-blue-400 font-semibold">{$user.displayName}</span></h2>
            <a class="btn btn-neutral my-3" href="/register/username">continue <i class="fa-solid fa-arrow-right"></i></a>
            <button class="btn btn-error" on:click={signOutSSR}>wrong account? sign out</button>
        </div>
    {:else}
    <ProviderButton />
    {/if}
</div>