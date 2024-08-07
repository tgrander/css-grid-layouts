import html from "noop-tag";

/**
 * Controller
 * -
 *
 * Model
 * - currentIndex
 * - size
 * - itemCount
 *
 * View
 * - element
 * - items
 * - navPrev
 * - navNext
 * - config
 */

interface CarouselConfig {
  size?: number;
  activeClass?: boolean;
  gap?: number;
}

class CarouselView {
  private element: HTMLElement;
  private config: Required<CarouselConfig>;
  items: HTMLElement[];
  private navPrev: HTMLElement;
  private navNext: HTMLElement;

  constructor(element: HTMLElement, config: CarouselConfig = {}) {
    this.element = element;
    this.config = {
      ...CarouselView.defaultConfig,
      ...config,
    };

    const elements = this.createMarkup();
    this.navPrev = elements.navPrev;
    this.navNext = elements.navNext;
    this.items = Array.from(
      this.element.querySelectorAll(".hdcarousel_item")
    ) as HTMLElement[];
  }

  private static defaultConfig: Required<CarouselConfig> = {
    size: 3,
    activeClass: false,
    gap: 22,
  };

  private createMarkup() {
    // create nav
    const nav = this.getNav();
    const navPrev = nav.querySelector(".prev-button") as HTMLElement;
    const navNext = nav.querySelector(".next-button") as HTMLElement;

    // create new wrapper
    const wrapper = document.createElement("div") as HTMLElement;
    wrapper.className = "hdcarousel_wrapper";

    // clone curr carousel
    const carousel = this.element.cloneNode(true) as HTMLElement;
    carousel.className = "carousel";

    // add carousel and nav html to wrapper
    wrapper.appendChild(carousel);
    wrapper.appendChild(nav);

    // remove prev carousel node and update this.element ref
    this.element.parentNode!.replaceChild(wrapper, this.element);
    this.element = carousel;

    return {
      navPrev,
      navNext,
    };
  }

  render(visibleIndices: number[]): void {
    this.items.forEach((item, index) => {
      if (visibleIndices.includes(index)) {
        item.style.display = "";
        item.style.order = visibleIndices.indexOf(index).toString();
      } else {
        item.style.display = "none";
      }
    });
  }

  getItems(): HTMLElement[] {
    return this.items;
  }

  onNavClick(callback: (direction: "prev" | "next") => void) {
    this.navPrev.addEventListener("click", () => callback("prev"));
    this.navNext.addEventListener("click", () => callback("next"));
  }

  private getNav(): HTMLElement {
    const wrapper = document.createElement("div") as HTMLElement;
    wrapper.className = "navigation-wrapper";
    wrapper.innerHTML = html`
        <div class="progress-navigation">
          <button class="pause-play-button"></button>
          <div class="nav-dots"></div>
        </div>

        <div class="change-slide-navigation">
          <button class="prev-button">
            <span class="prev-icon">
              <ChevronLeft />
            </span>
          </button>

          <button class="next-button">
            <span class="next-icon">
              <ChevronRight />
            </span>
          </button>
        </div>
      </div>
    `;

    return wrapper;
  }
}
