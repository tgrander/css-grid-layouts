import type { EventEmitter } from "@lib/event-emitter";
import { AutoCompleteEventType } from "../../events";
import type { SuggestionItem } from "../types";

export interface SuggestionsOptions<T extends SuggestionItem> {
  renderItem?: (item: T) => string;
  maxItems?: number;
}

export class AutoCompleteSuggestionsManager<T extends SuggestionItem> {
  private container: HTMLElement;
  private options: Required<SuggestionsOptions<T>>;
  private isOpen: boolean = false;
  private currentHighlight: number = -1;
  private eventEmitter: EventEmitter;

  constructor(
    container: HTMLElement,
    options: SuggestionsOptions<T>,
    eventEmitter: EventEmitter
  ) {
    this.container = container;
    this.eventEmitter = eventEmitter;
    this.options = this.mergeDefaultOptions(options);
  }

  private mergeDefaultOptions(
    options: SuggestionsOptions<T>
  ): Required<SuggestionsOptions<T>> {
    return {
      renderItem: (item: T) => `<div>${item.value}</div>`,
      maxItems: 50,
      ...options,
    };
  }

  public render(suggestions: T[]) {
    this.container.innerHTML = "";
    suggestions.slice(0, this.options.maxItems).forEach((item, index) => {
      const li = document.createElement("li");
      li.id = `item-${index + 1}`;
      li.classList.add("autocomplete__suggestion-item");
      li.role = "option";
      li.dataset.index = index.toString();
      li.innerHTML = this.options.renderItem(item);

      li.addEventListener("click", () => this.handleItemClick(item));
      li.addEventListener("mouseover", () => this.highlightItem(index));
      this.container.appendChild(li);
    });

    this.open();
  }

  private handleItemClick(item: T) {
    this.eventEmitter.emit(AutoCompleteEventType.SuggestionSelected, item);
  }

  public open() {
    if (!this.isOpen) this.container.classList.add("show");
    this.isOpen = true;
    this.highlightItem(0);
  }

  public close() {
    this.container.classList.remove("show");
    this.isOpen = false;
    this.highlightItem(-1);
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
