<script lang="ts">
    import { goto } from '$app/navigation';
    import { userData } from '$lib/firebase';

    export let message: string = "user data exists";
    let hasDataAlready: boolean;

    $: hasDataAlready = Boolean($userData?.username);
</script>

{#if $userData}
    <div class="text-center my-5">
        <span class="text-neutral">|</span>
        <p>{ message }</p>
        <span class="text-neutral">|</span>
        <br>
        <button class="btn btn-primary mt-5" on:click={async () => await goto(`/${$userData.username}/items`)}>
            go to items <i class="fa-solid fa-arrow-right"></i>
        </button>
    </div>
{:else}
<slot />
{/if}

