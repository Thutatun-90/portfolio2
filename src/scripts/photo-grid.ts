import justifiedLayout from 'justified-layout';
import GLightbox from 'glightbox';

interface JustifiedLayoutResult {
	/**
	 * Height of the container containing the justified layout.
	 */
	containerHeight: number;
	/**
	 * Number of items that are in rows that aren't fully-packed.
	 */
	widowCount: number;
	/**
	 * Computed positional and sizing properties of a box in the justified layout.
	 */
	boxes: LayoutBox[];
}

/**
 * Computed positional and sizing properties of a box in the layout.
 */
interface LayoutBox {
	/**
	 * Aspect ratio of the box.
	 */
	aspectRatio: number;
	/**
	 * Distance between the top side of the box and the top boundary of the justified layout.
	 */
	top: number;
	/**
	 * Width of the box in a justified layout.
	 */
	width: number;
	/**
	 * Height of the box in a justified layout.
	 */
	height: number;
	/**
	 * Distance between the left side of the box and the left boundary of the justified layout.
	 */
	left: number;
	/**
	 * Whether or not the aspect ratio was forced.
	 */
	forcedAspectRatio?: boolean;
}

export async function setupGallery() {
	if (typeof document === 'undefined') return;

	const container = document.getElementById('photo-grid');
	if (!container) {
		console.error('Photo grid container not found.');
		return;
	}

	const loader = document.getElementById('gallery-loader');

	const imageLinks = Array.from(container.querySelectorAll('.photo-item')) as HTMLElement[];

	if (imageLinks.length === 0) {
		console.warn('No images found inside the photo grid.');
		return;
	}

	// Wait for all images to load
	const imageElements = await waitForImagesToLoad(container);

	// hide skeleton as soon as first images are ready
	if (loader) loader.style.opacity = '0';
	setTimeout(() => {
	if (loader) loader.style.display = 'none';
	}, 300);

	// Get actual image dimensions after loading
	const layout = createLayoutFor(imageElements, container);
	console.log('Generated layout:', layout);

	applyImagesStyleBasedOnLayout(imageLinks, layout);
	applyContainerStyleBasedOnLayout(container, layout);
    
	if (loader) loader.style.display = 'none';
    
	container.classList.remove('hidden');

	// Initialize GLightbox
	GLightbox({
		selector: '.glightbox',
		openEffect: 'zoom',
		closeEffect: 'fade',
		width: 'auto',
		height: 'auto',
	});
}

function createLayoutFor(
	imageElements: HTMLImageElement[],
	container: HTMLElement,
): JustifiedLayoutResult {
	const imageSizes = imageElements.map((img) => ({
		width: img.naturalWidth || img.width || 300,
		height: img.naturalHeight || img.height || 200,
	}));

	const layout = justifiedLayout(imageSizes, {
  containerWidth: container.clientWidth,
  targetRowHeight: 230,
  boxSpacing: 18,
  containerPadding: 0,
  widowLayoutStyle: 'justify',
});
	return layout;
}

async function waitForImagesToLoad(container: HTMLElement) {
	const imageElements = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];

	await Promise.all(
		imageElements.map(
			(img) =>
				new Promise((resolve) => {
					if (img.complete) {
						resolve(null);
					} else {
						img.onload = () => resolve(null);
						img.onerror = () => resolve(null);
					}
				}),
		),
	);
	return imageElements;
}

function applyImagesStyleBasedOnLayout(
	imageLinks: HTMLElement[],
	layout: JustifiedLayoutResult
) {
	// 1️⃣ Clear old styles first
	imageLinks.forEach((el) => {
		el.style.position = '';
		el.style.left = '';
		el.style.top = '';
		el.style.width = '';
		el.style.height = '';
		el.style.display = '';
	});

	// 2️⃣ Apply new layout styles
	imageLinks.forEach((el, i) => {
		if (!layout.boxes[i]) return;

		const { left, top, width, height } = layout.boxes[i];

		el.style.position = 'absolute';
		el.style.left = `${left}px`;
		el.style.top = `${top}px`;
		el.style.width = `${width}px`;
		el.style.height = `${height}px`;
		el.style.display = 'block';
	});
}

function applyContainerStyleBasedOnLayout(container: HTMLElement, layout: JustifiedLayoutResult) {
	// Ensure the parent container has relative positioning
	container.style.position = 'relative';
	// Set container height
	container.style.height = `${layout.containerHeight}px`;
}
// Run setupGallery once the page is loaded
if (typeof window !== 'undefined') {
	const debouncedSetup = debounce(setupGallery, 250);

	document.addEventListener('DOMContentLoaded', setupGallery);
	window.addEventListener('resize', debouncedSetup);
}

// Debounce helper
function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number) {
	let timeout: ReturnType<typeof setTimeout>;
	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
