<script>
    let iframe = $state('')
</script>

<section id="projects">

  <div class="bg1"></div>

    <div class="websites">
    <button onclick={() => iframe = 'https://alvise.me'}>Old Portfolio</button>
    <button onclick={() => iframe = 'https://old.alvise.me'}>Really old Portfolio</button>
    <button onclick={() => iframe = 'https://off-white.alvise.me'}>Off-White Project</button>
    </div>

    <div class="showcase">
    <div class="container">
      <div class="circle-container">
        <div class="circle red"></div>
        <div class="circle orange"></div>
        <div class="circle green"></div>
      </div>

      <div class="iframe">
      <iframe src={iframe} frameborder="0" title="projects"></iframe>
      </div>
    </div>
    </div>
    
</section>

<style>
    section {
        width: 100dvw;
        height: 100dvh;
        display: flex;
        padding: 2rem;
        background-color: #151515;
        background-image: url('$lib/assets/header.svg');
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .bg1 {
        width: 100%;
        height: 100%;
        position: absolute;
        background-image: url('$lib/assets/bg2.svg');
        background-repeat: no-repeat;
        background-size: contain;
        top: -50%;
        right: -60%;
        animation: bg2 8s ease-out infinite;
        pointer-events: none;
        z-index: -1;
    }

    @keyframes bg2 {
        0% { opacity: 0.1; transform: scale(1); }
        25% { opacity: 0.3; }
        50% { opacity: 0.2; transform: scale(1.03); }
        75% { opacity: 0.3; }
        100% { opacity: 0.1; transform: scale(1); }
    }

    .websites {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        padding: 2rem;
        flex-direction: column;
        gap: 2rem;
    }

    .websites button {
        padding: 1rem;
        background-color: #303030;
        border-radius: 2rem;
        color: white;
    }

    .showcase {
        width: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }

    .container {
  height: 80%;
  aspect-ratio: 16/9;
  background-color: #222b33;
  border-radius: 15px;
  box-shadow: 5px 5px 15px 2px rgba(0, 0, 0, 0.7);
  margin-top: 1vh;
  z-index: 3;

}

.circle-container {
  margin-top: 0.5m;
  margin-left: 0.8em;
}

.iframe {
  width: 100%;
  padding: 0.2rem 1rem 1rem 1rem;
  background-color: #222b33;
  height: 100%;
  border-radius: 15px;
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