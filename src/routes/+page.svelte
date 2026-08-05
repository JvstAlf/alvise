<script lang="ts">
    import Cursor from '$lib/cursor.svelte';
    import Header from '$lib/header.svelte';
    import About from '$lib/about.svelte';
    import Projects from '$lib/projects.svelte';
    import { onMount } from 'svelte';

let check = $state(false);

function mobileCheck() {
    check = window.innerHeight > window.innerWidth;
}

onMount(() => {
    mobileCheck();

    window.addEventListener('resize', mobileCheck);

    return () => {
        window.removeEventListener('resize', mobileCheck);
    };
});
</script>

{#if !check}
    <Cursor />
{/if}
<Header />
<About />
<Projects />