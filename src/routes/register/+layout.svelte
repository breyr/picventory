<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AnimatedRoute from '$lib/components/AnimatedRoute.svelte';
	import { notification } from '$lib/customStores';
	import { user, userData } from '$lib/firebase';

    // if a signed in and registered user trys to access any pages in this route, redirect to their items
    $: if($user && $userData?.registrationComplete ) {
        // if they are on the tags page then I don't need to send the notification
        if (!$page.route.id?.includes("tags")) {
            notification.set('You completed registration already.');
        }
        goto(`/${$userData?.username}/items`);
    }
</script>

<main class="flex-1 flex flex-col justify-between p-10">
    <AnimatedRoute>
        <slot />
    </AnimatedRoute>
    <ul class="steps sm:w-96 w-full sm:mx-auto">
        <a href="/register" class="step step-primary">Register</a>
        <a href="/register/username" class="step step-primary" class:step-primary={$page.route.id?.match(/username|tags/g)}>Choose Username</a>
        <a href="/register/tags" class="step" class:step-primary={$page.route.id?.includes("tags")}>Select Tags</a>
    </ul>
</main>