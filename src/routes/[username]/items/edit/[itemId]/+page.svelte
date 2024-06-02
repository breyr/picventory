<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import AuthCheck from "$lib/components/AuthCheck.svelte";
	import ClickableTag from "$lib/components/ClickableTag.svelte";
	import NotificationToast from "$lib/components/NotificationToast.svelte";
	import { notificationStore, selectedNewItemTagsStore } from "$lib/customStores";
	import type { UserItem } from "$lib/customtypes";
	import { db, storage, user, userData } from "$lib/firebase";
	import { error } from "@sveltejs/kit";
	import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
	import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
	import { onMount } from 'svelte';

    let itemName = "";
    let itemDesc = "";
    let itemTags: string[];
    let storedTags: string[] | undefined;
    let newItemPhoto: File | null = null;
    let imagePreview: string | null = null;
    let fileInput: HTMLInputElement;
    let uploading = false;
    let deleting = false;
    let loading: boolean;

    const re = /^(?=[a-zA-Z0-9._ ]{3,50}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isNameValid = itemName?.length > 2 && itemName.length < 50 && re.test(itemName);
    $: isDescValid = itemName?.length > 2 && itemName.length < 50 && re.test(itemDesc);
    $: isNameTouched = itemName.length > 0;
    $: isDescTouched = itemDesc.length > 0;

    $: storedTags = $userData?.tags;
    $: {
        itemTags = $selectedNewItemTagsStore;
        console.log(itemTags);
    }
    $: imagePreview = newItemPhoto ? URL.createObjectURL(newItemPhoto) : null;
    
    // fetch item here becuase firebase auth emulator cannot generate cookies so we can't fetch authorized data
    // otherwise would use page.server.ts to fetch item data
    onMount(async () => {
        loading = true;
        const docRef = doc(db, `items/${$page.params.itemId}`);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
            throw error(404, "that item doesn't exist");
        }
        const data = docSnapshot.data() as UserItem;
        if (data.uid != $user?.uid) {
            throw error(403, "you do not own that item");
        }
        // update fields
        imagePreview = data.photoURL;
        itemName = data.name;
        itemDesc = data.description;
        itemTags = data.tags;
        // need to update store so clickable tag component shows as already clicked
        selectedNewItemTagsStore.set(itemTags);
        loading = false;
    });

    function handleFileSelect(event: any) {
        newItemPhoto = event.target.files[0];
    }

    async function uploadItem() {
        try {
            uploading = true;
            let url = null;
            // only create and delete photos if the user chose a new one
            if (newItemPhoto) {
                // create random id for file name
                const randomId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
                const storageRef = ref(storage, `users/${$user!.uid}/${randomId}.png`);
                const result = await uploadBytes(storageRef, newItemPhoto!);
                url = await getDownloadURL(result.ref);

                const oldImageRef = ref(storage, imagePreview!);
                await deleteObject(oldImageRef);
            }
    
            const itemRef = doc(db, `items/${$page.params.itemId}`);

            await updateDoc(itemRef, {
                name: itemName,
                description: itemDesc,
                photoURL: url ?? imagePreview,
                tags: itemTags,
                uid: $user?.uid,
                updatedAt: Date.now(),
            });

            notificationStore.set("item updated");
            // redirect after notification - optional
        } catch (err: any) {
            notificationStore.set("error updating, please try again");
        } finally {
            uploading = false;
        }
    }

    async function deleteItem() {
        if (confirm('Are you sure you want to delete this item?')) {
            // delete item if confirmed
            try {
                loading = true;
                await deleteDoc(doc(db, `items/${$page.params.itemId}`));
                notificationStore.set("item deleted");
                // redirect after deletion
                setTimeout(async () => {
                    goto(`/${$userData?.username}/items`);
                }, 3000)
            } catch (err: any) {
                notificationStore.set("error deleting, please try again");
            }
        }
    }
</script>

<AuthCheck>
    <div class="flex-1 flex flex-col justify-center bg-blue-400 sm:px-0 px-5 sm:w-96 w-full sm:mx-auto">
        <a href={`/${$userData?.username}/items`}><i class="fa-solid fa-arrow-left"></i> back</a>
        {#if loading}
            <div class="flex flex-col gap-4 w-full sm:w-96">
                <div class="skeleton mx-auto w-48 h-48"></div>
                <div class="skeleton h-12 w-full"></div>
                <div class="skeleton h-12 w-full"></div>
                <div class="skeleton w-full h-24"></div>
            </div>
        {:else}
            <div class="flex flex-col justify-center">
                {#if imagePreview}
                <div class="h-48 w-48 mx-auto my-5">
                    <img src={imagePreview} alt="preview" class="w-full h-full object-contain"/>
                </div>
                {:else}
                <div class="border text-9xl px-5 py-5 rounded-md my-5 h-48 w-48 flex flex-col justify-center items-center mx-auto">
                    <i class="fa-regular fa-image"></i>
                </div>
                {/if}
                <!-- regular file upload and camera picture -->
                <input bind:this={fileInput} type="file" class="file-input file-input-bordered file-input-primary w-full max-w-xs hidden" accept="image/*" capture="environment" on:change={handleFileSelect}/>
            </div>
            <div class="flex flex-col gap-2">
                <!-- new item name input -->
                <label class="input input-bordered flex items-center gap-2" class:input-success={isNameValid && isNameTouched} class:input-error={!isNameValid && isNameTouched}>
                    <input type="text" class="grow" placeholder="Item name" bind:value={itemName} disabled={uploading}/>
                </label>
                {#if !isNameValid && isNameTouched}
                    <p class="text-error text-sm mb-3">
                    item name must be 3-50 characters long, alphanumeric only
                    </p>
                {/if}
                <!-- new item description input -->
                <label class="input input-bordered flex items-center gap-2" class:input-success={isDescValid && isDescTouched} class:input-error={!isDescValid && isDescTouched}>
                    <input type="text" class="grow" placeholder="Description" bind:value={itemDesc} disabled={uploading}/>
                    <span class="badge badge-ghost">Optional</span>
                </label>
                {#if !isDescValid && isDescTouched}
                    <p class="text-error text-sm mb-3">
                    item description must be 3-50 characters long, alphanumeric only
                    </p>
                {/if}
                <!-- new item associated tags -->
                {#if storedTags}
                    <h3 class="font-semibold">Select tags:</h3>
                    <div class="flex flex-wrap justify-center px-5 overflow-y-auto gap-2">
                        {#each storedTags as tag}
                            <ClickableTag text={tag} storeName="new item" />
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
        <div class="flex flex-row mt-5">
            <button class="flex flex-col justify-center items-center flex-grow" on:click={uploadItem} disabled={uploading || loading}>
                <i class="fa-regular fa-floppy-disk"></i>
                save
            </button>
            <button class="btn btn-primary text-white sm:w-48 sm:mx-auto" on:click={() => fileInput.click()} disabled={uploading || loading}>
                <i class="fa-solid fa-camera"></i>
                {#if imagePreview}
                change photo
                {:else}
                add photo
                {/if}
            </button>
            <button class="flex flex-col justify-center items-center flex-grow"  on:click={deleteItem} disabled={uploading || loading}>
                <i class="fa-solid fa-trash-can"></i>
                delete
            </button>
        </div>
        <div class="flex flex-row justify-center">
            <span class="loading loading-dots loading-lg mt-3" class:hidden={!uploading}></span>
        </div>
        <NotificationToast />
    </div>
</AuthCheck>