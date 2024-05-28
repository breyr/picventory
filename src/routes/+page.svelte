<script>
	import { goto } from "$app/navigation";
	import ProviderButton from "$lib/components/ProviderButton.svelte";
	import { userData } from "$lib/firebase";
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

    $: if ($userData) {
        goto(`/${$userData?.username}/items`);
    }
</script>
<main class="flex-1 flex flex-col justify-center p-5" out:fly={{ x: "-100%", duration: 500 }}>
    <h1 class="text-5xl mb-10 text-center font-bold">Picventory</h1>
    <a href="/register" class="btn btn-primary">Get Started</a>
    <div class="text-center my-5">
        <span class="text-neutral">|</span>
        <p>or login if you have an account already setup</p>
        <span class="text-neutral">|</span>
    </div>
    <ProviderButton />
</main>