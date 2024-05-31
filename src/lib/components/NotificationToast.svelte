<script lang="ts">
    import { notificationStore } from "$lib/customStores";
    import { fade } from "svelte/transition";

    let notificationVisible: boolean;
    let toastTimeout: NodeJS.Timeout;

    $: if ($notificationStore) {
        clearTimeout(toastTimeout);
        notificationVisible = true;
        toastTimeout = setTimeout(() => {
            notificationStore.set(null);
            notificationVisible = false;
        }, 3000);
    }
</script>

{#if $notificationStore}
    <div class="toast sm:toast-end toast-center">
        <div class="alert sm:w-96 w-full" transition:fade={{ duration: 200 }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{$notificationStore}</span>
        </div>
    </div>
{/if}

