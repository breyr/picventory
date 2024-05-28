<script lang="ts">
	import { user } from "$lib/firebase";
	import "../app.css";

	// global accessing
	$user;
</script>

<main class="flex min-h-dvh">
	<slot />
</main>
