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
      li.id = `item-${index + 1}`;
      li.classList.add("autocomplete__suggestion-item");
      li.role = "option";
      li.dataset.index = index.toString();
      li.innerHTML = this.options.renderItem(item);

      li.addEventListener("click", () => this.handleItemClick(item, index));
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

  private handleItemClick(item: T, index: number) {
    this.eventEmitter.emit(AutoCompleteEventType.SuggestionSelected, item);
    this.currentSelected = index;
  }

  private getItems() {
    return Array.from(this.container.children) as HTMLElement[];
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
    this.getItems().forEach((item, i) => {
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
