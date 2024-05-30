<script lang="ts">

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import NotificationToast from "$lib/components/NotificationToast.svelte";
    import { auth, userData } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { fly } from "svelte/transition";

    async function signOutSSR() {
        const res = await fetch("/api/signin", { method: "DELETE" })
        await signOut(auth);
    }
</script>


<!-- nav bar -->
<main class="flex-1" in:fly={{ x: "100%", duration: 300 }}>
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </div>
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-1 z-[1] p-2 shadow rounded-box w-52 bg-base-200">
                    <li>
                        <button class="btn mb-3" on:click={() => goto(`/${$userData?.username}/items`)}>My items</button>
                    </li>
                    <li>
                        <button class="btn mb-3" on:click={() => goto(`/${$userData?.username}/tags`)}>My tags</button>
                    </li>
                    <li>
                        <button class="btn btn-primary" on:click={async () => {await signOutSSR(); goto("/")}}>sign out</button>
                    </li>
                </ul>
            </div>
        </div>
        <p class="font-bold capitalize text-sm">{$page.route.id?.split("/").slice(-1)[0]}</p>
        <div class="navbar-end mr-3">
            @{$userData?.username}
        </div>
    </div>
    <slot />
    <NotificationToast />
</main>