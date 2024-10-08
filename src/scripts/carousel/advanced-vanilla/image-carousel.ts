import { debounce } from "@utils/debounce";

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CarouselOptions {
  images: CarouselImage[];
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showButtons?: boolean;
  autoFocus?: boolean;
}

export class ImageCarousel {
  private options: Required<CarouselOptions>;
  private container: HTMLElement;
  private track: HTMLElement;
  private autoPlayButton: HTMLElement;
  private autoPlayButtonIcons: HTMLElement[];
  private slides: HTMLElement[] = [];
  private dots: HTMLElement[] = [];
  private prevButton: HTMLElement;
  private nextButton: HTMLElement;
  private observer!: IntersectionObserver;
  private currentIndex = 0;
  private autoPlayTimer: number | null = null;
  private isFocused: boolean = false;

  constructor(container: HTMLElement, options: CarouselOptions) {
    this.container = container;
    this.options = {
      autoplay: false,
      autoplayDelay: 2000,
      loop: true,
      showButtons: true,
      autoFocus: false,
      ...options,
    };
    this.track = this.container.querySelector(
      ".carousel__track"
    ) as HTMLElement;
    this.autoPlayButton = this.container.querySelector(
      ".carousel__autoplay-btn"
    ) as HTMLElement;
    this.autoPlayButtonIcons = Array.from(
      this.autoPlayButton.children
    ) as HTMLElement[];
    this.prevButton = document.querySelector(
      ".carousel__button--left"
    ) as HTMLElement;
    this.nextButton = document.querySelector(
      ".carousel__button--right"
    ) as HTMLElement;

    this.setupIntersectionObserver();
    this.createSlides();
    this.createDots();
    this.updateAutoplayButtonVisibility();
    this.setupEventListeners();
    this.updateButtonsVisibility();
    this.updateSlideWidth();
    this.startAutoPlay();

    if (this.options.autoFocus) {
      this.focus();
    }

    window.addEventListener(
      "resize",
      debounce<typeof this.updateSlideWidth>(
        this.updateSlideWidth.bind(this),
        200
      )
    );
  }

  public focus() {
    this.container.focus();
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              this.observer.unobserve(img);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
  }

  private createSlides() {
    this.options.images.forEach((image, index) => {
      const slide = document.createElement("li");
      slide.className = "carousel__slide";
      slide.id = `slide${index + 1}`;
      slide.role = "group";
      slide.ariaRoleDescription = "slide";
      slide.ariaLabel = `Slide ${index + 1} of ${this.options.images.length}`;

      const img = document.createElement("img");
      img.alt = image.alt ?? `Image ${index + 1} of image carousel`;

      if (index === this.currentIndex) {
        img.src = image.src;
      } else {
        img.dataset.src = image.src;
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // Placeholder
      }

      slide.appendChild(img);
      this.track.appendChild(slide);
      this.slides.push(slide);

      this.observer.observe(img);
    });

    this.updateActiveSlide();
  }

  private createDots() {
    // <button class="carousel__dot current"></button>
    const dotsContainer = this.container.querySelector(
      ".carousel__dots"
    ) as HTMLElement;

    this.options.images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel__dot");
      dot.role = "tab";
      dot.setAttribute("aria-controls", `slide${index + 1}`);
      dot.ariaLabel = `Slide ${index + 1}`;

      dotsContainer.appendChild(dot);
      this.dots.push(dot);
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    this.updateActiveDot();
  }

  private setupEventListeners() {
    this.prevButton.addEventListener("click", () => this.prev());
    this.nextButton.addEventListener("click", () => this.next());
    this.autoPlayButton.addEventListener("click", () =>
      this.autoPlayTimer ? this.stopAutoPlay() : this.startAutoPlay()
    );
    this.track.addEventListener("mouseenter", this.stopAutoPlay.bind(this));
    this.track.addEventListener("mouseleave", this.startAutoPlay.bind(this));
    this.track.addEventListener("touchstart", this.stopAutoPlay.bind(this));
    this.track.addEventListener("touchend", this.startAutoPlay.bind(this));

    this.container.addEventListener(
      "mouseenter",
      this.handleFirstInteraction.bind(this),
      { once: true }
    );
    this.container.addEventListener(
      "touchstart",
      this.handleFirstInteraction.bind(this),
      { once: true }
    );

    this.prevButton.addEventListener("focus", () => (this.isFocused = true));
    this.nextButton.addEventListener("focus", () => (this.isFocused = true));
    this.setupKeyboardEvents();
  }

  private setupKeyboardEvents() {
    this.container.addEventListener("focus", () => (this.isFocused = true));
    this.container.addEventListener("blur", () => (this.isFocused = false));

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleFirstInteraction(): void {
    this.container.focus();
  }

  private setSlidePosition() {
    this.slides.forEach((slide, index) => {
      slide.style.left = `${index * 100}%`;
    });
  }

  private updateSlideWidth() {
    // this.slideWidth = this.slides[0].getBoundingClientRect().width;
    this.setSlidePosition();
  }

  private updateAutoplayButtonVisibility() {
    if (this.options.autoplay) {
      this.autoPlayButton.style.display = "flex";
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
    this.dots.forEach((dot, index) => {
      const isActive = this.currentIndex === index;
      dot.classList.toggle("active", isActive);
      dot.ariaSelected = isActive ? "true" : "false";
    });
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
    this.track.style.transform = `translateX(-${index * 100}%)`;
    this.updateActiveSlide();
    this.updateActiveDot();
    this.updateButtonsVisibility();

    // Trigger lazy loading for nearby slides
    const nearbyIndexes = [index - 1, index, index + 1];
    nearbyIndexes.forEach((i) => {
      if (i >= 0 && i < this.slides.length) {
        const img = this.slides[i].querySelector("img");
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
      }
    });
  }

  private updateActiveSlide() {
    this.slides.forEach((slide, index) => {
      if (this.currentIndex === index) {
        slide.ariaHidden = "false";
      } else {
        slide.ariaHidden = "true";
      }
    });
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

  private startAutoPlay() {
    if (this.options.autoplay && !this.autoPlayTimer) {
      this.autoPlayTimer = window.setInterval(
        () => this.next(),
        this.options.autoplayDelay
      );

      this.autoPlayButtonIcons.forEach((icon) => {
        icon.style.display = icon.className.includes("stop") ? "flex" : "none";
      });
    }
  }

  private stopAutoPlay() {
    if (this.autoPlayTimer) {
      window.clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;

      this.autoPlayButtonIcons.forEach((icon) => {
        icon.style.display = icon.className.includes("start") ? "flex" : "none";
      });
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isFocused) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        this.prev();
        break;

      case "ArrowRight":
        event.preventDefault();
        this.next();
        break;

      default:
        break;
    }
  }
}
