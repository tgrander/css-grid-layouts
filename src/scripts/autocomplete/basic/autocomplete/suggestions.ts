import type { AutoCompleteEventEmitter } from "../../events";
import { AutoCompleteEventType } from "../../events";
import type { SuggestionItem } from "../types";

export interface SuggestionsOptions<T extends SuggestionItem> {
  renderItem?: (item: T) => string;
  maxItems?: number;
  defaultItems?: T[];
}

interface State {
  isOpen: boolean;
  currentHighlight: number;
  currentSelected: number;
  currentSelectedElement: HTMLElement | null;
}

export class AutoCompleteSuggestionsManager<T extends SuggestionItem> {
  private container: HTMLElement;
  private options: Required<SuggestionsOptions<T>>;
  private isOpen: boolean = false;
  private currentHighlight: number = 0;
  private currentSelected: number = -1;
  private currentSelectedElement: HTMLElement | null = null;
  private eventEmitter: AutoCompleteEventEmitter<T>;

  constructor(
    container: HTMLElement,
    options: SuggestionsOptions<T>,
    eventEmitter: AutoCompleteEventEmitter<T>
  ) {
    this.container = container;
    this.eventEmitter = eventEmitter;
    this.options = this.mergeDefaultOptions(options);
    this.init();
  }

  private mergeDefaultOptions(
    options: SuggestionsOptions<T>
  ): Required<SuggestionsOptions<T>> {
    return {
      renderItem: (item: T) => `<div>${item.value}</div>`,
      maxItems: 50,
      defaultItems: [],
      ...options,
    };
  }

  private init() {
    this.createItems(this.options.defaultItems);
    this.setupEventListeners();
  }

  public createItems(suggestions: T[]) {
    if (suggestions.length === 0) {
      return;
    }
    this.container.innerHTML = "";
    suggestions.slice(0, this.options.maxItems).forEach((item, index) => {
      const li = document.createElement("li");
      li.id = getItemId(index);
      li.classList.add("autocomplete__suggestion-item");
      li.role = "option";
      li.dataset.index = index.toString();
      li.innerHTML = this.options.renderItem(item);

      li.addEventListener("click", () => this.handleItemClick(item, index, li));
      li.addEventListener("mouseover", () => this.highlightItem(index));
      this.container.appendChild(li);
    });
  }

  private setupEventListeners() {
    // Render default items on input clear
    this.eventEmitter.on(AutoCompleteEventType.InputClear, () =>
      this.render(this.options.defaultItems)
    );
    // Open suggestions list on focus
    this.eventEmitter.on(AutoCompleteEventType.InputFocus, () => {
      this.open();
    });
  }

  private handleItemClick(item: T, index: number, element: HTMLElement) {
    // Emit event
    this.eventEmitter.emit(AutoCompleteEventType.SuggestionSelected, {
      item,
      index,
      element,
    });
    // Remove check icon from prev selected and add to new
    if (this.currentSelectedElement)
      this.removeCheckIconFromItem(this.currentSelectedElement);
    this.addCheckIconToItem(element);
    // Update state
    this.currentSelected = index;
    this.currentSelectedElement = element;
  }

  private addCheckIconToItem(itemElement: HTMLElement) {
    if (!itemElement) return;
    const iconWrapper = document.createElement("span");
    iconWrapper.classList.add("icon", "icon-selected");
    iconWrapper.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      `;
    itemElement.appendChild(iconWrapper);
  }

  private removeCheckIconFromItem(itemElement: HTMLElement) {
    const checkIcon = itemElement.querySelector(".icon-selected");
    checkIcon?.remove();
  }

  /**
   * Public Methods
   */
  public render(suggestions: T[]) {
    this.createItems(suggestions);
    this.open();
  }

  public open() {
    if (!this.isOpen) {
      this.container.classList.add("show");
      this.container.setAttribute("aria-hidden", "false");

      this.isOpen = true;
      this.highlightItem(this.currentSelected ?? this.currentHighlight);
    }
  }

  public close() {
    if (this.isOpen) {
      this.container.classList.remove("show");
      this.container.setAttribute("aria-hidden", "true");
      this.isOpen = false;
    }
  }

  public highlightItem(index: number) {
    const items = Array.from(this.container.children) as HTMLElement[];
    items.forEach((item, i) => {
      if (index === i) {
        item.classList.add("highlighted");
      } else {
        item.classList.remove("highlighted");
      }
    });

    this.currentHighlight = index;
    this.eventEmitter.emit(AutoCompleteEventType.SuggestionHighlight, {
      index,
      element: items[index],
    });
  }

  public state(): State {
    return {
      isOpen: this.isOpen,
      currentHighlight: this.currentHighlight,
      currentSelected: this.currentSelected,
      currentSelectedElement: this.currentSelectedElement,
    };
  }
}

function getItemId(index: number) {
  return `item-${index + 1}`;
}
