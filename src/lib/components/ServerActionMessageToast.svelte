<script lang="ts">
    import { fade } from "svelte/transition";

    export let customMessage: string | null = null;

    let notificationVisible: boolean = false;
    let toastTimeout: NodeJS.Timeout;
    let progress: number = 100;
    let duration: number = 3000; // duration of the toast in milliseconds
    let progressInterval: NodeJS.Timeout;

    // if we received a message
    $: if (customMessage && !notificationVisible) {
        clearTimeout(toastTimeout);
        clearInterval(progressInterval);
        notificationVisible = true;
        progress = 100;

        // update the progress bar every 30ms
        progressInterval = setInterval(() => {
            if (progress > 0) {
                progress -= 100 / (duration / 30); // decrease progress by a fraction every 30ms
            } else {
                clearInterval(progressInterval);

                // Start the timer
                toastTimeout = setTimeout(() => {
                    notificationVisible = false;
                    customMessage = null;
                }, 10); // delay before hiding the toast
            }
        }, 30);
    }
</script>

{#if notificationVisible}
    <div class="toast sm:toast-end toast-center">
        <div class="alert sm:w-96 w-full" in:fade={{ duration: 200 }} out:fade={{ duration: 200}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{customMessage}</span>
            <progress class="progress progress-info w-full" value={progress} max="100"></progress>
        </div>
    </div>
{/if}