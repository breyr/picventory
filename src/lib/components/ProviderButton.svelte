<script lang="ts">
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, getRedirectResult, signInWithRedirect } from 'firebase/auth';
    import { onMount } from 'svelte';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        // automatically updates user store when onAuthStateChange
        await signInWithRedirect(auth, provider);
    }

    onMount(async () => {
        const credential = await getRedirectResult(auth);
        const idToken = await credential?.user.getIdToken();
        // have to check because onMount will happen without a redirect at first
        if (idToken) {
            const res = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
                },
                body: JSON.stringify({ idToken }),
            });
        }
    });
</script>

<button class="btn btn-success" on:click={signInWithGoogle}>
    <i class="fa-brands fa-google"></i> 
    Sign In With Google
</button>