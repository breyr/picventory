<script lang="ts">
	import { goto } from "$app/navigation";
	import ProviderButton from "$lib/components/ProviderButton.svelte";
	import { userData } from "$lib/firebase";
</script>

{#if !$userData}
    <div class="flex-1 flex flex-col justify-center p-5">
        <h1 class="text-3xl text-center font-bold mb-3"> <i class="fa-solid fa-image"></i> Picventory</h1>
        <ProviderButton />
    </div>
{:else}
    <!-- redirect to user items home screen -->
    {goto(`/${$userData.username}/items`)}
{/if}