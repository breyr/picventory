<script lang="ts">
	import { goto } from "$app/navigation";
	import ProviderButton from "$lib/components/ProviderButton.svelte";
	import { userData } from "$lib/firebase";
	import { writable } from "svelte/store";
	import { fade } from "svelte/transition";

    let loadingStore = writable(false);

    // if store is not null redirect to items - account has been setup
    $: if ($userData) {
        loadingStore.set(false);
        if ($userData.username) {
            goto(`/${$userData.username}/items`);
        } else {
            goto('/register');
        }
    }
</script>
<main class="flex-1 flex flex-col justify-center p-5 items-center" in:fade={{duration: 500}}>
    <h1 class="text-5xl mb-10 text-center font-bold">Picventory</h1>
    <button 
        class="btn btn-primary sm:w-96 w-full" 
        on:click={async () => await goto('/register')}
        disabled={$loadingStore}
    >
        Get Started
    </button>
    <div class="text-center my-5">
        <span class="text-neutral">|</span>
        <p>or login if you have an account already setup</p>
        <span class="text-neutral">|</span>
    </div>
    <ProviderButton {loadingStore} />
    <span class="loading loading-dots loading-lg mx-auto mt-3" class:hidden={!$loadingStore}></span>
</main>