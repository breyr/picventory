<script lang="ts">
    import { goto } from "$app/navigation";
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import NewTagForm from '$lib/components/NewTagForm.svelte';
    import { db, user, userData } from '$lib/firebase';
    import { doc, updateDoc } from 'firebase/firestore';
    import { writable } from "svelte/store";

    let showFormStore = writable(false);
    let completingRegistration = false;

    $: userTags = $userData?.tags ?? [];

    async function updateUserDocAndNavigatie() {
        // don't need to set back to false since the user is being redirected to items
        // if they try to access registraion again after completing it
        completingRegistration = true;
        const ref = doc(db, "users", $user!.uid);
        // update registrationComplete to true
        await updateDoc(ref, {
            registrationComplete: true
        })
        await goto(`/${$userData?.username}/items`);
    }

</script>
<AuthCheck>
    <h2 class="text-3xl font-bold text-center mb-3">Add some tags</h2>
    <p class="mt-4 text-center">Tags on your account:</p>
    <div class="flex flex-wrap gap-2 items-center justify-center my-5">
        {#each userTags as tag}
            <div class="badge badge-neutral">#{tag}</div>
        {/each}
    </div>
    {#if $showFormStore}
        <NewTagForm {showFormStore} />
    {:else}
        <div class="flex flex-col">
            <button class="btn btn-primary sm:w-96 sm:mx-auto w-full" on:click={() => showFormStore.set(true)} disabled={completingRegistration}>
                Create a new tag
            </button>
            <!-- we require at least one tag -->
            {#if userTags.length >= 1}
            <div class="text-center my-5">
                <span class="text-neutral">|</span>
                <p>done? add your first item!</p>
                <span class="text-neutral">|</span>
            </div>
            <button on:click={updateUserDocAndNavigatie} class="btn btn-neutral" disabled={completingRegistration}>
                {#if completingRegistration}
                    <span class="loading loading-spinner loading-md"></span>
                {/if}
                continue <i class="fa-solid fa-arrow-right"></i>
            </button>
            {/if}
        </div>
    {/if}
</AuthCheck>
