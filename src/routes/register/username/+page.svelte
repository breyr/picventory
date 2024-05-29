<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import UserDataCheck from "$lib/components/UserDataCheck.svelte";
    import { db, user, userData } from "$lib/firebase";
    import { collection, doc, getDoc, writeBatch } from "firebase/firestore";

    let username = "";
    let loading = false;
    let isAvailable = false;

    let debounceTimer: NodeJS.Timeout;

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;

    async function checkAvailability() {
        isAvailable = false;
        loading = true;
        // reset timeout
        clearTimeout(debounceTimer);
        // only run every 500ms - essentially when a user is done typing
        debounceTimer = setTimeout(async () => {
            // create document reference
            const ref = doc(db, "usernames", username);
            // check if the document exists
            const exists = await getDoc(ref).then((doc) => doc.exists());
            isAvailable = !exists;
            loading = false;
        }, 500)
    }

    async function confirmUsername() {
        // batch operations since writing to usernames and users document store need to succeed or fail together
        const batch = writeBatch(db);
        // set document in usernames of username to users uid
        batch.set(doc(db, "usernames", username), { uid: $user?.uid });
        // create default document inside users collection
        batch.set(doc(db, "users", $user!.uid), {
            username,
            tags: ["home"]
        });
        // create a new document reference with an auto-generated ID in the items collection
        const newItemRef = doc(collection(db, "items"));
        // create first item for new user inside items collection
        batch.set(newItemRef, {
            name: "Water Bottle",
            photoURL: "https://target.scene7.com/is/image/Target/GUEST_11c3d57e-ebe2-40d2-bffa-d5ff1e3c0d7e?qlt=65&fmt=pjpeg&hei=350&wid=350",
            tags: ["home"],
            uid: $user!.uid
        });

        await batch.commit();

        username = '';
        isAvailable = false;
    }
</script>

<AuthCheck>
    <h2 class="text-3xl text-center font-bold mb-3">Select Username</h2>
    <UserDataCheck message="You've already selected a username!">
        <form on:submit|preventDefault={confirmUsername}>
            <input 
                type="text"
                placeholder="Username"
                class="input input-bordered w-full max-w-xs mb-4"
                bind:value={username}
                on:input={checkAvailability}
                class:input-error={(!isValid && isTouched)}
                class:input-warning={isTaken}
                class:input-success={isAvailable && isValid && !loading}
            />
            <div class="my-4 min-h-16 px-8 w-full">
                {#if loading}
                    <p class="text-secondary">Checking availability of @{username}...</p>
                {/if}
            
                {#if !isValid && isTouched}
                    <p class="text-error text-sm">
                    must be 3-16 characters long, alphanumeric only
                    </p>
                {/if}
            
                {#if isValid && !isAvailable && !loading}
                    <p class="text-warning text-sm">
                    @{username} is not available
                    </p>
                {/if}
            
                {#if isAvailable && isValid}
                    <button class="btn btn-success">Confirm username @{username} </button>
                {/if}
            </div>
        </form>
    </UserDataCheck>
</AuthCheck>