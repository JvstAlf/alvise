<script lang="ts">
    let {
        anno,
        lavoro,
        descrizione,
        href,
        active
    } = $props();

    let jobclass = $state('job')

    let opacity = $state(0)

    function shinebrightlikeadiamond(value: number) {
        opacity = value
    }

    import { cursor } from '$lib/state.svelte'
    import { onMount } from 'svelte';

    let el: HTMLDivElement;
    let visible = $state(false);

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visible = true;
                } else {
                    visible = false
                }
            });
        }, { 
            threshold: 1,
        });
        

        observer.observe(el);
    });
</script>

<div
    class={active}
    class:visible
    bind:this={el}
    style="--opacity: {opacity}"
    onmouseover={() => shinebrightlikeadiamond(100)}
    onmouseleave={() => shinebrightlikeadiamond(0)}
>
    <p>{anno}</p>
    <a href={href} target="_blank" onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>{lavoro}</a>
    <p>{descrizione}</p>
</div>

<style>
    .job {
        opacity: 0;
        transform: translateX(-40px);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.4s ease, scale 0.4s ease;
        padding: 2rem;
        border-radius: 2rem;
        background: linear-gradient(90deg, rgb(26, 26, 26), rgb(42, 42, 42), rgb(36, 36, 36)) padding-box,
        linear-gradient(30deg, rgb(80, 80, 80), white, rgb(80, 80, 80)) border-box;
        border: 2px solid transparent;
        z-index: 10;
        color: white;
        box-shadow: 0 0 7px 5px rgba(255, 255, 255, 0), inset 0 0 20px 5px rgba(255, 255, 255, 0.2);
        overflow: hidden;
        position: relative;
        box-shadow: 10px 10px 10px 5px rgba(0, 0, 0, 0.6);
        width: 100%;
    }

    .job-active {
        opacity: 0;
        transform: translateX(-40px);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.4s ease, scale 0.4s ease;
        padding: 2rem;
        border-radius: 2rem;
        background-color: rgb(220, 220, 220);
        z-index: 10;
        color: black;
        overflow: hidden;
        position: relative;
        box-shadow: 10px 10px 10px 5px rgba(0, 0, 0, 0.6);
        width: 100%;
    }

    .job.visible, .job-active.visible {
        opacity: 1;
        transform: translateX(0);
    }

    .job::before {
        content: '';
        position: absolute;
        height: 300%;
        width: 200px;
        top: 0;
        left: -60px;
        background: linear-gradient(90deg, transparent, rgba(246, 246, 246, 0.3), transparent);
        transform: rotate(45deg) translateY(-35%);
        animation: shine 2.25s ease infinite;
        z-index: 999;
        opacity: var(--opacity);
    }

    @keyframes shine {
        0% { left: -2000px; }
        30% { left: calc(100% + 20px); }
        100% { left: calc(100% + 20px); }
    }

    .job:hover {
        box-shadow: 0 0 7px 5px rgba(255, 255, 255, 0.2), inset 0 0 20px 5px rgba(255, 255, 255, 0.2);
        background: linear-gradient(90deg, rgb(26, 26, 26), rgb(42, 42, 42), rgb(36, 36, 36)) padding-box,
        linear-gradient(30deg, rgb(121, 121, 121), white, rgb(121, 121, 121)) border-box;
        scale: 1.02;
    }

    .job-active:hover {
        scale: 1.02;
        box-shadow: 0 0 7px 5px rgba(255, 255, 255, 0.2), inset 0 0 25px 7px rgba(255, 255, 255, 0.2);
    }

    .job p:first-child, .job-active p:first-child {
        font-family: "Bodoni Moda", serif;
        font-size: 120%;
        font-weight: 600;
        letter-spacing: 2px;
    }

    .job-active p:first-child, .job-active p:last-child {
        font-weight: 800 !important;
    }

    .job a, .job-active a {
        font-size: 1.5rem;
        font-family: "Climate Crisis", sans-serif;
        font-variation-settings: "YEAR" 2000;
        color: var(--purple);
        text-decoration: underline white;
        text-underline-offset: 10px;
        cursor: none;
        transition: 0.3s;
    }

    .job-active a {
        text-decoration: underline black !important;
    }

    .job a:hover {
        color: white;
    }

    .job-active a:hover {
        color: black;
    }

    .job a::selection, .job-active a::selection {
        color: white;
    }

    .job p:last-child, .job-active p:last-child {
        margin: 1rem 0;
        font-family: "Bodoni Moda", serif;
        font-size: 120%;
        font-weight: 600;
    }
</style>