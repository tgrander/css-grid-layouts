export class Carousel {
  private container: HTMLElement;
  private carousel: HTMLElement;
  private navNextButton: HTMLElement;
  private navPrevButton: HTMLElement;
  private slides: HTMLElement[];
  private currentIndex = 0;

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
  }

  private init() {
    this.createDotsMarkup();
    this.addNavButtonsEventListeners();
  }

  private createDotsMarkup() {
    const dotsWrapper = this.container.querySelector(
      ".carousel-dots"
    ) as HTMLElement;
    const navDotsFragment = document.createDocumentFragment();

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.addEventListener("click", () => this.handleNavDotClick(index));

      navDotsFragment.appendChild(dot);
    });

    dotsWrapper.appendChild(navDotsFragment);
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
  }

  private handleNavDotClick(index: number) {}
}

document.addEventListener("DOMContentLoaded", () => {
  const containerElement = document.querySelector(
    ".carousel-container"
  ) as HTMLElement;

  new Carousel(containerElement);
});
