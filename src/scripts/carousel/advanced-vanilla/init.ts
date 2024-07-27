import type { CarouselImage } from "./image-carousel";
import { ImageCarousel } from "./image-carousel";

const container = document.querySelector(".carousel") as HTMLElement;
if (!container) {
  throw new Error("Image carousel container element not found");
}

const imageUrls = [
  "/images/carousel/trey.jpg",
  "/images/carousel/g.jpg",
  "/images/carousel/h.jpg",
  "/images/carousel/i.jpg",
  "/images/carousel/f.jpg",
  "/images/carousel/trey.jpg",
];

const images: CarouselImage[] = imageUrls.map((url, index) => ({
  src: url,
  alt: `Carousel image ${index}`,
}));

// Init Carousel
new ImageCarousel(container, { images });
