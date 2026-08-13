import { gsap } from 'gsap';

export const imageUrls = [
	'https://old.alvise.me/images/1000.webp',
	'https://old.alvise.me/images/5000.webp',
	'https://old.alvise.me/images/cytokinesis.webp',
	'https://old.alvise.me/images/euouae.webp',
	'https://old.alvise.me/images/napalm.webp',
	'https://old.alvise.me/images/subsonic.webp'
];

const imageCount = imageUrls.length;
const angle = 360 / imageCount;

const imageHeight = 350;
const imageWidth =
	imageHeight * (1920 / 1080);

const radius = 600;

export function initPosters(
	ring: HTMLDivElement
): () => void {
	const ctx = gsap.context(() => {
		const images =
			ring.querySelectorAll<HTMLElement>('.img');

		/*
		 * Reset ring completely.
		 */
		gsap.set(ring, {
			clearProps: 'all',
			x: 0,
			y: 0,
			z: 0,
			rotationX: 0,
			rotationY: 180,
			rotationZ: 0
		});

		/*
		 * Position cards around the center.
		 */
		gsap.set(images, {
			width: imageWidth,
			height: imageHeight,

			left: -imageWidth / 2,
			top: -imageHeight / 2,

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
		 * Entrance animation.
		 */
		gsap.from(images, {
			duration: 1.2,
			y: 100,
			opacity: 0,
			stagger: 0.08,
			ease: 'expo.out'
		});
	}, ring);

	return () => {
		ctx.revert();
	};
}

export function createPosterController(
	ring: HTMLDivElement
) {
	let currentImage = 0;
	let isDragging = false;
	let lastX = 0;

	function updateCurrentImage() {
		const rotation =
			gsap.getProperty(
				ring,
				'rotationY'
			) as number;

		const normalized =
			((rotation % 360) + 360) % 360;

		let index =
			Math.round(
				normalized / angle
			) % imageCount;

		if (index < 0) {
			index += imageCount;
		}

		currentImage = index;
	}

	function handlePointerDown(
		event: PointerEvent
	) {
		isDragging = true;

		lastX = event.clientX;

		const target =
			event.currentTarget as HTMLElement;

		target.setPointerCapture(
			event.pointerId
		);
	}

	function handlePointerMove(
		event: PointerEvent
	) {
		if (!isDragging) return;

		const delta =
			event.clientX - lastX;

		gsap.set(ring, {
			rotationY:
				`-=${delta * 0.2}`
		});

		lastX = event.clientX;

		updateCurrentImage();
	}

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

	function openCurrentImage() {
		window.open(
			imageUrls[currentImage],
			'_blank',
			'noopener,noreferrer'
		);
	}

	return {
		get isDragging() {
			return isDragging;
		},

		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		openCurrentImage
	};
}