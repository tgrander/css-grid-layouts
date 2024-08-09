export class Carousel {
  private container: HTMLElement;
  private carousel: HTMLElement;
  private navNextButton: HTMLElement;
  private navPrevButton: HTMLElement;
  private currentIndex = 0;
  private slides: HTMLElement[];
  private dots!: HTMLElement[];

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

    this.init();

    console.log("this.navNextButton :>> ", this.navNextButton);
  }

  private init() {
    this.createNavDotsMarkup();
    this.addNavButtonsEventListeners();
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
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(
    ".carousel-container"
  ) as HTMLElement;

  new Carousel(container);
});
