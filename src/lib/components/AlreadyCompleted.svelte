<script lang="ts">
    import { goto } from '$app/navigation';
    import { userData } from '$lib/firebase';

    export let message: string = "You've already completed this registration step!";
</script>


<div class="text-center">
    <span class="text-neutral">|</span>
    <p>{ message }</p>
    <span class="text-neutral">|</span>
    <br>
    <button class="btn btn-primary mt-5" on:click={async () => await goto(`/${$userData?.username}/items`)}>
        go to items <i class="fa-solid fa-arrow-right"></i>
    </button>
</div>

