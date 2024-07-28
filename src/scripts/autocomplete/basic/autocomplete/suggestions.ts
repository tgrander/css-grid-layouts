import { AutoCompleteEventType } from "../../events";
import type { EventEmitter } from "@lib/event-emitter";
import type { SuggestionItem } from "../types";

export interface SuggestionsOptions<T extends SuggestionItem> {
  renderItem?: (item: T) => string;
  maxItems?: number;
  defaultItems?: T[];
}

export class AutoCompleteSuggestionsManager<T extends SuggestionItem> {
  private container: HTMLElement;
  private options: Required<SuggestionsOptions<T>>;
  private isOpen: boolean = false;
  private currentHighlight: number = 0;
  private currentSelected: number | null = null;
  private eventEmitter: EventEmitter;

  constructor(
    container: HTMLElement,
    options: SuggestionsOptions<T>,
    eventEmitter: EventEmitter
  ) {
    this.container = container;
    console.log("this.container :>> ", this.container);
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
      console.log("input focus event");
      this.open();
    });
  }

  private handleItemClick(item: T, index: number, el: HTMLElement) {
    this.currentSelected = index;
    this.addCheckIcon(this.currentSelected);
    this.eventEmitter.emit(AutoCompleteEventType.SuggestionSelected, item);
  }

  private addCheckIcon(index: number) {
    const li = this.container.querySelector(`#${getItemId(index)}`);
    if (li) {
      const checkIcon = document.createElement("span");
      checkIcon.classList.add("icon", "icon-selected");
      checkIcon.innerHTML = `
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
      li.appendChild(checkIcon);
    }
  }

  private removeCheckIcon(index: number) {
    const li = this.container.querySelector(`#${getItemId(index)}`);
  }

  public render(suggestions: T[]) {
    this.createItems(suggestions);
    this.open();
  }

  public open() {
    if (!this.isOpen) {
      this.container.classList.add("show");
      this.container.setAttribute("aria-hidden", "false");

      this.isOpen = true;
      this.highlightItem(this.currentHighlight ?? this.currentHighlight);
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
    this.eventEmitter.emit(AutoCompleteEventType.SuggestionHighlight, index);
  }
}

function getItemId(index: number) {
  return `item-${index + 1}`;
}
