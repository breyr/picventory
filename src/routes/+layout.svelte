<script lang="ts">
	import { user, userData } from "$lib/firebase";
	import "../app.css";

	// global accessing
	$user;
	$userData;
</script>

<main class="flex min-h-dvh">
	<slot />
</main>
