<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth, user, userData } from '$lib/firebase';
    import { signOut } from 'firebase/auth';
    import { writable } from "svelte/store";
    import { fly } from 'svelte/transition';
    import ProviderButton from '../../lib/components/ProviderButton.svelte';

    let loadingStore = writable(false);

    // if store is not null redirect to items - account has been setup
    $: if ($userData) {
        loadingStore.set(false);
    }

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
        <div class="mt-3 flex flex-col items-center">
            <ProviderButton {loadingStore} />
            <br>
            <span class="loading loading-dots loading-lg mt-3" class:hidden={!$loadingStore}></span>
        </div>
    {/if}
</div>