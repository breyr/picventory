<script lang="ts">
	import AuthCheck from "$lib/components/AuthCheck.svelte";
	import ClickableTag from "$lib/components/ClickableTag.svelte";
	import NotificationToast from "$lib/components/NotificationToast.svelte";
	import { notificationStore, selectedNewItemTagsStore } from "$lib/customStores";
	import { db, storage, user, userData } from "$lib/firebase";
	import { collection, doc, setDoc } from "firebase/firestore";
	import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    let newItemName = "";
    let newItemDesc = "";
    let newItemTags: string[];
    let storedTags: string[] | undefined;
    let newItemPhoto: File | null = null;
    let imagePreview: string | null = null;
    let fileInput: HTMLInputElement;
    let uploading = false;

    const re = /^(?=[a-zA-Z0-9._ ]{3,50}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isNameValid = newItemName?.length > 2 && newItemName.length < 50 && re.test(newItemName);
    $: isDescValid = newItemName?.length > 2 && newItemName.length < 50 && re.test(newItemDesc);
    $: isNameTouched = newItemName.length > 0;
    $: isDescTouched = newItemDesc.length > 0;

    $: storedTags = $userData?.tags;
    $: {
        newItemTags = $selectedNewItemTagsStore;
        console.log(newItemTags);
    }
    $: imagePreview = newItemPhoto ? URL.createObjectURL(newItemPhoto) : null;

    function handleFileSelect(event: any) {
        newItemPhoto = event.target.files[0];
    }

    function resetFields() {
        newItemName = "";
        newItemDesc = "";
        selectedNewItemTagsStore.set([]);
        newItemPhoto = null;
    }

    async function uploadItem() {
        try {
            uploading = true;
            // create random id for file name
            const randomId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
            const storageRef = ref(storage, `users/${$user!.uid}/${randomId}.png`);
            const result = await uploadBytes(storageRef, newItemPhoto!);
            const url = await getDownloadURL(result.ref);
    
            const newItemRef = doc(collection(db, "items"));
            await setDoc(newItemRef, {
                name: newItemName,
                description: newItemDesc,
                photoURL: url,
                tags: newItemTags,
                uid: $user?.uid,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
    
            uploading = false;
            resetFields();
            notificationStore.set("item saved");
        } catch (err: any) {
            uploading = false;
            notificationStore.set("error saving, please try again");
        }
    }
</script>

<AuthCheck>
    <main class="flex-1 flex flex-col px-5 sm:w-3/4 w-full sm:mx-auto">
        <!-- back button -->
         <a href={`/${$userData?.username}/items`}><i class="fa-solid fa-arrow-left"></i> back</a>
        <!-- image placeholder -->
        <div class="flex flex-col justify-center">
            {#if imagePreview}
            <div class="h-48 w-48 mx-auto my-5">
                <img src={imagePreview} alt="preview" class="w-full h-full object-cover"/>
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
                <input type="text" class="grow" placeholder="Item name" bind:value={newItemName} disabled={uploading}/>
            </label>
            {#if !isNameValid && isNameTouched}
                <p class="text-error text-sm mb-3">
                item name must be 3-50 characters long, alphanumeric only
                </p>
            {/if}
            <!-- new item description input -->
            <label class="input input-bordered flex items-center gap-2" class:input-success={isDescValid && isDescTouched} class:input-error={!isDescValid && isDescTouched}>
                <input type="text" class="grow" placeholder="Description" bind:value={newItemDesc} disabled={uploading}/>
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
            <div class="flex flex-wrap justify-center px-5 overflow-y-auto">
                {#each storedTags as tag}
                    <ClickableTag text={tag} storeName="new item" />
                {/each}
            </div>
            {/if}
            <!-- save and cancel buttons -->
            <div class="flex flex-row mt-5">
                <button class="flex flex-col justify-center items-center flex-grow" on:click={uploadItem} disabled={uploading}>
                    <i class="fa-regular fa-floppy-disk"></i>
                    save
                </button>
                <button class="btn btn-primary text-white sm:w-96 sm:mx-auto" on:click={() => fileInput.click()} disabled={uploading}>
                    <i class="fa-solid fa-camera"></i>
                    add photo
                </button>
                <button class="flex flex-col justify-center items-center flex-grow"  on:click={resetFields} disabled={uploading}>
                    <i class="fa-solid fa-rotate-left"></i>
                    reset
                </button>
            </div>
            <div class="flex flex-row justify-center">
                <span class="loading loading-dots loading-lg mt-3" class:hidden={!uploading}></span>
            </div>
        </div>
        <NotificationToast />
    </main>
</AuthCheck>
