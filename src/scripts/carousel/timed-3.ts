type CarouselDirection = "prev" | "next";

interface CarouselItem {
  imageUrl: string;
}

interface CarouselConfig {
  //   items: CarouselItem[];
  infinite?: boolean;
}

class CarouselModel {
  private currentIndex: number = 0;
  private numberOfItems: number;
  private infinite: boolean;

  constructor(numberOfItems: number, infinite: boolean = true) {
    this.numberOfItems = numberOfItems;
    this.infinite = infinite;
  }

  prev(): number {
    const index =
      this.infinite && this.currentIndex === 0
        ? this.numberOfItems - 1
        : Math.max(0, this.currentIndex + 1);

    return this.setCurrentIndex(index);
  }

  next(): number {
    const index =
      this.infinite && this.currentIndex === this.numberOfItems - 1
        ? 0
        : Math.min(this.numberOfItems - 1, this.currentIndex + 1);

    return this.setCurrentIndex(index);
  }

  setCurrentIndex(index: number): number {
    if (
      this.currentIndex === index ||
      index < 0 ||
      index >= this.numberOfItems
    ) {
      return this.currentIndex;
    }
    this.currentIndex = index;
    return this.currentIndex;
  }
}

class CarouselView {
  private container: HTMLElement;
  private config: Required<CarouselConfig>;
  private track: HTMLElement;
  private items: HTMLElement[];
  private navPrevButton: HTMLElement;
  private navNextButton: HTMLElement;
  private pauseButton: HTMLElement;
  private playButton: HTMLElement;
  private indicatorDots: HTMLElement[];

  constructor(container: HTMLElement, config: Required<CarouselConfig>) {
    this.container = container;
    this.config = config;

    const track = this.container.querySelector(
      ".carousel__track"
    ) as HTMLElement;
    this.track = track;

    const items = Array.from(
      track.querySelectorAll(".carousel__slide")
    ) as HTMLElement[];
    this.items = items;

    this.navPrevButton = this.container.querySelector(
      ".carousel__nav-button.prev"
    ) as HTMLElement;
    this.navNextButton = this.container.querySelector(
      ".carousel__nav-button.next"
    ) as HTMLElement;
    this.pauseButton = this.container.querySelector(
      ".carousel__play-pause-btn.pause"
    ) as HTMLElement;
    this.playButton = this.container.querySelector(
      ".carousel__play-pause-btn.play"
    ) as HTMLElement;
    this.indicatorDots = Array.from(
      this.container.querySelectorAll(".carousel__dot")
    ) as HTMLElement[];

    this.setSlidePositions();
    this.updateActiveIndicatorButton(0);
  }

  private setSlidePositions() {
    this.items.forEach((el, index) => {
      el.style.left = `${100 * index}%`;
    });
  }

  private updateActiveIndicatorButton(currentIndex: number) {
    this.indicatorDots.forEach((dot, index) =>
      dot.classList.toggle("active", index === currentIndex)
    );
  }

  goToSlide(index: number) {
    this.track.style.transform = `translateX(-${index * 100}%)`;
    this.updateActiveIndicatorButton(index);
  }

  getItems(): HTMLElement[] {
    return this.items;
  }

  onNavButtonClick(callback: (direction: CarouselDirection) => void): void {
    this.navPrevButton.addEventListener("click", () => callback("prev"));
    this.navNextButton.addEventListener("click", () => callback("next"));
  }

  onPauseButtonClick(callback: () => void) {
    this.pauseButton.addEventListener("click", callback);
  }

  onPlayButtonClick(callback: () => void) {
    this.playButton.addEventListener("click", callback);
  }

  onIndicatorDotClick(callback: (index: number) => void) {
    this.indicatorDots.forEach((dotEl, index) =>
      dotEl.addEventListener("click", () => callback(index))
    );
  }
}

export class CarouselController {
  private container: HTMLElement;
  private config: Required<CarouselConfig>;
  private model: CarouselModel;
  private view: CarouselView;

  constructor(container: HTMLElement, config: CarouselConfig) {
    this.container = container;
    this.config = {
      infinite: true,
      ...config,
    };
    this.view = new CarouselView(this.container, this.config);
    this.model = new CarouselModel(
      this.view.getItems().length,
      this.config.infinite
    );

    this.init();
  }

  private init() {
    this.addEventListeners();
  }

  private addEventListeners() {
    this.view.onNavButtonClick((direction) =>
      this.handleNavButtonClick(direction)
    );
    this.view.onIndicatorDotClick((index) =>
      this.handleIndicatorDotClick(index)
    );
  }

  private handleNavButtonClick(direction: CarouselDirection) {
    const index = direction === "prev" ? this.model.prev() : this.model.next();
    this.view.goToSlide(index);
  }

  private handleIndicatorDotClick(index: number) {
    this.model.setCurrentIndex(index);
    this.view.goToSlide(index);
  }
}

const container = document.getElementById("carousel__container") as HTMLElement;

const config: CarouselConfig = {};

new CarouselController(container, config);
