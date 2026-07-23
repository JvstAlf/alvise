<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';
	import "../app.css";

	let { children } = $props();

	onMount(() => {
	if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
	
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	
    if (window.location.hash && document.getElementById(window.location.hash.substring(1))) {
    history.replaceState('', document.title, window.location.pathname);
  }
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>alvise</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Climate+Crisis:YEAR@1980&display=swap" rel="stylesheet">
</svelte:head>

{@render children()}
