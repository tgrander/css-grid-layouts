import { ImageCarousel } from "./image-carousel";

const container = document.querySelector(".carousel-container") as HTMLElement;

const carousel = new ImageCarousel(container, { images: [], autoplay: true });
