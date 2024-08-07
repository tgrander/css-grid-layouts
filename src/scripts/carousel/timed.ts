import html from "noop-tag";

/**
 * INITIALIZE
 * ------------
 *   HTML
 *     - image slides
 *     - thumbnail navigation
 * ====================================================
 *
 * ACTIONS
 * ------------
 *  START AUTOPLAY (on mount) + (on click play btn)
 *      - on click play button
 *      - on mouse leave caruousel (& isAutoPlay = true)
 *      - on click space bar (when carousel is focused)
 *
 *  STOP AUTOPLAY
 *      - on click pause button
 *      - on mouse enter caruousel
 *      - on click space bar (when carousel is focused)
 *
 * GO TO NEXT (on click next button)
 *      - on press right arrow key
 *
 * GO TO PREV (on click prev button)
 *      - on press left arrow key
 *
 * GO TO SLIDE (on click navigation thumbnail)
 * ====================================================
 *
 * STYLING
 * ------------
 *   - fade transition animation on image change
 *   - responsive
 * ====================================================
 *
 * PERFORMANCE
 * ------------
 *   - preload images
 *   - DOM manipulation techniques
 * ====================================================
 */

interface Item {
  imageUrl?: string;
  description?: string;
}

interface Config {
  items: Item[];
}

// Markup Manager
class MarkupManager {
  private el: HTMLElement;
  private config: Required<Config>;

  constructor(el: HTMLElement, config: Config) {
    this.el = el;
    this.config = {
      ...config,
    };
  }

  public render() {
    this.createMarkup();
  }

  private createMarkup() {
    const nav = this.getNav();

    // create new carousel wrapper el
    const wrapper = document.createElement("div") as HTMLElement;
    wrapper.classList.add("carousel__wrapper");

    // clone the curr carousel el and insert into wrapper
    const carousel = this.el.cloneNode(true) as HTMLElement;
    wrapper.insertAdjacentElement("afterbegin", carousel);
    wrapper.insertAdjacentHTML("beforeend", nav);

    // Create slides
    const items = this.createItems();
    wrapper.appendChild(items);

    // add the new wrapper before the old carousel
    this.el.insertAdjacentElement("afterbegin", wrapper);

    // remove the old carousel and reset the variables
    this.el.remove();
    this.el = wrapper.firstChild as HTMLElement;
    this.el.classList.add("carousel__wrapper");
  }

  private createItems(): DocumentFragment {
    const items = document.createDocumentFragment();

    this.config.items.forEach((item, index) => {
      const el = document.createElement("div") as HTMLElement;
      el.classList.add(".carousel-item");

      if (item.imageUrl) {
        const img = this.createItemImage(item);
        el.appendChild(img);
      }

      items.appendChild(el);
    });

    return items;
  }

  private createItemImage({
    imageUrl = "",
    description = "",
  }: Item): HTMLImageElement {
    const img = document.createElement("img") as HTMLImageElement;
    img.classList.add(".item-image");
    img.src = imageUrl;
    img.alt = description;
    return img;
  }

  private getNav() {
    return html`
      <div class="navigation-wrapper">
        <div class="progress-navigation">
          <button class="pause-play-button"></button>
          <div class="nav-dots"></div>
        </div>

        <div class="change-slide-navigation">
          <button class="prev-button hidden">
            <span class="prev-icon">
              <ChevronLeft />
            </span>
          </button>

          <button class="next-button hidden">
            <span class="next-icon">
              <ChevronRight />
            </span>
          </button>
        </div>
      </div>
    `;
  }
}

// Carousel Parent Class
class Carousel {
  private version = 0.1;
  private el: HTMLElement;
  private config: Required<Config>;
  private markupManager: MarkupManager;

  constructor(el: HTMLElement, config: Config) {
    this.el = el;
    this.config = {
      ...config,
    };
    this.markupManager = new MarkupManager(el, this.config);
  }

  public init() {
    this.markupManager.render();
  }
}

// INITIALIZE CAROUSEL
const el = document.getElementById("carousel-placeholder") as HTMLElement;

const carousel = new Carousel(el, { items: [] });

carousel.init();
