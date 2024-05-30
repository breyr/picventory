<script lang="ts">
	import type { UserData } from "$lib/customtypes";
	import { db, user } from '$lib/firebase';
	import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
	import { quintOut } from "svelte/easing";
	import type { Writable } from "svelte/store";
	import { slide } from "svelte/transition";

    export let showFormStore: Writable<boolean>;

    let showForm = false;
    let newTagName = "";
    let loading = false;
    let isAvailable = false;
    let saving = false;

    let debounceTimer: NodeJS.Timeout;

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isValid = newTagName?.length > 2 && newTagName.length < 16 && re.test(newTagName);
    $: isTouched = newTagName.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;

    async function checkTagAvailability() {
        isAvailable = false;
        loading = true;
        // reset timeout
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            // create document reference
            const ref = doc(db, "users", $user!.uid);
            // get the user's document
            const snapshot = await getDoc(ref);
            const data = snapshot.data() as UserData;
            // if the snapshot exists and doesn't include the newTagName 
            isAvailable = snapshot.exists() && !data.tags.includes(newTagName);
            loading = false;
        }, 500)
    }

    async function saveTag() {
        saving = true;
        // create doc reference
        const ref = doc(db, "users", $user!.uid);
        // add newTagName to the tags array in the document
        await updateDoc(ref, {
            tags: arrayUnion(newTagName)
        });
        saving = false;
        newTagName = '';
    }

</script>

<form class="sm:w-1/2 sm:mx-auto sm:flex sm:flex-col sm:items-center" transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}>
<label class="form-control w-full max-w-xs">
    <div class="label">
        <span class="label-text">New tag</span>
    </div>
    <input 
        type="text"
        placeholder="tag name"
        class="input input-bordered w-full max-w-xs mb-4"
        bind:value={newTagName}
        on:input={checkTagAvailability}
    />
</label>
{#if loading}
    <p class="text-slate-400 text-sm mb-3">Checking availability of #{newTagName}...</p>
{/if}
{#if !isValid && isTouched}
    <p class="text-error text-sm mb-3">
    must be 3-16 characters long, alphanumeric only
    </p>
{/if}
{#if isTaken}
    <p class="text-warning text-sm mb-3">
        #{newTagName} is already saved
    </p>
{/if}
{#if isAvailable && isValid}
    <button 
        class="btn btn-success" 
        on:click={async () => {
            await saveTag();
        }}
        disabled={saving}
    >
        {#if saving}
        <span class="loading loading-dots loading-sm"></span>
        {:else}
        <i class="fa-solid fa-plus"></i> 
        {/if}
        add
    </button>
{/if}
<button class="btn btn-neutral" on:click={() => { newTagName = ''; showFormStore.set(!$showFormStore); }}>
    done
</button>
</form>

