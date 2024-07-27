export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface Options {
  images: CarouselImage[];
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
}

export class ImageCarousel {
  private options: Required<Options>;
  private container: HTMLElement;
  private track: HTMLElement;
  private prevButton: HTMLElement;
  private nextButton: HTMLElement;
  private pauseButton: HTMLElement;
  private playButton: HTMLElement;
  private slides: HTMLElement[] = [];
  private dots: HTMLElement[] = [];
  private currentIndex = 0;
  private autoplayTimer: number | null = null;

  constructor(container: HTMLElement, options: Options) {
    this.container = container;
    this.options = {
      autoplay: true,
      loop: true,
      autoplayDelay: 5000,
      ...options,
    };

    this.track = this.container.querySelector(".carousel-track") as HTMLElement;
    this.slides = Array.from(
      this.track.querySelectorAll(".carousel-slide")
    ) as HTMLElement[];
    this.prevButton = this.container.querySelector(
      ".carousel-button.prev"
    ) as HTMLElement;
    this.nextButton = this.container.querySelector(
      ".carousel-button.next"
    ) as HTMLElement;
    this.pauseButton = this.container.querySelector(
      ".carousel-button--pause"
    ) as HTMLElement;
    this.playButton = this.container.querySelector(
      ".carousel-button--play"
    ) as HTMLElement;

    this.createSlides();
    this.createDots();
    this.setupAutoPlay();
    this.setupEventListeners();
  }

  private createSlides() {
    this.slides.forEach((slide, index) => {
      slide.style.left = `${index * 100}%`;
    });
  }

  private createDots() {
    const dotsContainer = this.container.querySelector(
      ".dots-container"
    ) as HTMLElement;

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.role = "tab";
      dot.setAttribute("aria-controls", `slide${index + 1}`);
      dot.ariaLabel = `Slide ${index + 1}`;

      dotsContainer.appendChild(dot);
      this.dots.push(dot);
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    this.updateActiveDot();
  }

  private setupAutoPlay() {
    if (this.options.autoplay) {
      // Show pause btn
      this.pauseButton.classList.remove("hidden");
      // Hide play btn
      this.playButton.classList.add("hidden");
      this.playButton.ariaHidden = "true";

      this.startAutoPlay();
    } else {
      // Show play btn
      this.playButton.classList.remove("hidden");
      // Hide pause btn
      this.pauseButton.classList.add("hidden");
      this.pauseButton.ariaHidden = "true";
    }
  }

  private setupEventListeners() {
    this.prevButton.addEventListener("click", () => this.prev());
    this.nextButton.addEventListener("click", () => this.next());
    this.pauseButton.addEventListener(
      "click",
      this.handleClickPlayPauseButton.bind(this)
    );
    this.playButton.addEventListener(
      "click",
      this.handleClickPlayPauseButton.bind(this)
    );
  }

  private updateActiveDot() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  }

  private goToSlide(index: number) {
    if (this.options.loop) {
      index = (index + this.slides.length) % this.slides.length;
    } else {
      index = Math.max(0, Math.min(this.slides.length - 1, index));
    }

    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;
  }

  private prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  private next() {
    this.goToSlide(this.currentIndex + 1);

    if (this.options.autoplay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  private handleClickPlayPauseButton() {
    if (this.autoplayTimer) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  private startAutoPlay() {
    if (this.options.autoplay && this.autoplayTimer === null) {
      this.autoplayTimer = window.setInterval(
        () => this.next(),
        this.options.autoplayDelay
      );
      // Show pause button + hide play button
      this.pauseButton.classList.toggle("hidden", false);
      this.playButton.classList.toggle("hidden", true);
    }
  }

  private stopAutoPlay() {
    if (this.autoplayTimer !== null) {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
      // Show play button + hide pause button
      this.playButton.classList.toggle("hidden", false);
      this.pauseButton.classList.toggle("hidden", true);
    }
  }
}
