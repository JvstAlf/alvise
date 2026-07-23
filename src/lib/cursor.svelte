<script lang="ts">
  let x: number = $state(0);
  let y: number = $state(0);

  import { cursor } from './state.svelte'

  function handleMouseMove(e: MouseEvent) {
    x = e.clientX;
    y = e.clientY;
  }
</script>

<svelte:window on:mousemove={handleMouseMove} />


<div class="cursor" style="left: {x}px; top: {y}px; transition: 0.2s ease-out; width: {cursor.size}px; height: {cursor.size}px; background-color: {cursor.color}"></div>
<div class="gradient" style="left: {x}px; top: {y}px; transition: 0.25s ease-out;"></div>
<div class="gradient2" style="left: {x}px; top: {y}px; transition: 0.3s ease-out;"></div>


<style>
    .cursor {
        border-radius: 100%;
        box-shadow: 0 0 25 20px rgba(255, 255, 255, 0.3);
        position: fixed;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
    }

    .gradient {
        background-image: url('$lib/assets/blur.svg');
        width: 200px;
        height: 200px;
        opacity: 0.1;
        mix-blend-mode: color-dodge;
        position: fixed;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9998;
    }

    .gradient2 {
        background-image: url('$lib/assets/blur.svg');
        width: 400px;
        height: 400px;
        opacity: 0.05;
        mix-blend-mode: screen;
        position: fixed;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9997;
    }
</style>