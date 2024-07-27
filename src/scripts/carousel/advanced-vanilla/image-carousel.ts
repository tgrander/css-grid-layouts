/**
 * Initialize the dynamic parts of the HTML:
 *  CAROUSEL SLIDE IMAGES
        - For each image provided to component as config, create and render:
            <li class="carousel__slide">
                <img src="/public/images/carousel/trey.jpg" />
            </li>

    EVENT LISTENERS

    DOTS

    PAUSE/PLAY BUTTON BASED ON `autoplay` CONFIG
 */

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CarouselConfig {
  images: CarouselImage[];
}

export class ImageCarousel {
  private images: CarouselImage[];
  private container: HTMLElement;
  private track!: HTMLElement;
  private slides!: HTMLElement[];

  constructor(container: HTMLElement, { images }: CarouselConfig) {
    this.container = container;
    this.images = images;

    this.initImageSlides();
  }

  private initImageSlides() {
    this.track = this.container.querySelector(
      ".carousel__track"
    ) as HTMLElement;

    this.images.forEach((image, index) => {
      const li = document.createElement("li");
      li.className = "carousel__slide";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt ?? `Image ${index + 1} of image carousel`;

      li.appendChild(img);
      this.track.appendChild(li);
    });

    this.slides = Array.from(this.track.children) as HTMLElement[];
  }
}
