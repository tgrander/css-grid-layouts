type CarouselDirection = "prev" | "next";

interface CarouselItem {
  imageUrl: string;
}

interface CarouselConfig {
  //   items: CarouselItem[];
  infinite?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

interface CarouselState {
  currentIndex: number;
  numberOfItems: number;
  autoplay: boolean;
  infinite: boolean;
}

class CarouselModel {
  private state: CarouselState;

  constructor(config: Required<CarouselConfig>, numberOfItems: number) {
    this.state = {
      currentIndex: 0,
      numberOfItems,
      autoplay: config.autoplay ?? false,
      infinite: config.infinite ?? true,
    };
  }

  prev(): number {
    const index =
      this.state.infinite && this.state.currentIndex === 0
        ? this.state.numberOfItems - 1
        : Math.max(0, this.state.currentIndex - 1);

    return this.setCurrentIndex(index);
  }

  next(): number {
    const index =
      this.state.infinite &&
      this.state.currentIndex === this.state.numberOfItems - 1
        ? 0
        : Math.min(this.state.numberOfItems - 1, this.state.currentIndex + 1);

    return this.setCurrentIndex(index);
  }

  setCurrentIndex(index: number): number {
    if (
      this.state.currentIndex === index ||
      index < 0 ||
      index >= this.state.numberOfItems
    ) {
      return this.state.currentIndex;
    }
    this.state.currentIndex = index;
    return this.state.currentIndex;
  }

  getState(): CarouselState {
    return this.state;
  }

  get<K extends keyof CarouselState>(key: K): CarouselState[K] {
    return this.state[key];
  }

  set<K extends keyof CarouselState>(key: K, value: CarouselState[K]) {
    this.state[key] = value;
  }
}

class CarouselView {
  private container: HTMLElement;
  private config: Required<CarouselConfig>;
  private track!: HTMLElement;
  private items!: HTMLElement[];
  private navPrevButton!: HTMLElement;
  private navNextButton!: HTMLElement;
  private pauseButton!: HTMLElement;
  private playButton!: HTMLElement;
  private indicatorDots!: HTMLElement[];

  constructor(container: HTMLElement, config: Required<CarouselConfig>) {
    this.container = container;
    this.config = config;

    this.init();
  }

  private init() {
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

  toggleAutoPlayButton(isPlaying: boolean) {
    this.pauseButton.classList.toggle("active", isPlaying === true);
    this.playButton.classList.toggle("active", isPlaying === false);
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

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor(container: HTMLElement, config: CarouselConfig) {
    this.container = container;
    this.config = {
      infinite: true,
      autoplay: true,
      autoplayInterval: 5000,
      ...config,
    };
    this.view = new CarouselView(this.container, this.config);
    this.model = new CarouselModel(this.config, this.view.getItems().length);

    this.init();
  }

  private init() {
    this.addEventListeners();
    this.initAutoPlay();
  }

  private addEventListeners() {
    this.view.onNavButtonClick(this.handleNavButtonClick.bind(this));
    this.view.onIndicatorDotClick(this.handleIndicatorDotClick.bind(this));
    this.view.onPauseButtonClick(this.handlePauseButtonClick.bind(this));
    this.view.onPlayButtonClick(this.playAutoPlay.bind(this));
  }

  private handleNavButtonClick(direction: CarouselDirection) {
    this.clearAutoPlayTimer();

    const index = direction === "prev" ? this.model.prev() : this.model.next();
    this.view.goToSlide(index);

    this.initAutoPlay();
  }

  private handleIndicatorDotClick(index: number) {
    this.model.setCurrentIndex(index);
    this.view.goToSlide(index);
  }

  private playAutoPlay() {
    this.clearAutoPlayTimer();

    this.autoplayTimer = setInterval(() => {
      this.view.goToSlide(this.model.next());
    }, this.config.autoplayInterval);

    this.view.toggleAutoPlayButton(this.autoplayTimer !== null);
    this.model.set("autoplay", true);
  }

  private handlePauseButtonClick() {
    this.clearAutoPlayTimer();
    this.view.toggleAutoPlayButton(this.autoplayTimer === null);
  }

  private clearAutoPlayTimer() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    if (this.model.get("autoplay") === true) {
      this.model.set("autoplay", false);
    }
  }

  private initAutoPlay() {
    if (this.model.get("autoplay") === true) {
      this.playAutoPlay();
    }
  }
}

const container = document.getElementById("carousel__container") as HTMLElement;

const config: CarouselConfig = {};

new CarouselController(container, config);
