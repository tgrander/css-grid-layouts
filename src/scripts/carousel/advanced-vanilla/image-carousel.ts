/**
 * Initialize the dynamic parts of the HTML:

    EVENT LISTENERS
        - ON CLICK PREV
        - ON CLICK NEXT
        - ON CLICK DOT
        x ON CLICK PAUSE/PLAY (do after everything else is implemented)

    DOTS

    PAUSE/PLAY BUTTON BASED ON `autoplay` CONFIG
 */

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CarouselOptions {
  images: CarouselImage[];
}

export class ImageCarousel {
  private container: HTMLElement;
  private track: HTMLElement;
  private slides: HTMLElement[] = [];
  private dots: HTMLElement[] = [];
  private options: Required<CarouselOptions>;
  private currentIndex = 0;

  constructor(container: HTMLElement, options: CarouselOptions) {
    this.container = container;
    this.options = options;
    this.track = this.container.querySelector(
      ".carousel__track"
    ) as HTMLElement;

    this.createSlides();
    this.createDots();
  }

  private createSlides() {
    this.options.images.forEach((image, index) => {
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

  private createDots() {
    // <button class="carousel__dot current"></button>
    const dotsContainer = this.container.querySelector(
      ".carousel__dots"
    ) as HTMLElement;

    this.options.images.forEach(() => {
      const dot = document.createElement("button");
      dot.classList.add("carousel__dot");
      dotsContainer.appendChild(dot);
      this.dots.push(dot);
    });

    this.updateActiveDot();
  }

  private updateActiveDot() {
    this.dots.forEach((dot, index) =>
      dot.classList.toggle("active", this.currentIndex === index)
    );
  }
}
