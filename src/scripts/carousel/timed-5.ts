export class Carousel {
  private container: HTMLElement;
  private carousel: HTMLElement;
  private navNextButton: HTMLElement;
  private navPrevButton: HTMLElement;
  private currentIndex = 0;
  private slides: HTMLElement[];
  private dots!: HTMLElement[];
  private autoPlayButton: HTMLElement;
  private isAutoPlaying = true;
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

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
    this.autoPlayButton = this.container.querySelector(
      ".autoplay-button"
    ) as HTMLElement;

    this.init();

    console.log("this.navNextButton :>> ", this.navNextButton);
  }

  private init() {
    this.createNavDotsMarkup();
    this.updateAutoplayButtonText();
    this.startAutoPlay();
    this.addEventListeners();
  }

  private createNavDotsMarkup() {
    const dotsWrapper = this.container.querySelector(
      ".carousel-dots"
    ) as HTMLElement;
    const dotsFragment = document.createDocumentFragment();

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";

      dot.addEventListener("click", () => this.goToSlide(index));
      dotsFragment.appendChild(dot);
    });

    dotsWrapper.appendChild(dotsFragment);
    this.dots = Array.from(dotsWrapper.children) as HTMLElement[];
    this.updateActiveDot();
  }

  private addEventListeners() {
    this.addNavButtonsEventListeners();
    this.autoPlayButton.addEventListener(
      "click",
      this.handleAutoplayButtonClick.bind(this)
    );
  }

  private addNavButtonsEventListeners() {
    this.navNextButton.addEventListener("click", this.goToNext.bind(this));
    this.navPrevButton.addEventListener("click", this.goToPrev.bind(this));
  }

  private goToNext() {
    console.log("clicked NEXT");
    const nextIndex =
      this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
    this.goToSlide(nextIndex);
  }

  private goToPrev() {
    const prevIndex =
      this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(prevIndex);
  }

  private goToSlide(index: number) {
    if (
      index === this.currentIndex ||
      index < 0 ||
      index >= this.slides.length
    ) {
      return;
    }
    const slidesLength = this.slides.length;
    const normalizedIndex = (index + slidesLength) % slidesLength;

    this.carousel.style.transform = `translateX(-${normalizedIndex * 100}%)`;

    this.currentIndex = normalizedIndex;
    this.updateActiveDot();
  }

  private updateActiveDot() {
    this.dots.forEach((el, index) => {
      el.classList.toggle("active", index === this.currentIndex);
    });
  }

  private startAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
      this.autoPlayTimer = setInterval(() => {
        this.goToNext();
      }, 2000);
    }
  }

  private stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private updateAutoplayButtonText() {
    this.autoPlayButton.textContent = this.isAutoPlaying ? "Pause" : "Play";
  }

  private handleAutoplayButtonClick() {
    this.isAutoPlaying = !this.isAutoPlaying;
    this.updateAutoplayButtonText();

    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    ".carousel-container"
  ) as HTMLElement;

  new Carousel(container);
});
