<script lang="ts">
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        // automatically gets updated with onAuthStateChane in user store
        await signInWithPopup(auth, provider);
    }
</script>

<button class="btn btn-primary" on:click={signInWithGoogle}><i class="fa-brands fa-google"></i> Sign In</button>

