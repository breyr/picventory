<script lang="ts">
    import { page } from '$app/stores';
    import AnimatedRoute from '$lib/components/AnimatedRoute.svelte';
</script>

<main class="flex-1 flex flex-col justify-between p-10">
    <AnimatedRoute>
        <slot />
    </AnimatedRoute>
    <ul class="steps">
        <a href="/register" class="step step-primary">Register</a>
        <a href="/register/username" class="step step-primary" class:step-primary={$page.route.id?.match(/username|tags/g)}>Select Username</a>
        <a href="/register/tags" class="step" class:step-primary={$page.route.id?.includes("tags")}>Select first tags</a>
    </ul>
</main>