<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import type { UserItem } from '$lib/customtypes';
    import { userData, userItems } from '$lib/firebase';

    let items: { id: string, data: UserItem }[] | null;
    $: {
        items = $userItems;
    }
</script>

<AuthCheck>
    <main class="flex-1 px-5">
        <label class="input input-bordered flex items-center gap-2 mb-5">
            <input type="text" class="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
        </label>
        {#if items}
            {#each items as item (item.id)}
                <div class="card bg-base-200 shadow-xl mb-3">
                    <figure><img src={item.data.photoURL} alt="photoURL" /></figure>
                    <div class="card-body">
                        <h2 class="card-title">
                        {item.data.name}
                        </h2>
                        <div class="card-actions justify-between">
                            <div>
                                {#each item.data.tags as tag}
                                    <div class="badge badge-primary font-bold"># {tag}</div> 
                                {/each}
                            </div>
                            <div>
                                <a href={`/${$userData?.username}/items/${item.id}/edit`}><i class="fa-solid fa-pen-to-square mr-4"></i></a>
                                <button><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </main>
</AuthCheck>
