class Carousel {
  private container: HTMLElement;
  private track: HTMLElement;
  private slides: HTMLElement[];
  private navNextButton: HTMLElement;
  private navPrevButton: HTMLElement;
  private dots: HTMLElement[];
  private currentIndex = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.track = this.container.querySelector(".carousel-track") as HTMLElement;
    this.slides = Array.from(
      this.container.querySelectorAll(".carousel-slide")
    ) as HTMLElement[];
    this.dots = Array.from(
      this.container.querySelectorAll(".carousel-indicator")
    ) as HTMLElement[];
    this.navNextButton = this.container.querySelector(
      ".carousel-button-next"
    ) as HTMLElement;
    this.navPrevButton = this.container.querySelector(
      ".carousel-button-prev"
    ) as HTMLElement;

    console.log("container :>> ", this.container);
    console.log("navNextButton :>> ", this.navNextButton);

    this.init();
  }

  private init() {
    this.updateActiveDot();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.navNextButton.addEventListener("click", this.goToNext.bind(this));
    this.navPrevButton.addEventListener("click", this.goToPrev.bind(this));
    this.dots.forEach((slide, index) => {
      slide.addEventListener("click", () => this.goToSlide(index));
    });
  }

  private goToNext() {
    console.log("clicked next");
    const index =
      this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
    this.goToSlide(index);
  }

  private goToPrev() {
    const index =
      this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(index);
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

    this.currentIndex = normalizedIndex;

    this.track.style.transform = `translateX(-${normalizedIndex * 100}%)`;

    this.updateActiveDot();
  }

  private updateActiveDot() {
    this.dots.forEach((el, index) => {
      el.classList.toggle("active", index === this.currentIndex);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    ".carousel-container"
  ) as HTMLElement;

  new Carousel(container);
});
