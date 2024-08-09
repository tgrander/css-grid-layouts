export class Carousel {
  private container: HTMLElement;
  private carousel: HTMLElement;
  private navNextButton: HTMLElement;
  private navPrevButton: HTMLElement;
  private slides: HTMLElement[];
  private autoplayButton: HTMLElement;
  private navDots!: HTMLElement[];
  private currentIndex = 0;
  private isAutoPlaying = true;
  private wasAutoPlayingBeforeMouseEnter = true;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.carousel = this.container.querySelector(".carousel") as HTMLElement;
    this.navNextButton = this.container.querySelector(
      ".carousel-button.next"
    ) as HTMLElement;
    this.navPrevButton = this.container.querySelector(
      ".carousel-button.prev"
    ) as HTMLElement;
    this.slides = Array.from(
      this.container.querySelectorAll(".carousel-slide")
    ) as HTMLElement[];
    this.autoplayButton = this.container.querySelector(
      ".carousel-autoplay-button"
    ) as HTMLElement;

    this.init();
  }

  private init() {
    this.navDots = this.createDotsMarkup();
    this.updateActiveDot();
    this.startAutoPlay();
    this.updateAutoPlayButtonText();
    this.addEventListeners();
  }

  private createDotsMarkup(): HTMLElement[] {
    const dotsWrapper = this.container.querySelector(
      ".carousel-dots"
    ) as HTMLElement;

    const navDotsFragment = document.createDocumentFragment();

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.addEventListener("click", () => this.goToSlide(index));

      navDotsFragment.appendChild(dot);
    });
    dotsWrapper.appendChild(navDotsFragment);

    return Array.from(dotsWrapper.children) as HTMLElement[];
  }

  private addEventListeners() {
    this.createCarouselEventListeners();
    this.addNavButtonsEventListeners();
    this.autoplayButton.addEventListener(
      "click",
      this.handleAutoplayButtonClick.bind(this)
    );
  }

  private createCarouselEventListeners() {
    this.carousel.addEventListener(
      "mouseenter",
      this.handleMouseEnter.bind(this)
    );
    this.carousel.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );
  }

  private addNavButtonsEventListeners(): void {
    this.navNextButton.addEventListener("click", this.goToNext.bind(this));
    this.navPrevButton.addEventListener("click", this.goToPrev.bind(this));
  }

  private goToNext() {
    // get current index
    // if new index >= carousel items.length -> new index = 0
    // update this.currentIndex
    // transition to the next slide
    const nextIndex =
      this.currentIndex >= this.slides.length - 1 ? 0 : this.currentIndex + 1;
    this.goToSlide(nextIndex);
  }

  private goToPrev() {
    const nextIndex =
      this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(nextIndex);
  }

  private goToSlide(index: number) {
    if (
      this.currentIndex === index ||
      index < 0 ||
      index >= this.slides.length
    ) {
      return;
    }
    const totalSlides = this.slides.length;
    const normalizedIndex = (index + totalSlides) % totalSlides;

    this.currentIndex = index;
    this.carousel.style.transform = `translate(-${100 * normalizedIndex}%)`;
    this.updateActiveDot();
  }

  private updateActiveDot() {
    this.navDots.forEach((el, index) => {
      el.classList.toggle("active", index === this.currentIndex);
    });
  }

  private startAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
      this.autoplayTimer = setInterval(() => {
        this.goToNext();
      }, 2000);
    }
  }

  private stopAutoPlay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private updateAutoPlayButtonText() {
    this.autoplayButton.textContent = this.isAutoPlaying ? "Pause" : "Play";
  }

  private handleAutoplayButtonClick() {
    this.isAutoPlaying = !this.isAutoPlaying;
    this.updateAutoPlayButtonText();

    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  private handleMouseEnter() {
    this.wasAutoPlayingBeforeMouseEnter = this.isAutoPlaying;
    this.stopAutoPlay();
  }

  private handleMouseLeave() {
    if (this.wasAutoPlayingBeforeMouseEnter) [this.startAutoPlay()];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const containerElement = document.querySelector(
    ".carousel-container"
  ) as HTMLElement;

  new Carousel(containerElement);
});
