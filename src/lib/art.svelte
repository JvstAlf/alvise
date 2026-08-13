<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { cursor } from '$lib/state.svelte';

	type CarouselName =
		| 'posters-carousel.ts'
		| 'thumbnails-carousel.ts';

	let carousel = $state<CarouselName>('posters-carousel.ts');

	let imageUrls = $state<string[]>([]);

	let ring: HTMLDivElement;
	let el: HTMLDivElement;
	let buttons: HTMLDivElement;

	let visible = $state(false);

	let posters: any = null;

	let cleanupCarousel: (() => void) | undefined;

	let loading = false;

	async function loadCarousel(name: CarouselName) {
		loading = true;

		/*
		 * Completely destroy the previous carousel.
		 */
		if (cleanupCarousel) {
			cleanupCarousel();
			cleanupCarousel = undefined;
		}

		posters = null;

		/*
		 * Reset the ring before installing the
		 * new carousel.
		 */
		if (ring) {
			ring.removeAttribute('style');

			const oldImages =
				ring.querySelectorAll<HTMLElement>('.img');

			oldImages.forEach((image) => {
				image.removeAttribute('style');
			});
		}

		/*
		 * Load the requested carousel.
		 */
		const module =
			name === 'posters-carousel.ts'
				? await import('$lib/components/posters-carousel')
				: await import('$lib/components/thumbnails-carousel');

		/*
		 * Replace the images.
		 */
		imageUrls = [...module.imageUrls];

		/*
		 * Wait until Svelte has created the
		 * new .img elements.
		 */
		await tick();

		/*
		 * Make absolutely sure the ring contains
		 * the correct number of images.
		 */
		if (!ring) {
			loading = false;
			return;
		}

		/*
		 * Initialize the carousel.
		 */
		cleanupCarousel = module.initPosters(ring);

		/*
		 * Create a new controller.
		 */
		posters = module.createPosterController(ring);

		loading = false;
	}

	async function switchCarousel(name: CarouselName) {
		if (carousel === name || loading) {
			return;
		}

		/*
		 * Hide the current carousel while replacing it.
		 */
		visible = false;

		carousel = name;

		/*
		 * Wait for the transition to start.
		 */
		await tick();

		await loadCarousel(name);

		/*
		 * Show the new carousel.
		 */
		requestAnimationFrame(() => {
			visible = true;
		});
	}

	onMount(() => {
		/*
		 * Initial carousel.
		 */
		loadCarousel('posters-carousel.ts').then(() => {
			requestAnimationFrame(() => {
				visible = true;
			});
		});

		/*
		 * Intersection observer.
		 */
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{
				threshold: 0.5
			}
		);
			observer.observe(el);
			observer.observe(buttons);

		return () => {
			observer.disconnect();

			if (cleanupCarousel) {
				cleanupCarousel();
				cleanupCarousel = undefined;
			}
		};
	});
</script>

<section>
<div class="title">
	<h1>ART</h1>
</div>
	
	<div class="bg-wrapper">

	<div class="bg1"></div>

	<div class="art">

		<!-- CAROUSEL -->

		<div
			class="showcase"
			class:dragging={posters?.isDragging}
			role="presentation"
			onpointerdown={(event) =>
				posters?.handlePointerDown(event)
			}
			onpointermove={(event) =>
				posters?.handlePointerMove(event)
			}
			onpointerup={(event) =>
				posters?.handlePointerUp(event)
			}
			onpointercancel={(event) =>
				posters?.handlePointerUp(event)
			}
			bind:this={el}
		>
			<div
				class="container"
				class:container-visible={visible}
			>
				<div
					class="ring"
					bind:this={ring}
				>
					{#each imageUrls as image}
						<div
							class="img"
							data-image={image}
						></div>
					{/each}
				</div>

				<!-- OPEN BUTTON -->

				<button
					class="open-button"
					aria-label="Open current artwork"
					onclick={(event) => {
						event.stopPropagation();
						posters?.openCurrentImage();
					}}
					onpointerdown={(event) => {
						event.stopPropagation();
					}}
					onmouseenter={() => {
						cursor.size = 20;
						cursor.color =
							'rgba(115, 88, 252, 0.8)';
					}}
					onmouseleave={() => {
						cursor.size = 8;
						cursor.color =
							'rgba(255, 255, 255, 0.7)';
					}}
				>
					↗
				</button>
			</div>
		</div>

		<!-- CATEGORY BUTTONS -->

		<div
			class="art-showcase"
			bind:this={buttons}
			class:art-showcase-visible={visible}
		>
			<!-- POSTERS -->

			<button
				class="buttons"
				class:active={
					carousel === 'posters-carousel.ts'
				}
				onclick={() =>
					switchCarousel(
						'posters-carousel.ts'
					)
				}
				onmouseenter={() => {
					cursor.size = 20;
					cursor.color =
						'rgba(115, 88, 252, 0.8)';
				}}
				onmouseleave={() => {
					cursor.size = 8;
					cursor.color =
						'rgba(255, 255, 255, 0.7)';
				}}
			>
				Posters
			</button>

			<!-- THUMBNAILS -->

			<button
				class="buttons"
				class:active={
					carousel ===
					'thumbnails-carousel.ts'
				}
				onclick={() =>
					switchCarousel(
						'thumbnails-carousel.ts'
					)
				}
				onmouseenter={() => {
					cursor.size = 20;
					cursor.color =
						'rgba(115, 88, 252, 0.8)';
				}}
				onmouseleave={() => {
					cursor.size = 8;
					cursor.color =
						'rgba(255, 255, 255, 0.7)';
				}}
			>
				Thumbnails
			</button>
		</div>
	</div>
	</div>
</section>

<style>
	section {
		width: 100dvw;
		height: 100dvh;

		background-color: #151515;
		background-image: url('$lib/assets/header.png');

		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		overflow: hidden;
	}

	.title {
		width: 100%;
		height: 15%;
	}

	.bg-wrapper {
		width: 100%;
		height: 85%;
		padding: 2rem;
		position: relative;
		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;
	}

	h1 {
		font-family: 'Climate Crisis', sans-serif;

		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 1000;

		text-shadow:
			-2px -2px 0 var(--purple),
			2px -2px 0 var(--purple),
			-2px 2px 0 var(--purple),
			2px 2px 0 var(--purple);

		width: 100%;

		text-align: center;

		color: white;

		position: relative;

		margin: 0;
		padding: 1rem 0;

		text-decoration: underline;
		text-underline-offset: 12px;

		flex-shrink: 0;
	}

	.art {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.showcase {
		width: 70%;
		height: 100%;

		position: relative;

		border-radius: 2rem;

		display: flex;

		justify-content: center;
		align-items: center;

		overflow: hidden;
	}

	.container {
		position: absolute;

		inset: 0;

		width: 100%;
		height: 100%;

		display: flex;

		justify-content: center;
		align-items: center;

		perspective: 2500px;

		transform: scale(0);

		opacity: 0;

		transition:
			transform 1s cubic-bezier(
				0.17,
				1.04,
				0.79,
				1.14
			),
			opacity 0.5s ease;

		box-sizing: border-box;
	}

	.container-visible {
		transform: scale(1);
		opacity: 1;
	}

	.ring {
		position: absolute;

		left: 50%;
		top: 50%;

		width: 0;
		height: 0;

		transform-style: preserve-3d;

		background: none;

		border: none;
		outline: none;

		box-shadow: none;

		pointer-events: none;
	}

	.img {
		position: absolute;

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
			10px 15px 35px rgb(0, 0, 0);

		pointer-events: none;

		transform-origin: center center;
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

	.art-showcase {
		width: 30%;
		height: 100%;

		display: flex;

		flex-direction: column;

		align-items: center;
		justify-content: center;

		gap: 3rem;

		opacity: 0;

		transform: scale(0.2);

		transition:
			opacity 1s ease,
			transform 1s
				cubic-bezier(
					0.17,
					1.04,
					0.79,
					1.14
				);

		will-change:
			transform,
			opacity;
	}

	.art-showcase-visible {
		opacity: 1;

		transform: scale(1);
	}

	.buttons {
		background:
			linear-gradient(
				#121212,
				#121212
			) padding-box,
			linear-gradient(
				#454545,
				#aaa,
				#454545
			) border-box;

		border-radius: 3rem;

		border: 1px solid transparent;

		box-shadow:
			0 0 7px
				rgba(255, 255, 255, 0.1),
			inset 0 0 7px
				rgba(255, 255, 255, 0.1),
			0 0 10px 10px
				rgba(255, 255, 255, 0.02);

		padding: 1.5rem;

		width: 60%;

		transition: 0.5s ease;

		display: flex;

		justify-content: center;
		align-items: center;

		position: relative;

		overflow: hidden;

		color:
			rgba(255, 255, 255, 0.8);

		font-family:
			'Climate Crisis',
			sans-serif;

		font-variation-settings:
			'YEAR' 1990;

		font-weight: 500;

		font-size: 120%;

		cursor: none;

		-webkit-user-drag: none;

		user-select: none;
		-webkit-user-select: none;

		line-height: 1.5rem;

		box-sizing: border-box;
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

		border: 1px solid transparent;

		box-shadow:
			0 0 12px
				rgba(255, 255, 255, 0.35),
			inset 0 0 10px
				rgba(255, 255, 255, 0.35),
			0 0 12px 12px
				rgba(255, 255, 255, 0.05);
	}

	.buttons.active {
		background: linear-gradient(#121212, #121212) padding-box,
              linear-gradient(30deg, #793bff, #a981ff, #793bff) border-box;
  	box-shadow: 0 0 7px rgba(50, 0, 149, 0.3), inset 0 0 7px rgba(50, 0, 149, 0.3), 0 0 10px 10px rgba(50, 0, 149, 0.3);
	}

  .buttons.active:hover{
    background: linear-gradient(#121212, #121212) padding-box,
              linear-gradient(45deg, #844bff, #c6abff, #844bff) border-box;
        border: 1px solid transparent;
        box-shadow: 0 0 12px rgba(111, 53, 228, 0.3), inset 0 0 10px rgba(111, 53, 228, 0.3), 0 0 12px 12px rgba(111, 53, 228, 0.3);
  }

	.open-button {
		position: absolute;

		top: 5rem;
		right: 1rem;

		width: 64px;
		height: 64px;

		display: flex;

		align-items: center;
		justify-content: center;

		padding: 0;

		border: 1px solid
			rgba(255, 255, 255, 0.3);

		border-radius: 50%;

		background:
			rgba(0, 0, 0, 0.45);

		color: var(--purple);

		font-size: 2rem;
		font-weight: 600;

		cursor: none;

		backdrop-filter: blur(12px);

		z-index: 200;

		pointer-events: auto;

		transition:
			background 0.2s ease,
			transform 0.2s ease;
	}

	.open-button:hover {
		background:
			rgba(255, 255, 255, 0.1);

		transform: scale(1.05);
	}

	.open-button:active {
		transform: scale(0.95);
	}

	.open-button:focus-visible {
		outline: 2px solid white;
		outline-offset: 4px;
	}

	@media (max-width: 700px) {
		section {
			padding: 1rem;
		}

		h1 {
			font-size: clamp(2.5rem, 15vw, 4rem);
			padding: 0.5rem 0;
		}

		.art {
			flex-direction: column;
		}

		.showcase {
			width: 100%;
			height: 75%;
		}

		.art-showcase {
			width: 100%;
			height: 25%;

			flex-direction: row;

			gap: 1rem;
		}

		.buttons {
			width: 45%;
			padding: 1rem;

			font-size: 90%;
		}

		.open-button {
			width: 42px;
			height: 42px;
			top: 1rem;
		}
	}

	.bg1 {
        width: 100%;
        height: 100%;
        position: absolute;
        background-image: url('$lib/assets/bg1.svg');
        background-repeat: no-repeat;
        background-size: contain;
        bottom: -40%;
        right: -50%;
        animation: bg1 6s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
        will-change: transform, opacity;
    }

	    @keyframes bg1 {
    0% { opacity: 0.1; }
    50% { opacity: 0.3; }
    100% { opacity: 0.1; }
}
</style>