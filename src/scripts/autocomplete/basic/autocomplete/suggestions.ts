import type { EventEmitter } from "@lib/event-emitter";
import type { SuggestionItem } from "../types";

export interface SuggestionsOptions<T extends SuggestionItem> {
  defaultItems?: T[];
  renderItem?: (item: T) => string | HTMLElement;
  itemClassName?: string;
  selectedItemClassName?: string;

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
  private focusedItemIndex: number = 0;
  private eventEmitter: EventEmitter;

  constructor(
    suggestionsContainer: HTMLElement,
    options: SuggestionsOptions<T>,
    eventEmitter: EventEmitter
  ) {
    this.suggestionsContainer = suggestionsContainer;

    this.eventEmitter = eventEmitter;

    this.options = {
      defaultItems: [],
      itemClassName: "autocomplete__suggestion-item",
      selectedItemClassName: "autocomplete__suggestion-item--selected",
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
      li.classList.add(this.options.itemClassName);
      li.role = "option";

      const renderedItem = this.options.renderItem(item);
      if (typeof renderedItem === "string") {
        li.innerHTML = renderedItem;
      } else {
        li.appendChild(renderedItem);
      }

      listItems.appendChild(li);
      this.items.push(li);
    });

    // Create ul
    this.suggestionsContainer.innerHTML = "";
    const ul = document.createElement("ul");
    ul.classList.add("autocomplete__suggestions");
    ul.id = "autocomplete__suggestions-list";
    ul.role = "listbox";
    ul.style.listStyleType = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";

    // Append list items
    ul.appendChild(listItems);
    this.suggestionsContainer.appendChild(ul);

    // Focus first item
    this.updateFocusedItem();

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.suggestionsContainer.removeEventListener(
      "click",
      this.handleClickItem.bind(this)
    );
    this.suggestionsContainer.addEventListener(
      "click",
      this.handleClickItem.bind(this)
    );

    // Add mouseover event listener
    this.suggestionsContainer.removeEventListener(
      "mouseover",
      this.handleMouseOver.bind(this)
    );
    this.suggestionsContainer.addEventListener(
      "mouseover",
      this.handleMouseOver.bind(this)
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

  private handleMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const li = target.closest("li");

    if (li && this.items.includes(li)) {
      const index = this.items.indexOf(li);
      if (index !== -1) {
        this.focusedItemIndex = index;
        this.updateFocusedItem();
      }
    }
  }

  private selectItem(selectedIndex: number) {
    this.selectedItemIndex = selectedIndex;

    this.options.onSelect(this.currentSuggestions[this.selectedItemIndex]);

    this.items.forEach((item, index) => {
      item.classList.toggle(
        this.options.selectedItemClassName,
        index === selectedIndex
      );
    });
  }

  private updateFocusedItem() {
    this.items.forEach((item, index) => {
      item.classList.toggle(
        "autocomplete__suggestion-item--focused",
        index === this.focusedItemIndex
      );
    });
  }

  private defaultRenderItem(item: T): string {
    if (typeof item === "string") return item;
    else if (typeof item === "object" && item !== null) {
      return JSON.stringify(item);
    }
    return String(item);
  }

  public open() {
    this.suggestionsContainer.classList.add("show");
    this.options.onOpen();
  }

  public close() {
    this.suggestionsContainer.classList.remove("show");
    this.options.onClose();
  }
}
