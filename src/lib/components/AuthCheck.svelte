<script lang="ts">
    import { user } from "$lib/firebase";
</script>

{#if $user}
<slot />
{:else}
<div class="flex flex-col px-5">
    <p class="text-center">You must be registered and logged in to access this page</p>
    <a href="/" class="btn btn-primary my-3 sm:w-96 w-full sm:mx-auto">Login</a>
    <a href="/register" class="btn btn-neutral sm:w-96 w-full sm:mx-auto">Create Account</a>
</div>
{/if}