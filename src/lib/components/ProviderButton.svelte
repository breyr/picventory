<script lang="ts">
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        // automatically gets updated with onAuthStateChane in user store
        await signInWithRedirect(auth, provider);
    }
</script>

<button class="btn btn-success" on:click={signInWithGoogle}>
    <i class="fa-brands fa-google"></i> 
    Sign In With Google
</button>