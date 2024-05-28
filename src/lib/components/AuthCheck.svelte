<script lang="ts">
    import { user } from "$lib/firebase";
</script>

{#if $user}
<slot />
{:else}
<div class="flex flex-col">
    <p class="text-center">You must be registered and logged in to access this page</p>
    <a href="/login" class="btn btn-primary my-3">Login</a>
    <a href="/register" class="btn btn-neutral">Create Account</a>
</div>
{/if}