<script lang="ts">
    import Job from './components/job.svelte';
    import Io from './assets/io.jpg';
    import { cursor } from '$lib/state.svelte';
    import { onMount } from 'svelte';

    type TiltElement = HTMLDivElement & {
    vanillaTilt?: {
        destroy: () => void;
    };
};

let card: TiltElement;
    let about: HTMLDivElement;
    let visible = $state(false);

    function setCursor(active: boolean) {
        cursor.size = active ? 20 : 8;
        cursor.color = active
            ? 'rgba(115, 88, 252, 0.8)'
            : 'rgba(255, 255, 255, 0.7)';
    }

    // Intersection Observer
    onMount(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
            },
            {
                threshold: 0.2
            }
        );

        observer.observe(about);

        return () => observer.disconnect();
    });

    // VanillaTilt
    onMount(() => {
    let cancelled = false;
    let mediaQuery: MediaQueryList;

    const initTilt = async () => {
        mediaQuery = window.matchMedia(
            '(hover: hover) and (pointer: fine)'
        );

        // MOBILE / TOUCH DEVICE
        if (!mediaQuery.matches) {
            return;
        }

        const { default: VanillaTilt } = await import('vanilla-tilt');

        if (cancelled || !card) return;

        // Prevent duplicate initialization
        card.vanillaTilt?.destroy();

        VanillaTilt.init(card, {
            max: 8,
            speed: 3000,
            perspective: 1000,
            transition: true,
            scale: 1.03,
            glare: true,
            reverse: false,
            'max-glare': 0.2,
            reset: false,
            startX: 12,
            startY: 5
        });
    };

    initTilt();

    return () => {
        cancelled = true;

        // Always destroy VanillaTilt when component is removed
        card?.vanillaTilt?.destroy();
    };
});
</script>

<section id="about">

    <div class="about" bind:this={about}>

        <!-- WORK EXPERIENCE -->
        <div>
            <h1>WORK EXPERIENCE</h1>

            <Job
                anno="2024 - 2025"
                lavoro="D'E.M. International Venice Art Gallery"
                descrizione="Graphic Designer at local Art Gallery. Production of brochure, invites, roll up, labels and everything that is displayed in exhibitions"
                href="https://www.exibart.com/museo-galleria-arte/de-m-venice-art-gallery/"
                active="job"
            />

            <Job
                anno="2025"
                lavoro="Winofsk s.r.l"
                descrizione="Graphic Designer at local Art Dealership. Production of invites, catalogs for artists, labels"
                href="https://www.winofsk.com/"
                active="job"
            />

            <Job
                anno="2025 - TODAY"
                lavoro="Emvisia / Henoto S.P.A."
                descrizione="Graphic Designer and Print Operator, pre-press file layout. Production on industrial printers"
                href="https://www.henoto.com/"
                active="job-active"
            />
        </div>

        <!-- ME & MYSELF -->
        <div>
            <h1>ME & MYSELF</h1>

            <div
                class="card-wrapper"
                class:card-visible={visible}
            >
                <div
                    class="user-card"
                    bind:this={card}
                    role="presentation"
                    data-tilt
                    data-tilt-max="8"
                    data-tilt-speed="3000"
                    data-tilt-perspective="1000"
                    data-tilt-transition="true"
                    data-tilt-scale="1.03"
                    data-tilt-glare="true"
                    data-tilt-reverse="false"
                    data-tilt-max-glare="0.2"
                    data-tilt-reset="false"
                    data-tilt-startX="12"
                    data-tilt-startY="5"
                    onmouseenter={() => setCursor(true)}
                    onmouseleave={() => setCursor(false)}
                    onfocus={() => setCursor(true)}
                    onblur={() => setCursor(false)}
                >
                    <img
                        src={Io}
                        alt="io"
                        loading="lazy"
                        decoding="async"
                    />

                    <p>
                        Graduated from Michelangelo Guggenheim's Art School
                        (2018 - 2023)
                    </p>

                    <p>
                        Love coding, graphic design, music.<br />
                        I play in a
                        <a
                            href="https://nomorecho.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onmouseenter={() => setCursor(true)}
                            onmouseleave={() => setCursor(false)}
                        >
                            band!
                        </a>
                    </p>

                    <div>
                        <a
                            class="button"
                            href="/assets/Curriculum.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onmouseenter={() => setCursor(true)}
                            onmouseleave={() => setCursor(false)}
                        >
                            CURRICULUM
                        </a>

                        <a
                            class="button"
                            href="https://drive.google.com/file/d/1nrTgpdwTIjI2ywoTlYrzBeXJNUphGwae/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            onmouseenter={() => setCursor(true)}
                            onmouseleave={() => setCursor(false)}
                        >
                            PORTFOLIO
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

<style>
    section {
        width: 100%;
        min-height: 100dvh;
        background-color: #151515;
        background-image: url('$lib/assets/header.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        padding: 2rem;

        display: flex;
        align-items: center;

        z-index: 1;
        box-sizing: border-box;
    }

    .about {
    width: 100%;
    display: grid;
    grid-template-columns: 60% 40%;
    gap: 4rem;
    align-items: start;
}

    .about > div {
        display: flex;

        padding: 2rem;

        color: white;

        flex-direction: column;
        justify-content: center;
        align-items: center;

        gap: 4rem;
    }

    .about h1 {
        font-family: "Climate Crisis", sans-serif;

        font-size: 400%;
        font-weight: 1000;

        text-shadow:
            -2px -2px 0 var(--purple),
             2px -2px 0 var(--purple),
            -2px  2px 0 var(--purple),
             2px  2px 0 var(--purple);

        margin-bottom: 2rem;

        width: 100%;
        text-align: center;
    }

    .card-wrapper {
        width: 70%;
        height: 80%;

        transform: scale(0.2);
        transition: 0.7s ease;

        opacity: 0;

        z-index: 4;
    }

    .card-visible {
        transform: scale(1);
        opacity: 1;
    }

    .user-card {
        padding: 2rem;

        border-radius: 5rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background:
            linear-gradient(
                20deg,
                rgb(22, 22, 22),
                rgb(42, 42, 42),
                rgb(30, 30, 30)
            ) padding-box,

            linear-gradient(
                30deg,
                rgb(80, 80, 80),
                white,
                rgb(80, 80, 80)
            ) border-box;

        border: 3px solid transparent;

        box-shadow:
            10px 10px 10px 5px rgba(0, 0, 0, 0.6);

        transform-style: preserve-3d;
        transform: perspective(1000px);

        position: relative;

        overflow: hidden;

        will-change: transform;
        backface-visibility: hidden;

        z-index: 5;
    }

    /* ORIGINAL SHINE */

    .user-card::before {
        content: '';

        position: absolute;

        height: 300%;
        width: 300px;

        top: 0;
        left: -300px;

        background:
            linear-gradient(
                90deg,
                transparent,
                rgba(246, 246, 246, 0.2),
                transparent
            );

        transform: rotate(45deg) translateY(-35%);

        z-index: 999;

        opacity: 0;

        pointer-events: none;

        animation: shine 2.5s ease infinite;
        animation-play-state: paused;

        will-change: left;
    }

    .user-card:hover::before {
        opacity: 1;
        animation-play-state: running;
    }

    .user-card img {
        border-radius: 100%;

        width: 50%;
        aspect-ratio: 1 / 1;

        object-fit: cover;
    }

    .user-card p {
        padding: 0.5rem;

        color: white;

        font-family: "Bodoni Moda", serif;

        font-weight: 500;

        text-align: center;

        font-size: 120%;

        margin-top: 1rem;
    }

    .user-card a {
        cursor: none;

        color: var(--purple);

        text-decoration: underline transparent;

        transition: 0.3s ease;

        text-underline-position: 3px;
        text-underline-offset: 3px;
    }

    .user-card a:hover {
        text-decoration: underline var(--purple);
    }

    .user-card > div {
        width: 100%;

        padding: 2rem;

        display: flex;

        gap: 2rem;

        transform: perspective(500px);

        transform-style: preserve-3d;
    }

    .button {
        width: 100%;

        background-color: #ddd;

        border-radius: 5rem;

        padding: 1rem;

        color: black;

        font-family: "Climate Crisis", sans-serif;

        cursor: none;

        transition: 0.3s ease;

        font-weight: 200;

        font-variation-settings: "YEAR" 1990;

        box-shadow:
            5px 5px 10px 5px rgba(0, 0, 0, 0.75);

        text-align: center;
        text-decoration: none;
    }

    .button:hover {
        transform: translateZ(30px);

        color: var(--purple);
    }

    @keyframes shine {
        0% {
            left: -1000px;
        }

        30% {
            left: calc(100% + 20px);
        }

        100% {
            left: calc(100% + 20px);
        }
    }

    /* TABLET */

    @media (max-width: 1000px) {
        section {
            align-items: flex-start;
        }

        .about {
            grid-template-columns: 1fr;
            gap: 3rem;
        }

        .about > div {
            padding: 1rem;
        }

        .card-wrapper {
            width: min(60%, 600px);
        }

        .about > div:first-child {
            order: 2;
            gap: 3rem;
        }
        .about > div:last-child {
            order: 1;
        }
    }

    /* MOBILE */

    @media (max-width: 600px) {
        section {
            min-height: auto;
            padding: 3rem 1rem;
        }

        .about {
            grid-template-columns: 1fr;
            gap: 3rem;
        }

        .about > div {
            padding: 0;
            gap: 1.5rem;
        }

        .about > div:first-child {
            order: 2;
            gap: 3rem;
        }
        .about > div:last-child {
            order: 1;
        }

        .about h1 {
            font-size: 200%;
            margin-bottom: 1rem;
        }

        /*
         * Keep the card visually the same,
         * but allow it to fit the phone.
         */
        .card-wrapper {
            width: min(70%, 520px);
            height: auto;
        }

        .user-card {
            padding: 1.5rem;
            border-radius: 3rem;
        }

        .user-card img {
            width: 50%;
        }

        .user-card p {
            font-size: 100%;
        }

        .user-card > div {
            padding: 1rem 0;
            gap: 1rem;
        }

        .button {
            padding: 0.9rem 0.5rem;
            font-size: 0.85rem;
        }

        /*
         * VanillaTilt is already disabled on touch devices,
         * so don't waste resources running the shine animation.
         */
        .user-card::before {
            display: none;
        }

        .user-card a {
            cursor: pointer;
        }
    }

    /* VERY SMALL PHONES */

    @media (max-width: 400px) {
        .user-card {
            padding: 1.25rem;
            border-radius: 2.5rem;
        }

        .user-card img {
            width: 55%;
        }

        .user-card p {
            font-size: 95%;
        }

        .user-card > div {
            flex-direction: column;
        }

        .button {
            width: 100%;
        }
    }

    /* ACCESSIBILITY */

    @media (prefers-reduced-motion: reduce) {
        .card-wrapper {
            transition: none;
        }

        .user-card::before {
            animation: none;
            display: none;
        }

        .button,
        .user-card a {
            transition: none;
        }
    }
</style>