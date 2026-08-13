<script lang="ts">
    import { onMount } from 'svelte';
    import { cursor } from '$lib/state.svelte';

    let {
        anno,
        lavoro,
        descrizione,
        href,
        active
    } = $props<{
        anno: string;
        lavoro: string;
        descrizione: string;
        href: string;
        active: 'job' | 'job-active';
    }>();

    let el: HTMLDivElement;
    let visible = $state(false);

    function setCursor(active: boolean) {
        cursor.size = active ? 20 : 8;
        cursor.color = active
            ? 'rgba(115, 88, 252, 0.8)'
            : 'rgba(255, 255, 255, 0.7)';
    }

    onMount(() => { 
        const observer = new IntersectionObserver((entries) => 
        { entries.forEach(entry => 
        { if (entry.isIntersecting) 
        { visible = true; } else 
        { visible = false } }); }, 
        { threshold: 0.8, }); 
        observer.observe(el); });
</script>

<div
    class={active}
    class:visible
    bind:this={el}
    role="presentation"
    onmouseenter={() => setCursor(true)}
    onmouseleave={() => setCursor(false)}
>
    <p>{anno}</p>

    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
    >
        {lavoro}
    </a>

    <p>{descrizione}</p>
</div>

<style>
    /*
     * BASE JOB
     */

    .job,
    .job-active {
        position: relative;

        width: 100%;
        box-sizing: border-box;

        padding: 2rem;
        border-radius: 2rem;

        overflow: hidden;

        z-index: 10;

        transition:
            opacity 0.6s ease,
            transform 0.6s ease,
            box-shadow 0.4s ease;

        will-change: transform, opacity;
    }

    /*
     * NORMAL JOB
     */

    .job {
        opacity: 0;

        transform: translate3d(-40px, 0, 0);

        color: white;

        background:
            linear-gradient(
                90deg,
                rgb(26, 26, 26),
                rgb(42, 42, 42),
                rgb(36, 36, 36)
            ) padding-box,

            linear-gradient(
                30deg,
                rgb(80, 80, 80),
                white,
                rgb(80, 80, 80)
            ) border-box;

        border: 2px solid transparent;

        box-shadow:
            10px 10px 10px 5px rgba(0, 0, 0, 0.6);
    }

    /*
     * ACTIVE JOB
     */

    .job-active {
        opacity: 0;

        transform: translate3d(-40px, 0, 0);

        color: black;

        background-color: rgb(210, 210, 210);

        box-shadow:
            10px 10px 10px 5px rgba(0, 0, 0, 0.6);
    }

    /*
     * APPEAR ANIMATION
     */

    .job.visible,
    .job-active.visible {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }

    /*
     * SHINE
     *
     * Kept visually similar to your original.
     */

    .job::before,
    .job-active::before {
        content: '';

        position: absolute;

        width: 200px;
        height: 300%;

        top: 0;
        left: -200px;

        background:
            linear-gradient(
                90deg,
                transparent,
                rgba(246, 246, 246, 0.3),
                transparent
            );

        transform: rotate(45deg) translateY(-35%);

        animation: shine 2.25s ease infinite;
        animation-play-state: paused;

        z-index: 999;

        opacity: 0;

        pointer-events: none;

        will-change: left;
    }

    .job:hover::before,
    .job-active:hover::before {
        opacity: 1;
        animation-play-state: running;
    }

    @keyframes shine {
        0% {
            left: -2000px;
        }

        30% {
            left: calc(100% + 20px);
        }

        100% {
            left: calc(100% + 20px);
        }
    }

    /*
     * HOVER
     */

    .job:hover {
        transform: translate3d(0, 0, 0) scale(1.02);

        box-shadow:
            0 0 7px 5px rgba(255, 255, 255, 0.2),
            inset 0 0 20px 5px rgba(255, 255, 255, 0.2);

        background:
            linear-gradient(
                90deg,
                rgb(26, 26, 26),
                rgb(42, 42, 42),
                rgb(36, 36, 36)
            ) padding-box,

            linear-gradient(
                30deg,
                rgb(121, 121, 121),
                white,
                rgb(121, 121, 121)
            ) border-box;
    }

    .job-active:hover {
        transform: translate3d(0, 0, 0) scale(1.02);

        box-shadow:
            0 0 7px 5px rgba(255, 255, 255, 0.2),
            inset 0 0 25px 7px rgba(255, 255, 255, 0.2);
    }

    /*
     * TEXT
     */

    .job p,
    .job-active p {
        overflow-wrap: anywhere;
    }

    .job p:first-child,
    .job-active p:first-child {
        margin: 0;

        font-family: "Bodoni Moda", serif;

        font-size: 120%;
        font-weight: 600;

        letter-spacing: 2px;
    }

    .job-active p:first-child,
    .job-active p:last-child {
        font-weight: 800 !important;
    }

    /*
     * COMPANY / JOB TITLE
     */

    .job a,
    .job-active a {
        display: inline-block;

        max-width: 100%;

        margin-top: 0.5rem;

        font-family: "Climate Crisis", sans-serif;

        font-size: 1.5rem;
        line-height: 1.15;

        font-variation-settings: "YEAR" 2000;

        color: var(--purple);

        text-decoration: underline white;
        text-underline-offset: 10px;

        cursor: none;

        transition:
            color 0.3s ease;
    }

    .job-active a {
        text-decoration-color: black;
    }

    .job a:hover {
        color: white;
    }

    .job-active a:hover {
        color: black;
    }

    /*
     * DESCRIPTION
     */

    .job p:last-child,
    .job-active p:last-child {
        margin: 1rem 0;

        font-family: "Bodoni Moda", serif;

        font-size: 120%;
        font-weight: 600;

        line-height: 1.4;
    }

    /*
     * TABLET
     */

    @media (max-width: 1000px) {
        .job,
        .job-active {
            padding: 1.75rem;
        }

        .job a,
        .job-active a {
            font-size: clamp(1.25rem, 3vw, 1.5rem);
        }

        .job p:first-child,
        .job-active p:first-child,
        .job p:last-child,
        .job-active p:last-child {
            font-size: 110%;
        }
    }

    /*
     * MOBILE
     */

    @media (max-width: 600px) {
        .job,
        .job-active {
            width: 100%;

            padding: 1.25rem;

            border-radius: 1.5rem;

            /*
             * Remove the large desktop shadow.
             * It looks almost identical on mobile
             * but costs more paint.
             */
            box-shadow:
                5px 5px 8px 3px rgba(0, 0, 0, 0.5);

            /*
             * Don't let the animation start
             * with the card far outside the viewport.
             */
            transform: translate3d(-20px, 0, 0);
        }

        .job.visible,
        .job-active.visible {
            transform: translate3d(0, 0, 0);
        }

        /*
         * Prevent mobile hover scaling from making
         * the card overflow horizontally.
         */
        .job:hover,
        .job-active:hover {
            transform: translate3d(0, 0, 0);
        }

        .job p:first-child,
        .job-active p:first-child {
            font-size: 0.9rem;
            letter-spacing: 1px;
        }

        .job a,
        .job-active a {
            font-size: clamp(1.15rem, 6vw, 1.5rem);

            line-height: 1.5;

            text-underline-offset: 3px;

            cursor: pointer;
        }

        .job p:last-child,
        .job-active p:last-child {
            margin: 0.8rem 0 0;

            font-size: 0.95rem;

            line-height: 1.45;
        }

        /*
         * Shine is unnecessary on touch screens.
         */
        .job::before,
        .job-active::before {
            display: none;
        }
    }

    /*
     * VERY SMALL PHONES
     */

    @media (max-width: 400px) {
        .job,
        .job-active {
            padding: 1rem;

            border-radius: 1.25rem;
        }

        .job p:first-child,
        .job-active p:first-child {
            font-size: 0.8rem;
        }

        .job a,
        .job-active a {
            font-size: 1.1rem;
        }

        .job p:last-child,
        .job-active p:last-child {
            font-size: 0.9rem;
        }
    }

    /*
     * REDUCE MOTION
     */

    @media (prefers-reduced-motion: reduce) {
        .job,
        .job-active {
            transition: opacity 0.2s ease;
            transform: none;
        }

        .job.visible,
        .job-active.visible {
            transform: none;
        }

        .job::before,
        .job-active::before {
            display: none;
            animation: none;
        }
    }
</style>