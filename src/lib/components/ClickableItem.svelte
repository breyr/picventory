<script lang="ts">
    import type { UserItem } from '$lib/customtypes';
    import { userData } from '$lib/firebase';
    import { onMount } from 'svelte';

    export let item: { id: string; data: UserItem};

    let itemContainer: HTMLAnchorElement; // outermost wrapper for item
    let blurredImg: HTMLImageElement;
    let img: HTMLImageElement;
    let imgLoaded = false; // used to add fading on img load

    // intersection observer options
    const ioOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.25,
    }

    const imgSrc = item.data.photoURL;

    const loadImages = () => {
        // need to set src for blurredImg and img
        blurredImg.src = imgSrc;
        img.src = imgSrc;
        img.onload = () => imgLoaded = true;
    }

    onMount(() => {
        // create intersection observer
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // load image and unobserve because the item is now halfway intersecting with viewport based on options threshold
                    loadImages();
                    observer.unobserve(entry.target);
                }
            })
        }, ioOptions)

        // if we have an item container, then we want to observe it
        if (itemContainer) {
            observer.observe(itemContainer);
        }
    })
</script>

<style>
    .blur {
        backdrop-filter: blur(5px);
    }

    .fade-in {
        opacity: 0;
        transition: opacity 0.5s ease-in;
    }

    .fade-in.loaded {
        opacity: 1;
    }

    .placeholder {
        z-index: 1000;
        width: 100%;
        height: 100%;
    }
</style>

<a href={`/${$userData?.username}/items/edit/${item.id}`} bind:this={itemContainer}>
    <div class="card bg-base-200 shadow-xl mb-3 transform transition-all duration-200 hover:scale-105 sm:w-96 sm:h-96 w-80">
        <figure class="h-48 w-full relative">
            <img alt="" class="absolute inset-0 w-full h-full object-cover blur" bind:this={blurredImg} />
            <img alt="" class="w-3/4 h-3/4 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fade-in" bind:this={img} class:loaded={imgLoaded} />
            {#if !imgLoaded}
                <div class="placeholder skeleton"></div>
            {/if}
        </figure>
        <div class="card-body">
            <h2 class="card-title">
            {item.data.name}
            </h2>
            <span>{item.data.description}</span>
            <div class="card-actions justify-between">
                <div>
                    {#each item.data.tags as tag}
                        <div class="badge badge-primary font-bold"># {tag}</div> 
                    {/each}
                </div>
            </div>
        </div>
    </div>
</a>
