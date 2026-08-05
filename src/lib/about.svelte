<script lang="ts">
    import Job from './components/job.svelte'
    import Io from './assets/io.jpg'
    import { cursor } from '$lib/state.svelte'
    import VanillaTilt from 'vanilla-tilt';
    import { onMount } from 'svelte';

    let card: HTMLDivElement;
    let opacity = $state(0)

    function shinebrightlikeadiamond(value: number) {
        opacity = value
    }

    onMount(() => {
        VanillaTilt.init(card);
    })

</script>

<section id="about">

    <div class="about">
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
        <div>
            <h1>ME & MYSELF</h1>

            <div class="user-card" bind:this={card} role="presentation"
            data-tilt data-tilt-max="8" data-tilt-speed="3000" data-tilt-perspective="1000" data-tilt-transition="true" data-tilt-scale="1.03" data-tilt-glare="true" data-tilt-reverse="false" data-tilt-max-glare="0.2"  data-tilt-reset="false" data-tilt-startX="12" data-tilt-startY="5"
            style="--opacity: {opacity}"
            onmouseover={() => shinebrightlikeadiamond(100)}
            onmouseleave={() => shinebrightlikeadiamond(0)}
            onfocus={() => shinebrightlikeadiamond(100)}
            onblur={() => shinebrightlikeadiamond(0)}>
                <img src={Io} alt="io">
                <p>Graduated from Michelangelo Guggenheim's Art School (2018 - 2023)</p>
                <p>Love coding, graphic design, music.<br> I play in a <a href="https://nomorecho.com" target="_blank" onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>band!</a></p>
                <div>
                    <button onclick={() => window.open('https://www.alvise.me/assets/Curriculum.pdf')}  onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>CURRICULUM</button>
                    <button onclick={() => window.open('https://drive.google.com/file/d/1nrTgpdwTIjI2ywoTlYrzBeXJNUphGwae/view?usp=sharing')} onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>PORTFOLIO</button>
                </div>
            </div>

        </div>
    </div>

</section>

<style>
    section {
        width: 100dvw;
        height: 100dvh;
        background-color: #151515;
        background-image: url('$lib/assets/header.svg');
        padding: 2rem;
        display: flex;
        align-items: center;
        z-index: 1;
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
        gap: 3rem;
    }

    .about h1 {
        font-family: "Climate Crisis", sans-serif;
        font-size: 400%;
        font-weight: 1000;
        text-shadow: 
        -2px -2px 0 var(--purple),  
        2px -2px 0 var(--purple),
        -2px 2px 0 var(--purple),
        2px 2px 0 var(--purple);
        margin-bottom: 2rem;
        width: 100%;
        text-align: center;
    }

    .user-card {
        width: 70%;
        height: 80%;
        padding: 2rem;
        border-radius: 5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(20deg, rgb(22, 22, 22), rgb(42, 42, 42), rgb(30, 30, 30)) padding-box,
        linear-gradient(30deg, rgb(80, 80, 80), white, rgb(80, 80, 80)) border-box;
        border: 3px solid transparent;
        box-shadow: 10px 10px 10px 5px rgba(0, 0, 0, 0.6);
        transform-style: preserve-3d;
        transform: perspective(1000px);
        transition: 0.6s ease;
        position: relative;
        overflow: hidden;
        will-change: transform;
        backface-visibility: hidden;
        z-index: 2;
    }

    .user-card::before {
    content: '';
    position: absolute;
    height: 300%;
    width: 300px;
    top: 0;
    left: -300px; /* just off the left edge */
    background: linear-gradient(90deg, transparent, rgba(246, 246, 246, 0.2), transparent);
    transform: rotate(45deg) translateY(-35%);
    animation: shine 2.5s ease infinite;
    z-index: 999;
    opacity: var(--opacity);
    transition: opacity 0.3s ease;
    will-change: left; /* hint to browser */
    pointer-events: none;
    animation-play-state: paused;
}

.user-card:hover::before {
    animation-play-state: running;
}

    .user-card img {
        border-radius: 3rem;
        width: 50%;
        aspect-ratio: 1/1.1;
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

    .user-card div {
        width: 100%;
        padding: 2rem;
        display: flex;
        gap: 2rem;
        transform: perspective(500px);
        transform-style: preserve-3d;
    }

    .user-card button {
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
        box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.75);
    }

    .user-card button:hover {
        transform: translateZ(30px);
        box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.75);
        color: var(--purple);
    }

    @keyframes shine {
        0% { left: -1000px; }
        30% { left: calc(100% + 20px); }
        100% { left: calc(100% + 20px); }
    }
</style>