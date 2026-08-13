<script lang="ts">
    import { onMount } from 'svelte';
    import VanillaTilt from 'vanilla-tilt';

    import Nome from '$lib/assets/alvisezurlandi.png'
    import nextBtn from '$lib/assets/next.svg'

    import canyoufeelitCover from '$lib/assets/songs/canyoufeelit.svg?raw'
    import canyoufeelit from '$lib/assets/songs/canyoufeelit.mp3'
    import yu8meCover from '$lib/assets/songs/yu8me.svg?raw'
    import yu8me from '$lib/assets/songs/yu8me.mp3'
    import imbrokencover from '$lib/assets/songs/imbroken.svg?raw'
    import imbroken from '$lib/assets/songs/imbroken.mp3'
    import repulsivecover from '$lib/assets/songs/repulsive.svg?raw'
    import repulsive from '$lib/assets/songs/repulsive.mp3'

    import { cursor } from './state.svelte'

    let navbarPosition = $state(-50);
    let nameScale = $state(60)
    let nameBlur = $state(100)
    let nameOpacity = $state(0)

    let navbarOpacity = $state(0);
    let nextOpacity = $state(0)

    let vinyl: HTMLDivElement;
    let io: HTMLDivElement;

    let check = $state(false);
    let changingSong = $state(false);

    let changeTimer: ReturnType<typeof setTimeout> | undefined;

    function mobileCheck() {
        check = window.matchMedia('(max-width: 700px)').matches;
    }

    function showNavbar() {
        navbarPosition = 0;
        navbarOpacity = 1;
        nextOpacity = 0.4;
        vinyl.style.transition = '0.7s ease'
        vinyl.style.transform = 'rotateX(0deg)';
    }

    const songs = [
        {
            name: "Can You Feel It - Polyphia",
            url: canyoufeelit,
            cover: canyoufeelitCover,
            link: 'https://open.spotify.com/track/1UsjO2e3GW7mYpdWXyJ7AN?si=ecb5d0f01c284e2a'
        },
        {
            name: "y u 8 me - nomorecho",
            url: yu8me,
            cover: yu8meCover,
            link: 'https://open.spotify.com/track/2I90CilYpF3RI0ttk48hXN?si=35e40dbfdcbe4231'
        },
        {
            name: "I'm Broken - Pantera",
            url: imbroken,
            cover: imbrokencover,
            link: 'https://open.spotify.com/track/2M5WTwqnkyz7bW6P1CiD6q?si=427a2a1480a643ed'
        },
        {
            name: "Repulsive in it's Splendid Beauty - Crowbar",
            url: repulsive,
            cover: repulsivecover,
            link: 'https://open.spotify.com/track/5VGAlq9o0u09jZavGLUfdo?si=98fd19586c1646fc'
        }
    ]

    function getRandomSong(excludeIndex: number) {
        let index: number;

        do {
            index = Math.floor(Math.random() * songs.length);
        } while (index === excludeIndex && songs.length > 1);

        return { song: songs[index], index };
    }

    let currentSongIndex = $state(Math.floor(Math.random() * songs.length));
    let vinylCover = $state('');
    let songName = $state('');
    let songLink = $state('')

    let rotating = $state(false);
    let songNameOpacity = $state(0)

    let audio: HTMLAudioElement;

    function toggleRotate() {
        if (changingSong) return;

        rotating = !rotating;

        if (rotating) {
            vinyl.style.animation = 'rotate 4s linear infinite'
            songNameOpacity = 1;

            audio.play().catch(() => {
                rotating = false;
            });
        } else {
            vinyl.style.animation = ""
            songNameOpacity = 0;
            audio.pause();
        }
    }

    function changeSong() {
        if (changingSong) return;

        changingSong = true;

        const wasPlaying = rotating;

        rotating = false;
        vinyl.style.animation = "";
        audio.pause();
        audio.currentTime = 0;

        const { song, index } = getRandomSong(currentSongIndex);
        currentSongIndex = index;

        void vinyl.offsetWidth;

        vinyl.style.transition = '0.7s ease';
        vinyl.style.transform = `rotateX(90deg) translateY(150px)`;

        changeTimer = setTimeout(() => {
            songName = song.name;
            songLink = song.link;
            vinylCover = song.cover;

            // Reuse the existing Audio element instead of
            // creating a new one every time.
            audio.src = song.url;
            audio.load();
            audio.volume = 0.3;

            setTimeout(() => {
                vinyl.style.transform = `rotateX(0) translateY(0)`;

                setTimeout(() => {
                    vinyl.style.transform = `rotateX(0deg) translateY(0)`;

                    if (wasPlaying) {
                        setTimeout(() => {
                            rotating = true;
                            vinyl.style.animation = 'rotate 4s linear infinite';
                            songNameOpacity = 1;
                            audio.volume = 0.3;

                            audio.play().catch(() => {
                                rotating = false;
                            });
                        }, 700);
                    }

                    changingSong = false;
                }, 50);
            }, 300);
        }, 700);
    }

    onMount(() => {
        mobileCheck();

        window.addEventListener('resize', mobileCheck);

        vinylCover = songs[currentSongIndex].cover;
        songName = songs[currentSongIndex].name;
        songLink = songs[currentSongIndex].link;

        vinyl.style.transform = 'rotateX(-90deg)';

        audio = new Audio(songs[currentSongIndex].url);
        audio.preload = 'auto';
        audio.volume = 0.3;

        audio.addEventListener('ended', () => {
            rotating = false;
            songNameOpacity = 0;
            vinyl.style.animation = "";
        });
        if(!check){
VanillaTilt.init(io);
        }

        nameOpacity = 1;

        setTimeout(() => {
            nameScale = 1;
            nameBlur = 0;
        }, 800);

        const navbarTimer = setTimeout(() => {
            showNavbar();
        }, 2000);

        return () => {
            window.removeEventListener('resize', mobileCheck);

            clearTimeout(navbarTimer);

            if (changeTimer) {
                clearTimeout(changeTimer);
            }

            audio.pause();
            audio.src = '';

            const tilt = (io as HTMLDivElement & {
                vanillaTilt?: {
                    destroy: () => void
                }
            }).vanillaTilt;

            tilt?.destroy();
        };
    });
</script>

<svelte:head>
    <link rel="preload" as="image" href={Nome} />
</svelte:head>

<section>

    <div class="bg"></div>
    <div class="bg1"></div>

    {#if !check}
        <ul
            class="nav"
            style="
                transform: translateY({navbarPosition}%);
                opacity: {navbarOpacity};
                transition: 1s ease-out;
            "
        >
            <a
                href="#about"
                onmouseenter={() => {
                    cursor.size = 20,
                    cursor.color = 'rgba(115, 88, 252, 0.8)'
                }}
                onmouseleave={() => {
                    cursor.size = 8,
                    cursor.color = 'rgba(255, 255, 255, 0.7)'
                }}
                draggable="false"
            >
                about
            </a>

            <a
                href="#projects"
                onmouseenter={() => {
                    cursor.size = 20,
                    cursor.color = 'rgba(115, 88, 252, 0.8)'
                }}
                onmouseleave={() => {
                    cursor.size = 8,
                    cursor.color = 'rgba(255, 255, 255, 0.7)'
                }}
                draggable="false"
            >
                projects
            </a>

            <a
                href="#art"
                onmouseenter={() => {
                    cursor.size = 20,
                    cursor.color = 'rgba(115, 88, 252, 0.8)'
                }}
                onmouseleave={() => {
                    cursor.size = 8,
                    cursor.color = 'rgba(255, 255, 255, 0.7)'
                }}
                draggable="false"
            >
                art
            </a>
        </ul>
    {/if}

    <div class="profile">

        <div
            class="name"
            style="
                scale: {nameScale};
                filter: blur({nameBlur}px);
                opacity: {nameOpacity};
                transition: 1s
            "
        >
            <img
                onmouseenter={() => cursor.size = 20}
                onmouseleave={() => cursor.size = 8}
                src={Nome}
                alt="Alvise Zurlandi"
                class="alvise"
                bind:this={io}
                data-tilt
                data-tilt-max="5"
                data-tilt-speed="5000"
                data-tilt-perspective="1000"
                data-tilt-glare="true"
                data-tilt-transition="true"
                data-tilt-scale="1.03"
                data-tilt-reverse="false"
                draggable="false"
            />
        </div>

        <div class="music-player">

            <div class="player">

                <div class="vinyl-wrapper">

                    <div class="vinyl-shadow">

                        <div
                            class="vinyl"
                            bind:this={vinyl}
                            onclick={toggleRotate}
                            onmouseenter={() => {
                                cursor.size = 20,
                                cursor.color = 'rgba(115, 88, 252, 0.8)'
                            }}
                            onmouseleave={() => {
                                cursor.size = 8,
                                cursor.color = 'rgba(255, 255, 255, 0.7)'
                            }}
                            role="presentation"
                            draggable="false"
                        >
                            {@html vinylCover}
                        </div>

                    </div>

                    <img
                        src={nextBtn}
                        class="next"
                        style="opacity: {nextOpacity}"
                        onclick={changeSong}
                        alt="next"
                        draggable="false"
                        role="presentation"
                    />

                </div>

            </div>

            <p
                class="song-name"
                style="opacity: {songNameOpacity}"
            >
                now playing:
            </p>

            <a
                class="song-name"
                style="opacity: {songNameOpacity}"
                href={songLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                {songName}
            </a>

        </div>

    </div>

</section>

<style>
    section {
        display: flex;
        align-items: center;
        flex-direction: column;

        background-color: #151515;
        background-image: url('$lib/assets/header.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        height: 100dvh;
        width: 100%;
        position: relative;
    }

    .bg {
        width: 100%;
        height: 100%;
        position: absolute;

        background-image: url('$lib/assets/bg1viola.svg');
        background-repeat: no-repeat;
        background-size: contain;

        top: 40%;
        left: -40%;

        animation: bg1 6s ease-in-out infinite;

        pointer-events: none;
        z-index: 1;

        will-change: transform, opacity;
    }

    .bg1 {
        width: 100%;
        height: 100%;
        position: absolute;

        background-image: url('$lib/assets/bg2.svg');
        background-repeat: no-repeat;
        background-size: contain;

        top: -50%;
        right: -70%;

        animation: bg2 8s ease-out infinite;

        pointer-events: none;
        z-index: 1;

        will-change: transform, opacity;
    }

    @keyframes bg1 {
        0% {
            opacity: 0.1;
        }

        50% {
            opacity: 0.3;
        }

        100% {
            opacity: 0.1;
        }
    }

    @keyframes bg2 {
        0% {
            opacity: 0.1;
        }

        50% {
            opacity: 0.2;
        }

        100% {
            opacity: 0.1;
        }
    }

    .profile {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .name {
        width: 60%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: cubic-bezier(.44,.19,.3,1.29);

        z-index: 20;
    }

    .music-player {
        width: 40%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        z-index: 10;
    }

    .player {
        width: 100%;
        display: flex;
        height: 50%;

        justify-content: center;
        align-items: center;

        position: relative;
    }

    .vinyl-wrapper {
        position: relative;

        width: 80%;
        height: 80%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .vinyl {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: none;

        will-change: transform;
    }

    .vinyl :global(svg) {
        width: 100%;
        height: 100%;
    }

    .vinyl:hover {
        scale: 1.05;
    }

    .vinyl-shadow {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        filter: drop-shadow(
            20px 25px 15px rgba(0, 0, 0, 0.6)
        );

        transition: filter 0.3s ease;

        will-change: filter;
    }

    .vinyl-shadow:hover {
        filter: drop-shadow(
            0px 0px 15px rgba(255, 255, 255, 0.1)
        );
    }

    .next {
        position: absolute;

        right: -35px;

        width: 30px;
        height: 30px;

        transition: 0.5s ease;

        cursor: none;
    }

    .next:hover {
        opacity: 0.8 !important;
    }

    .song-name {
        text-align: center;

        font-family: "Bodoni Moda", serif;
        color: white;

        font-size: 150%;

        transition: 1s ease;

        padding: 0.2rem 0.5rem;

        cursor: none;
    }

    .song-name:last-child {
        font-size: 180%;
        font-weight: 800;
        z-index: 100;
    }

    .song-name:last-child:hover {
        color: #808080;
    }

    .alvise {
        width: 80%;
        height: auto;

        object-fit: contain;

        animation: alvise 3s infinite alternate ease-in-out;
    }

    @keyframes alvise {
        0% {
            scale: 1;
            translate: 20px -10px;
        }

        100% {
            scale: 1.05;
            translate: 0 0;
        }
    }

    @media (max-width: 700px) {

        .profile {
            flex-direction: column;
        }

        .name {
            width: 100%;
            height: 60%;
        }

        .music-player {
            width: 100%;
            height: 40%;
            justify-content: start;
            align-items: start;
        }

        .player {
            height: 80%;
            align-items: start;
        }

        .vinyl {
            width: 70%;
        }

        .song-name {
            font-size: 100%;
            padding: 0.1rem 0.25rem;
            text-align: center;
            width: 100%;
        }

        .song-name:last-child {
            font-size: 130%;
            font-weight: 600;
        }

        .next {
            position: absolute;

            right: 0px;

            width: 25px;
            height: 25px;

            transition: 0.5s ease;

            cursor: none;
        }

        @keyframes alvise {
            0% {
                scale: 1;
                translate: 10px -5px;
            }

            100% {
                scale: 1.05;
                translate: 0 0;
            }
        }

        .bg {
            top: 70%;
            left: -40%;

            width: 120%;
            height: 120%;
        }

        .bg1 {
            top: 0%;
            right: -40%;

            width: 120%;
            height: 120%;
        }
    }

    /*
     * Very short phones.
     *
     * This doesn't change normal mobile sizing.
     * It only gives the layout a little more room when
     * the viewport is short.
     */
    @media (max-width: 700px) and (max-height: 700px) {

        .name {
            height: 55%;
        }

        .music-player {
            height: 45%;
        }

        .player {
            height: 78%;
        }
    }

    /*
     * Extremely narrow phones.
     *
     * Only reduces nav spacing so it cannot overflow.
     */
    @media (max-width: 380px) {

        .nav {
            gap: 1.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .nav a {
            padding-left: 0.9rem;
            padding-right: 0.9rem;
        }
    }

    .nav {
        width: auto;

        padding: 2.5rem 1.5rem;
        height: 4rem;

        border-radius: 10rem;

        margin-top: 2rem;

        background-color: rgba(0, 0, 0, 0.3);

        display: flex;
        justify-content: center;
        align-items: center;

        gap: 2.5rem;

        -webkit-user-drag: none;
        user-select: none;
        -webkit-user-select: none;
    }

    @keyframes shine {
        0% {
            left: -80px;
        }

        40% {
            left: calc(100% + 20px);
        }

        100% {
            left: calc(100% + 20px);
        }
    }

    .nav a {
        background:
            linear-gradient(#121212, #121212) padding-box,
            linear-gradient(#454545, #aaa, #454545) border-box;

        border-radius: 2rem;
        border: 1px solid transparent;

        box-shadow:
            0 0 7px rgba(255, 255, 255, 0.1),
            inset 0 0 7px rgba(255, 255, 255, 0.1),
            0 0 10px 10px rgba(255, 255, 255, 0.02);

        background-color: transparent;

        padding: 0.75rem 1.5rem;

        transition: 0.5s ease;

        display: flex;
        justify-content: center;
        align-items: center;

        position: relative;
        overflow: hidden;

        color: rgba(255, 255, 255, 0.8);

        text-decoration: none;

        font-family: "Bodoni Moda", serif;
        font-weight: 500;
        font-size: 120%;

        cursor: none;

        -webkit-user-drag: none;
        user-select: none;
        -webkit-user-select: none;

        line-height: 1.5rem;
    }

    .nav a:hover {
        background:
            linear-gradient(#121212, #121212) padding-box,
            linear-gradient(
                45deg,
                rgb(71, 71, 71),
                rgb(255, 255, 255),
                rgb(71, 71, 71)
            ) border-box;

        border-radius: 2rem;
        border: 1px solid transparent;

        box-shadow:
            0 0 12px rgba(255, 255, 255, 0.35),
            inset 0 0 10px rgba(255, 255, 255, 0.35),
            0 0 12px 12px rgba(255, 255, 255, 0.05);
    }

    .nav a::before {
        content: '';

        position: absolute;

        height: 250%;
        width: 50px;

        top: 0;
        left: -60px;

        background: linear-gradient(
            90deg,
            transparent,
            rgba(217, 217, 217, 0.271),
            transparent
        );

        transform: rotate(45deg) translateY(-35%);

        animation: shine 2s ease infinite;
    }

    @keyframes rotate {
        0% {
            transform: rotateZ(0deg);
        }

        100% {
            transform: rotateZ(360deg);
        }
    }

    /*
     * Let users who have disabled animations avoid the
     * continuous background/vinyl/name animations.
     */
    @media (prefers-reduced-motion: reduce) {
        .bg,
        .bg1,
        .alvise,
        .vinyl {
            animation: none !important;
        }
    }
</style>