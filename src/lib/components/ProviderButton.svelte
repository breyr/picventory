<script lang="ts">
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

    async function signInWithGoogle() {
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
    }
</script>

<button class="btn btn-success" on:click={signInWithGoogle}>
    <i class="fa-brands fa-google"></i> 
    Sign In With Google
</button>