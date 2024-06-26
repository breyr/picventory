<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
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
            tags: [],
            registrationComplete: false
        });

        await batch.commit();

        username = '';
        isAvailable = false;
    }
</script>

<AuthCheck>
    <h2 class="text-3xl text-center font-bold mb-3">Select Username</h2>
        {#if $userData?.username}
            <div class="text-center">
                <p>
                    Your username is <span class="text-blue-400 font-semibold">@{$userData.username}</span>
                </p>
                <p class="italic">(usernames cannot be changed)</p>
                <a class="btn btn-neutral my-3 w-full sm:w-96" href="/register/tags">continue <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        {:else}
            <form class="text-center" on:submit|preventDefault={confirmUsername}>
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
                <div class="my-4 min-h-16 text-center w-full">
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
                        <div class="text-center">
                            <button class="btn btn-success">Confirm username @{username} </button>
                        </div>
                    {/if}
                </div>
            </form>
        {/if}
</AuthCheck>