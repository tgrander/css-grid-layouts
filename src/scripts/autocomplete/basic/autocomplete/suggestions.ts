import type { EventEmitter } from "@lib/event-emitter";
import type { SuggestionItem } from "../types";

export interface SuggestionsOptions<T extends SuggestionItem> {
  eventEmitter: EventEmitter;

  defaultItems?: T[];
  renderItem?: (item: T) => string;

  onSelect?: (item: T) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export class AutoCompleteSuggestionsManager<T extends SuggestionItem> {
  private suggestionsContainer: HTMLElement;
  private options: Required<SuggestionsOptions<T>>;
  private currentSuggestions: T[] = [];
  private items: HTMLLIElement[] = [];
  private selectedItemIndex: number | null = null;

  constructor(
    suggestionsContainer: HTMLElement,
    options: SuggestionsOptions<T>
  ) {
    this.suggestionsContainer = suggestionsContainer;
    this.options = {
      defaultItems: [],
      renderItem: this.defaultRenderItem,
      onSelect: () => {},
      onOpen: () => {},
      onClose: () => {},
      ...options,
    };

    this.currentSuggestions = this.options.defaultItems;

    this.renderSuggestionItems();
  }

  private renderSuggestionItems() {
    this.items = [];
    const listItems = document.createDocumentFragment();

    // Create LI elements
    this.currentSuggestions.forEach((item, index) => {
      const li = document.createElement("li");
      li.id = `item-${index + 1}`;
      li.classList.add("autocomplete__suggestion-item");
      li.role = "option";
      li.innerHTML = this.options.renderItem(item);

      listItems.appendChild(li);
      this.items.push(li);
    });

    // Recreate ul
    this.suggestionsContainer.innerHTML = "";
    const ul = document.createElement("ul");
    ul.classList.add("autocomplete__suggestions");
    ul.id = "autocomplete__suggestions-list";
    ul.role = "listbox";

    // Append list items
    ul.appendChild(listItems);
    this.suggestionsContainer.appendChild(ul);

    // Setup event listeners
    this.suggestionsContainer.removeEventListener(
      "click",
      this.handleClickItem.bind(this)
    );
    this.suggestionsContainer.addEventListener(
      "click",
      this.handleClickItem.bind(this)
    );
  }

  private handleClickItem(event: Event) {
    const target = event.target as HTMLElement;
    const li = target.closest("li") as HTMLLIElement;

    if (li) {
      const index = this.items.findIndex((item) => item === li);
      if (index < 0) {
        throw `No item found at index ${index}`;
      }

      this.selectItem(index);
    }
  }

  private selectItem(selectedIndex: number) {
    this.selectedItemIndex = selectedIndex;

    this.options.onSelect(this.currentSuggestions[this.selectedItemIndex]);

    this.items.forEach((item, index) => {
      item.classList.toggle("selected", index === selectedIndex);
    });
  }

  private defaultRenderItem(item: T) {
    if (typeof item === "string") return item;
    else if (typeof item === "object" && item !== null) {
      return JSON.stringify(item);
    }
    return String(item);
  }

  public open() {
    this.suggestionsContainer.classList.remove("hidden");
    this.options.onOpen();
  }

  public close() {
    this.suggestionsContainer.classList.add("hidden");
    this.options.onClose();
  }
}
