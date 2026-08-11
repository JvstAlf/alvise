<script lang="ts">
import share from '$lib/assets/share.svg'
  import { scale } from 'svelte/transition';
import { cursor } from './state.svelte'
import { onMount } from 'svelte'
    let iframe = $state('')
    let el: HTMLDivElement;
    let buttons: HTMLDivElement
    let wrapper: HTMLDivElement

    let progress = $state(0);

    function update() {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const start = viewportHeight;
        const end = viewportHeight * 0.3;

        progress = 1 - (rect.top - end) / (start - end);

        progress = Math.max(0, Math.min(1, progress));
    }

    onMount(() => {
        update();

        window.addEventListener('scroll', update);

        return () => {
            window.removeEventListener('scroll', update);
        };
    });

    let visible = $state(false);

onMount(() => {
    const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
    }, {
        threshold: 0.5
    });

    observer.observe(wrapper);

    return () => observer.disconnect();
});

    function copy() {
  navigator.clipboard.writeText(iframe);
    }

</script>

<section id="projects">

  <div class="bg1"></div>
  <div class="bg2"></div>

<div class="content">

  <div class="wrapper" bind:this={wrapper}>
    <div class="websites" class:websites-visible={visible} bind:this={buttons}>
    <button class="buttons" onclick={() => iframe = 'https://alvise.me'} onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>Old Portfolio<img src={share} alt="share"></button>
    <button class="buttons" onclick={() => iframe = 'https://old.alvise.me'} onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>Really old Portfolio<img src={share} alt="share"></button>
    <button class="buttons" onclick={() => iframe = 'https://off-white.alvise.me'} onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>Off-White Project<img src={share} alt="share"></button>
    <button class="buttons" onclick={() => iframe = 'https://demonlist.alvise.me'} onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}>Svelte Project<img src={share} alt="share"></button>
    </div>
  </div>

    <div class="showcase">
    <div class="container" style:transform={`translateX(${(1 - progress) * 100}%)`} bind:this={el}>
      <div class="circle-container">
        <div class="circle red"></div>
        <div class="circle orange"></div>
        <div class="circle green"></div>
        <p role="presentation" id="p" onclick={copy}>{iframe || 'alvise.me'}</p>
      </div>

      <div class="iframe">
      <iframe src={iframe} frameborder="0" title="projects" onmouseenter={() => {cursor.size = 0}} onmouseleave={() => {cursor.size = 8}} role="presentation"></iframe>
      </div>
    </div>
    </div>

</div>
    
</section>

<style>
    section {
        width: 100dvw;
        height: 100dvh;
        display: flex;
        background-color: #151515;
        background-image: url('$lib/assets/header.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        isolation: isolate;
    }

    .content {
      position: relative;
    z-index: 1;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    }

    .wrapper {
      height: 100%;
      width: 30%;
      position: relative;
      z-index: 3;
    }

    .bg1 {
        position: absolute;
    width: 100%;
    height: 100%;

    top: -50%;
    right: -60%;

    background-image: url('$lib/assets/bg2.svg');
    background-repeat: no-repeat;
    background-size: contain;

    opacity: 0.1;
    pointer-events: none;

    z-index: -1;

    animation: bg2 8s ease-out infinite;
    }

    .bg2 {
        position: absolute;
    width: 100%;
    height: 100%;

    bottom: -50%;
    left: -60%;

    background-image: url('$lib/assets/bg1viola.svg');
    background-repeat: no-repeat;
    background-size: contain;

    opacity: 0.1;
    pointer-events: none;

    z-index: -1;

    animation: bg1 8s ease-out infinite;
    }

    @keyframes bg2 {
        0% { opacity: 0.1; }
        25% { opacity: 0.3; }
        50% { opacity: 0.2; }
        75% { opacity: 0.3; }
        100% { opacity: 0.1; }
    }

    @keyframes bg1 {
        0% { opacity: 0.1; }
        50% { opacity: 0.2; }
        100% { opacity: 0.1; }
    }


    .websites {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 2rem;
        flex-direction: column;
        gap: 3rem;
        opacity: 0;
        transform: scale(0.2);
        transition:
        opacity 1s ease,
        transform 1s cubic-bezier(.17,1.04,.79,1.14);
        will-change: transform, opacity;
        position: relative;
        z-index: 2;
    }

    .websites-visible {
       opacity: 1;
    transform: scale(1);
    }


    .buttons {
        background: linear-gradient(#121212, #121212) padding-box,
              linear-gradient(#454545, #aaa, #454545) border-box;
        border-radius: 3rem;
        border: 1px solid transparent;
        box-shadow: 0 0 7px rgba(255, 255, 255, 0.1), inset 0 0 7px rgba(255, 255, 255, 0.1), 0 0 10px 10px rgba(255, 255, 255, 0.02);
        background-color: transparent;
        padding: 1.5rem;
        width: 60%;
        transition: 0.5s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-family: "Climate Crisis", sans-serif;
        font-variation-settings: "YEAR" 1990;
        font-weight: 500;
        font-size: 120%;
        cursor: none;
        -webkit-user-drag: none;
        user-select: none;
        -webkit-user-select: none;
        line-height: 1.5rem;
        position: relative;
        overflow: visible;
    }

    .buttons:hover {
        background: linear-gradient(#121212, #121212) padding-box,
              linear-gradient(45deg, rgb(71, 71, 71), rgb(255, 255, 255), rgb(71, 71, 71)) border-box;
        border-radius: 2rem;
        border: 1px solid transparent;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.35), 0 0 12px 12px rgba(255, 255, 255, 0.05);
    }

    .buttons img {
      position: absolute;
      height: 70%;
      right: -15px;
      z-index: 50;
      background-color: #151515;
      padding: 0.25rem;
      border-radius: 10px;
      border: 1px solid #505050;
    }

    .showcase {
        width: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3rem;
        z-index: 2;
    }

    .container {
  height: 80%;
  aspect-ratio: 16/9;
  background-color: #222b33;
  border-radius: 15px;
  box-shadow: 5px 5px 15px 2px rgba(0, 0, 0, 0.7);
  margin-top: 1vh;
    }


    .circle-container p {
      background-color: #445a6c;
      text-align: center;
      padding: 0.1rem 1rem;
      border-radius: 1rem;
      margin-left: 0.5rem;
      color: white;
      border: 1px solid transparent;
      user-select: text;
      display: inline;
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .circle-container p:hover {
      border: 1px solid white;
    }

.circle-container {
  margin-top: 0.5m;
  margin-bottom: 0.2rem;
  padding: 0 1rem;
  user-select: none;
  width: 100%;
  position: relative;
}

.iframe {
  width: 100%;
  padding: 0.2rem 1rem 1rem 1rem;
  background-color: #222b33;
  height: 100%;
  border-radius: 12px;
}

iframe {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    z-index: 5;
    background-color: white;
    aspect-ratio: 16/9;
}

.circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-flex;
  position: relative;
  margin-top: 0.7em;
}

.red {
  background-color: #ff5252;
  border: #222b33;
  border-width: 1px;
  border-style: solid;
}

.red:hover {
  background-color: #c43d3d;
  border: #fff;
  border-width: 1px;
  border-style: solid;
  cursor: none;
}

.orange {
  background-color: #fbb52c;
  border: #222b33;
  border-width: 1px;
  border-style: solid;
}

.orange:hover {
  background-color: #c48d21;
  border: #fff;
  border-width: 1px;
  border-style: solid;
  cursor: none;
}

.green {
  background-color: #21c136;
  border: #222b33;
  border-width: 1px;
  border-style: solid;
}

.green:hover {
  background-color: #168124;
  border: #fff;
  border-width: 1px;
  border-style: solid;
  cursor: none;
}
</style>