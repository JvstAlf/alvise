<script lang="ts">
    import share from '$lib/assets/share.svg';
    import { cursor } from './state.svelte';
    import { onMount } from 'svelte';

    const projects = [
        {
            name: 'Old Portfolio',
            url: 'https://old.alvise.me'
        },
        {
            name: 'Really old Portfolio',
            url: 'https://veryold.alvise.me'
        },
        {
            name: 'Off-White Project',
            url: 'https://off-white.alvise.me'
        },
        {
            name: 'Svelte Project',
            url: 'https://demonlist.alvise.me'
        }
    ] as const;

    let iframe = $state('');
    let activeProject = $state<number | null>(null);

    let el: HTMLDivElement;
    let wrapper: HTMLDivElement;

    let progress = $state(0);
    let visible = $state(false);

    let isDesktop = false;

    function setCursor(active: boolean) {
        if (!isDesktop) return;

        cursor.size = active ? 20 : 8;
        cursor.color = active
            ? 'rgba(115, 88, 252, 0.8)'
            : 'rgba(255, 255, 255, 0.7)';
    }

    function selectProject(index: number) {
        const project = projects[index];

        activeProject = index;

        /*
         * On mobile, don't load an iframe.
         * Go directly to the project instead.
         */
        if (!isDesktop) {
            window.location.href = project.url;
            return;
        }

        /*
         * Desktop keeps the original iframe behavior.
         */
        iframe = project.url;
    }

    function updateProgress() {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const start = viewportHeight;
        const end = viewportHeight * 0.3;

        const nextProgress =
            1 - (rect.top - end) / (start - end);

        progress = Math.max(
            0,
            Math.min(1, nextProgress)
        );
    }

    onMount(() => {
        const mediaQuery = window.matchMedia(
            '(hover: hover) and (pointer: fine)'
        );

        isDesktop = mediaQuery.matches;

        /*
         * Intersection Observer
         */
        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
            },
            {
                threshold: 1
            }
        );

        if (wrapper) {
            observer.observe(wrapper);
        }

        /*
         * Don't run the scroll animation on mobile.
         */
        if (!isDesktop) {
            return () => {
                observer.disconnect();
            };
        }

        /*
         * Throttle scroll calculations with RAF.
         * This prevents updateProgress() from running
         * dozens of times per frame.
         */
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;

            ticking = true;

            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
        };

        updateProgress();

        window.addEventListener(
            'scroll',
            handleScroll,
            { passive: true }
        );

        return () => {
            observer.disconnect();

            window.removeEventListener(
                'scroll',
                handleScroll
            );
        };
    });
</script>

<section id="projects">

    <!-- Decorative background -->
    <div class="bg1"></div>
    <div class="bg2"></div>

    <div class="header">
        <h1>PROJECTS</h1>
    </div>

    <div class="content">

        <!-- PROJECT BUTTONS -->
        <div
            class="wrapper"
            bind:this={wrapper}
        >
            <div
                class="websites"
                class:websites-visible={visible}
            >
                {#each projects as project, index}
                    <a
                        class="buttons"
                        class:active={activeProject === index}
                        href={project.url} target="_blank"
                        onclick={(event) => {
                            if (isDesktop) {
                                event.preventDefault();
                                selectProject(index);
                            }
                        }}
                        onmouseenter={() => setCursor(true)}
                        onmouseleave={() => setCursor(false)}
                    >
                        {project.name}

                        <img
                            src={share}
                            alt=""
                            aria-hidden="true"
                        />
                    </a>
                {/each}
            </div>
        </div>

        <!-- DESKTOP SHOWCASE -->
        <div class="showcase">
            <div
                class="container"
                style:transform={`translate3d(${(1 - progress) * 100}%, 0, 0)`}
                bind:this={el}
            >
                <div class="circle-container">

                    <div class="circle red"></div>
                    <div class="circle orange"></div>
                    <div class="circle green"></div>

                    <p
                        role="presentation"
                        id="project-url"
                    >
                        {iframe || 'alvise.me'}
                    </p>
                </div>

                <div class="iframe">
                    {#if iframe}
                        <iframe
                            src={iframe}
                            title="Selected project"
                            loading="lazy"
                            referrerpolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    {/if}
                </div>
            </div>
        </div>

    </div>
</section>

<style>
    section {
        width: 100%;
        min-height: 100dvh;

        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        position: relative;
        isolation: isolate;

        background-color: #151515;

        background-image:
            url('$lib/assets/header.png');

        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    /*
     * HEADER
     */

    .header {
        width: 100%;
        flex-shrink: 0;
    }

    h1 {
        width: 100%;

        box-sizing: border-box;

        padding: 2rem 1rem;

        margin: 0;

        color: white;

        font-family: "Climate Crisis", sans-serif;
        font-size: clamp(3rem, 8vw, 5rem);
        font-weight: 1000;

        text-align: center;

        text-shadow:
            -2px -2px 0 var(--purple),
             2px -2px 0 var(--purple),
            -2px  2px 0 var(--purple),
             2px  2px 0 var(--purple);

        text-decoration: underline;
        text-underline-offset: 12px;
    }

    /*
     * CONTENT
     */

    .content {
        position: relative;
        z-index: 1;

        width: 100%;

        flex: 1;

        min-height: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        flex-direction: row;
    }

    /*
     * PROJECT LIST
     */

    .wrapper {
        position: relative;

        width: 30%;
        height: 100%;

        z-index: 3;

        flex-shrink: 0;
    }

    .websites {
        width: 100%;
        height: 100%;

        box-sizing: border-box;

        padding: 2rem;

        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        gap: 3rem;

        opacity: 0;

        transform: scale(0.2);

        transition:
            opacity 1s ease,
            transform 1s cubic-bezier(
                .17,
                1.04,
                .79,
                1.14
            );

        position: relative;
        z-index: 2;
    }

    .websites-visible {
        opacity: 1;
        transform: scale(1);
    }

    /*
     * PROJECT BUTTON
     */

    .buttons {
        position: relative;

        width: 60%;

        box-sizing: border-box;

        min-height: 4.5rem;

        padding: 1.5rem;

        display: flex;
        justify-content: center;
        align-items: center;

        color: rgba(255, 255, 255, 0.8);

        background:
            linear-gradient(
                #121212,
                #121212
            ) padding-box,

            linear-gradient(
                30deg,
                #454545,
                #aaa,
                #454545
            ) border-box;

        border: 1px solid transparent;

        border-radius: 3rem;

        box-shadow:
            0 0 7px rgba(255, 255, 255, 0.1),
            inset 0 0 7px rgba(255, 255, 255, 0.1),
            0 0 10px 10px rgba(255, 255, 255, 0.02);

        font-family: "Climate Crisis", sans-serif;
        font-variation-settings: "YEAR" 1990;

        font-weight: 500;
        font-size: 120%;

        line-height: 1.5rem;

        text-align: center;
        text-decoration: none;

        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;

        cursor: none;

        transition:
            box-shadow 0.3s ease,
            background 0.3s ease;

        overflow: visible;
    }

    .buttons:hover {
        background:
            linear-gradient(
                #121212,
                #121212
            ) padding-box,

            linear-gradient(
                45deg,
                rgb(71, 71, 71),
                rgb(255, 255, 255),
                rgb(71, 71, 71)
            ) border-box;

        box-shadow:
            0 0 12px rgba(255, 255, 255, 0.35),
            inset 0 0 10px rgba(255, 255, 255, 0.35),
            0 0 12px 12px rgba(255, 255, 255, 0.05);
    }

    .buttons.active {
        background:
            linear-gradient(
                #121212,
                #121212
            ) padding-box,

            linear-gradient(
                30deg,
                #793bff,
                #a981ff,
                #793bff
            ) border-box;

        box-shadow:
            0 0 7px rgba(50, 0, 149, 0.3),
            inset 0 0 7px rgba(50, 0, 149, 0.3),
            0 0 10px 10px rgba(50, 0, 149, 0.3);
    }

    .buttons.active:hover {
        background:
            linear-gradient(
                #121212,
                #121212
            ) padding-box,

            linear-gradient(
                45deg,
                #844bff,
                #c6abff,
                #844bff
            ) border-box;

        box-shadow:
            0 0 12px rgba(111, 53, 228, 0.3),
            inset 0 0 10px rgba(111, 53, 228, 0.3),
            0 0 12px 12px rgba(111, 53, 228, 0.3);
    }

    .buttons img {
        position: absolute;

        right: -15px;

        height: 70%;

        padding: 0.25rem;

        background-color: #151515;

        border: 1px solid #505050;
        border-radius: 10px;

        z-index: 50;

        pointer-events: none;
    }

    /*
     * SHOWCASE
     */

    .showcase {
        width: 70%;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 3rem;

        box-sizing: border-box;

        z-index: 2;

        overflow: hidden;
    }

    .container {
        width: 100%;
        max-width: 1100px;

        aspect-ratio: 16 / 9;

        background-color: #222b33;

        border-radius: 15px;

        box-shadow:
            5px 5px 15px 2px rgba(0, 0, 0, 0.7);

        margin-top: 1vh;

        will-change: transform;
    }

    /*
     * BROWSER HEADER
     */

    .circle-container {
        position: relative;

        width: 100%;

        padding: 0 1rem;

        margin-top: 0.5rem;
        margin-bottom: 0.2rem;

        box-sizing: border-box;

        user-select: none;
    }

    .circle-container p {
        position: absolute;

        top: 60%;
        left: 50%;

        transform: translate(-50%, -50%);

        display: inline;

        padding: 0rem 1rem;

        color: white;

        background-color: #445a6c;

        border: 1px solid transparent;
        border-radius: 1rem;

        text-align: center;

        user-select: text;

        white-space: nowrap;

        max-width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .circle-container p:hover {
        border-color: white;
    }

    .circle {
        width: 14px;
        height: 14px;

        display: inline-flex;

        position: relative;

        margin-top: 0.7em;

        border-radius: 50%;

        box-sizing: border-box;
    }

    .red {
        background-color: #ff5252;
        border: 1px solid #222b33;
    }

    .orange {
        background-color: #fbb52c;
        border: 1px solid #222b33;
    }

    .green {
        background-color: #21c136;
        border: 1px solid #222b33;
    }

    .red:hover,
    .orange:hover,
    .green:hover {
        border-color: white;
        cursor: none;
    }

    /*
     * IFRAME
     */

    .iframe {
        width: 100%;
        height: calc(100% - 2rem);

        padding: 0.2rem 1rem 1rem;

        box-sizing: border-box;

        background-color: #222b33;

        border-radius: 12px;
    }

    iframe {
        width: 100%;
        height: 100%;

        display: block;

        border: 0;
        border-radius: 15px;

        background-color: white;

        aspect-ratio: 16 / 9;
    }

    /*
     * BACKGROUND DECORATION
     */

    .bg1,
    .bg2 {
        position: absolute;

        width: 100%;
        height: 100%;

        background-repeat: no-repeat;
        background-size: contain;

        opacity: 0.1;

        pointer-events: none;

        z-index: -1;

        will-change: opacity;
    }

    .bg1 {
        top: -50%;
        right: -60%;

        background-image: url('$lib/assets/bg2.svg');

        animation: bg2 8s ease-out infinite;
    }

    .bg2 {
        bottom: -50%;
        left: -60%;

        background-image: url('$lib/assets/bg1viola.svg');

        animation: bg1 8s ease-out infinite;
    }

    @keyframes bg2 {
        0%,
        100% {
            opacity: 0.1;
        }

        25%,
        75% {
            opacity: 0.3;
        }

        50% {
            opacity: 0.2;
        }
    }

    @keyframes bg1 {
        0%,
        100% {
            opacity: 0.1;
        }

        50% {
            opacity: 0.2;
        }
    }

    /*
     * TABLET
     */

    @media (max-width: 1000px) {
        section {
            min-height: 100dvh;
        }

        .content {
            flex-direction: column;
        }

        .wrapper {
            width: 100%;
            height: auto;
        }

        .websites {
            height: auto;

            padding: 1.5rem;

            gap: 1.5rem;
        }

        .buttons {
            width: 60%;
        }

        .showcase {
            width: 100%;
        }
    }

    /*
     * MOBILE
     *
     * No iframe/showcase.
     * Buttons directly navigate to projects.
     */

    @media (max-width: 600px) {
        section {
            min-height: 100svh;

            height: auto;

            padding: 2rem 1rem;

            overflow: visible;
        }

        h1 {
            padding: 1rem 0;

            font-size: 200%;

            text-underline-offset: 8px;
            padding-bottom: 5rem;
        }

        .content {
            width: 100%;

            flex: none;

            display: block;
        }

        .wrapper {
            width: 100%;
            height: auto;
        }

        .websites {
            width: 100%;
            height: auto;

            padding: 1rem 0;

            gap: 2rem;

            /*
             * Don't make the mobile buttons perform
             * the large desktop scale animation.
             */
            opacity: 1;
            transform: none;
            transition: none;
        }

        .websites-visible {
            opacity: 1;
            transform: none;
        }

        .buttons {
            width: 80%;

            min-height: 4rem;

            padding: 1rem 2.5rem 1rem 1rem;

            font-size: clamp(
                0.9rem,
                4vw,
                1.1rem
            );

            line-height: 1.2;

            cursor: pointer;

            /*
             * Makes the entire button easy to tap.
             */
            -webkit-tap-highlight-color: transparent;
        }

        .buttons img {
            right: -8px;

            height: 60%;
        }

        /*
         * The iframe showcase is completely removed
         * from mobile.
         */
        .showcase {
            display: none;
        }

        /*
         * Decorative SVG animations are unnecessary
         * on a small screen.
         */
        .bg1,
        .bg2 {
            display: none;
        }
    }

    /*
     * VERY SMALL PHONES
     */

    @media (max-width: 380px) {
        section {
            padding: 1.5rem 0.75rem;
        }

        h1 {
            font-size: 2rem;
        }

        .buttons {
            min-height: 3.75rem;

            padding: 0.9rem 2rem 0.9rem 1rem;

            font-size: 0.85rem;
        }
    }

    /*
     * REDUCE MOTION
     */

    @media (prefers-reduced-motion: reduce) {
        .websites {
            transition: none;
        }

        .bg1,
        .bg2 {
            animation: none;
        }

        .container {
            will-change: auto;
        }
    }
</style>