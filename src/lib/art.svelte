<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { cursor } from '$lib/state.svelte'

  let ring: HTMLDivElement;

  const imageUrls = [
    'https://old.alvise.me/images/shootingforthestars.webp',
    'https://old.alvise.me/images/eyesnsmile.webp',
    'https://old.alvise.me/images/eyesneverlies.webp',
    'https://old.alvise.me/images/sicfnmt.webp',
    'https://old.alvise.me/images/norainnoflowers.webp',
    'https://old.alvise.me/images/nomorecho1.webp',
    'https://old.alvise.me/images/nomorecho2.webp'
  ];

  const imageCount = imageUrls.length;
  const angle = 360 / imageCount;

  const imageWidth = 500;
  const imageHeight = imageWidth * (297 / 210);

  const radius = 650;

  let currentImage = 0;

  let isDragging = $state(false);
  let startX = 0;
  let lastX = 0;

  onMount(() => {
    const ctx = gsap.context(() => {
      /*
       * Position images around the 3D ring.
       */
      gsap.set('.img', {
        width: imageWidth,
        height: imageHeight,

        rotateY: (i: number) =>
          i * -angle,

        transformOrigin:
          `50% 50% ${radius}px`,

        z: -radius,

        backgroundImage: (i: number) =>
          `url("${imageUrls[i]}")`,

        backgroundPosition: 'center',
        backgroundSize: 'cover',

        backfaceVisibility: 'hidden'
      });

      /*
       * Initial rotation.
       */
      gsap.set(ring, {
        rotationY: 180
      });

      /*
       * Intro.
       */
      gsap.from('.img', {
        duration: 1.5,
        y: 200,
        opacity: 0,
        stagger: 0.1,
        ease: 'expo'
      });
    });

    return () => {
      ctx.revert();
    };
  });

  /*
   * Calculate which artwork is currently
   * closest to the front.
   */
  function updateCurrentImage() {
    if (!ring) return;

    const rotation =
      gsap.getProperty(
        ring,
        'rotationY'
      ) as number;

    /*
     * Normalize rotation to 0–360.
     */
    const normalized =
      ((rotation % 360) + 360) % 360;

    /*
     * Find the closest card.
     */
    let index =
      Math.round(
        normalized / angle
      ) % imageCount;

    /*
     * Keep index positive.
     */
    if (index < 0) {
      index += imageCount;
    }

    currentImage = index;
  }


  /*
   * Begin dragging.
   */
  function handlePointerDown(
    event: PointerEvent
  ) {
    isDragging = true;

    startX = event.clientX;
    lastX = event.clientX;

    (
      event.currentTarget as HTMLElement
    ).setPointerCapture(
      event.pointerId
    );
  }


  /*
   * Rotate carousel.
   */
  function handlePointerMove(
    event: PointerEvent
  ) {
    if (!isDragging) return;

    const currentX = event.clientX;

    const delta =
      currentX - lastX;

    /*
     * Lower number = slower rotation.
     */
    gsap.set(ring, {
      rotationY:
        `-=${delta * 0.2}`
    });

    lastX = currentX;

    updateCurrentImage();
  }


  /*
   * Stop dragging.
   */
  function handlePointerUp(
    event: PointerEvent
  ) {
    isDragging = false;

    const target =
      event.currentTarget as HTMLElement;

    if (
      target.hasPointerCapture(
        event.pointerId
      )
    ) {
      target.releasePointerCapture(
        event.pointerId
      );
    }

    updateCurrentImage();
  }


  /*
   * Open currently visible artwork.
   */
  function openCurrentImage() {
    window.open(
      imageUrls[currentImage],
      '_blank',
      'noopener,noreferrer'
    );
  }
</script>


<section>

  <div
    class="showcase"
    class:dragging={isDragging}
    role="presentation"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}>

    <div class="container">

      <div
        class="ring"
        bind:this={ring}
      >

        {#each imageUrls as image}

          <div class="img"></div>

        {/each}

      </div>

    </div>

    <button
      class="open-button"
      aria-label="Open current artwork"
      onclick={(event) => {
        event.stopPropagation();
        openCurrentImage();
      }}
      onpointerdown={(event) => {
        event.stopPropagation();
      }}
      onmouseenter={() => {cursor.size = 20, cursor.color = 'rgba(115, 88, 252, 0.8)'}} onmouseleave={() => {cursor.size = 8, cursor.color = 'rgba(255, 255, 255, 0.7)'}}
    >
      ↗
    </button>

  </div>

</section>


<style>
  section {
    width: 100dvw;
    height: 100dvh;

    background-color: #151515;

    background-image:
      url('$lib/assets/header.png');

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    padding: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
  }


  /* =========================================
     SHOWCASE
  ========================================= */

  .showcase {
    width: 70%;
    height: 70%;

    position: relative;

    border-radius: 2rem;

    touch-action: none;
  }

  /* =========================================
     3D CONTAINER
  ========================================= */

  .container {
    position: absolute;

    width: 500px;
    height: 707px;

    left: 50%;
    top: 50%;

    transform:
      translate(-50%, -50%);

    perspective: 2500px;

    pointer-events: none;
  }

  .ring {
    position: absolute;

    width: 500px;
    height: 707px;

    left: 0;
    top: 0;

    transform-style: preserve-3d;

    background: none;

    border: none;
    outline: none;
    box-shadow: none;

    pointer-events: none;
  }

  .img {
    position: absolute;

    width: 500px;
    height: 707px;

    left: 0;
    top: 0;

    transform-style: preserve-3d;

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    backface-visibility: hidden;

    border: none;
    outline: none;

    border-radius: 1rem;

    box-shadow:
      10px 15px 35px
      rgb(0, 0, 0);

    pointer-events: none;
  }

  .img::after {
    content: '';

    position: absolute;

    inset: 0;

    border-radius: 1rem;

    pointer-events: none;

    background:
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.12),
        transparent 35%,
        transparent 70%,
        rgba(255, 255, 255, 0.05)
      );

    mix-blend-mode: screen;
  }

  .open-button {
    position: absolute;

    top: 1.5rem;
    right: 1.5rem;

    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    border: 1px solid
      rgba(255, 255, 255, 0.3);

    border-radius: 50%;

    background:
      rgba(0, 0, 0, 0.45);

    color: white;

    font-size: 1.3rem;
    cursor: none;

    backdrop-filter: blur(12px);

    z-index: 100;

    pointer-events: auto;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }


  .open-button:hover {
    background:
      rgba(255, 255, 255, 0.2);

    transform: scale(1.08);
  }


  .open-button:active {
    transform: scale(0.95);
  }


  .open-button:focus-visible {
    outline: 2px solid white;
    outline-offset: 4px;
  }

  @media (max-width: 700px) {

    .showcase {
      width: 90%;
      height: 80%;
    }

    .container {
      width: 280px;
      height: 396px;
    }

    .ring {
      width: 280px;
      height: 396px;
    }

    .img {
      width: 280px;
      height: 396px;
    }

    .open-button {
      top: 1rem;
      right: 1rem;

      width: 42px;
      height: 42px;
    }
  }
</style>