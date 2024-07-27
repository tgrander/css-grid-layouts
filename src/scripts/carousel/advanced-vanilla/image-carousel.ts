import { debounce } from "@utils/debounce";

/**
    Event Listeners:
        - ON CLICK PREV
        - ON CLICK NEXT
        - ON CLICK DOT
        x ON CLICK PAUSE/PLAY (do after everything else is implemented)
 */

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CarouselOptions {
  images: CarouselImage[];
  autoplay?: boolean;
  autoplayTimer?: number;
  loop?: boolean;
  showButtons?: boolean;
}

export class ImageCarousel {
  private options: Required<CarouselOptions>;
  private container: HTMLElement;
  private track: HTMLElement;
  private autoPlayButton: HTMLElement;
  private slides: HTMLElement[] = [];
  private dots: HTMLElement[] = [];
  private prevButton: HTMLElement;
  private nextButton: HTMLElement;
  private currentIndex = 0;
  private isAutoPlaying: boolean = false;
  private slideWidth: number = 0;

  constructor(container: HTMLElement, options: CarouselOptions) {
    this.container = container;
    this.options = {
      autoplay: false,
      autoplayTimer: 2000,
      loop: true,
      showButtons: true,
      ...options,
    };
    this.track = this.container.querySelector(
      ".carousel__track"
    ) as HTMLElement;
    this.autoPlayButton = this.container.querySelector(
      ".carousel__autoplay-btn"
    ) as HTMLElement;
    this.prevButton = document.querySelector(
      ".carousel__button--left"
    ) as HTMLElement;
    this.nextButton = document.querySelector(
      ".carousel__button--right"
    ) as HTMLElement;

    this.createSlides();
    this.createDots();
    this.updateAutoplayButtonVisibility();
    this.setupEventListeners();
    this.updateButtonsVisibility();
    this.updateSlideWidth();

    window.addEventListener(
      "resize",
      debounce<typeof this.updateSlideWidth>(
        this.updateSlideWidth.bind(this),
        200
      )
    );
  }

  private createSlides() {
    this.options.images.forEach((image, index) => {
      const slide = document.createElement("li");
      slide.className = "carousel__slide";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt ?? `Image ${index + 1} of image carousel`;

      slide.appendChild(img);
      this.track.appendChild(slide);
      this.slides.push(slide);
    });
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

  private setupEventListeners() {
    this.prevButton.addEventListener("click", () => this.prev());
    this.nextButton.addEventListener("click", () => this.next());
  }

  // private setSlidePosition() {
  //   this.slides.forEach((slide, index) => {
  //     slide.style.left = `-${index * this.slideWidth}px`;
  //   });
  // }

  private setSlidePosition() {
    this.slides.forEach((slide, index) => {
      slide.style.left = `${
        index * 100
      }%`; /* Update: set each slide's position */
    });
  }

  private updateSlideWidth() {
    this.slideWidth = this.slides[0].getBoundingClientRect().width;
    this.setSlidePosition();
  }

  private updateAutoplayButtonVisibility() {
    if (this.options.autoplay) {
      this.autoPlayButton.style.display = "flex";
      this.isAutoPlaying = true;
    }
  }

  private updateButtonsVisibility() {
    if (this.options.loop) {
      this.prevButton.style.display = "flex";
      this.nextButton.style.display = "flex";
    } else {
      this.prevButton.style.display = this.currentIndex === 0 ? "none" : "flex";
      this.nextButton.style.display =
        this.currentIndex === this.slides.length - 1 ? "none" : "flex";
    }
  }

  private updateActiveDot() {
    this.dots.forEach((dot, index) =>
      dot.classList.toggle("active", this.currentIndex === index)
    );
  }

  private goToSlide(index: number) {
    if (
      index < 0 ||
      index >= this.slides.length ||
      index === this.currentIndex
    ) {
      return;
    }

    this.currentIndex = index;
    this.track.style.transform = `translateX(-${
      index * 100
    }%)`; /* Update: translate track */
    this.updateActiveDot();
    this.updateButtonsVisibility();
  }

  private prev() {
    const newIndex =
      this.options.loop && this.currentIndex === 0
        ? this.slides.length - 1
        : Math.max(0, this.currentIndex - 1);

    this.goToSlide(newIndex);
  }

  private next() {
    const newIndex =
      this.options.loop && this.currentIndex === this.slides.length - 1
        ? 0
        : Math.min(this.slides.length - 1, this.currentIndex + 1);
    this.goToSlide(newIndex);
  }
}
