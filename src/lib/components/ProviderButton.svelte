<script lang="ts">
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import { writable, type Writable } from 'svelte/store';

    // update loading to be true so that any parent that uses it for state can update when $userData gets filled
    // otherwise just use locally if not passed as prop
    export let loadingStore: Writable<boolean> = writable(false);

    async function signInWithGoogle() {
        // catch if the pop up was closed by the user
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(auth, provider);

            const idToken = await credential.user.getIdToken();

            const res = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
                },
                body: JSON.stringify({ idToken }),
            });

            loadingStore.set(false);
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') {
                // The user closed the popup before finalizing the operation
                console.log('Popup closed by user');
                loadingStore.set(false);
            } else {
                // Other errors
                console.error(err);
            }
        }
    }
</script>

<button
    class="btn btn-success sm:w-96 w-full" 
    on:click={() => {loadingStore.set(true); signInWithGoogle();}}
    disabled={$loadingStore}
>
    <i class="fa-brands fa-google"></i> 
    Sign In With Google
</button>