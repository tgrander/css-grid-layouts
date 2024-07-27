/**
 * AUTOCOMPLETE
 * a.k.a ComboBox
 *
 * Trigger element
 *  - Opens drop down menu on trigger (e.g. click, hover)
 *  - Can be an Input field or a button that opens a dropdown menu and displays an input field
 *
 *
 * Requirements
 * 1. A user can enter a search term in an input field
 * 2. As they type, options are filtered and displayed based on input value
 */

/**
 * INPUT MANAGER
 */
interface InputOptions {
  placeholder?: string;
  defaultValue?: string;
  class?: string | null;
  onChange?: (e: Event) => void;
}

class AutoCompleteInputManager {
  private input: HTMLInputElement;
  private options: Required<InputOptions>;

  constructor(container: HTMLElement, options: InputOptions) {
    this.input = container.closest("input") as HTMLInputElement;
    if (!this.input) {
      throw Error(
        `Input element not found within container element: ${container}`
      );
    }

    this.options = {
      placeholder: "",
      defaultValue: "",
      class: null,
      onChange: () => {},
      ...options,
    };

    this.input.placeholder = this.options.placeholder;
    this.input.value = this.options.defaultValue;

    this.input.addEventListener("input", this.handleInputChange.bind(this));
  }

  public getValue() {
    return this.input.value;
  }

  public setValue(value: string) {
    this.input.value = value;
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;

    this.setValue(target.value);
    this.options.onChange(event);
  }
}

/**
 * SUGGESTIONS LIST
 */
type SuggestionItem = unknown;

interface SuggestionsOptions<T extends SuggestionItem> {
  defaultItems?: T[];
  onSelect?: (item: T) => void;
  renderItem?: (item: T) => string;
}

class AutoCompleteSuggestionsManager<T extends SuggestionItem> {
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
      onSelect: () => {},
      renderItem: this.defaultRenderItem,
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
}

/**
 * DATA SOURCE
 */
type DataSourceFunction<T extends SuggestionItem> = (
  query: string
) => Promise<T[]>;

interface DataProviderOptions<T extends SuggestionItem> {
  dataSource: DataSourceFunction<T>;
  debounceTime?: number | null;
}

class AutoCompleteDataProvider<T extends SuggestionItem> {
  private options: Required<DataProviderOptions<T>>;
  private debounceTimer: number | null = null;

  constructor(options: DataProviderOptions<T>) {
    this.options = {
      debounceTime: null,
      ...options,
    };
  }

  public async fetchSuggestions(query: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (this.options.debounceTime) {
        if (this.debounceTimer !== null) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = window.setTimeout(async () => {
          try {
            const results = await this.options.dataSource(query);
            resolve(results);
          } catch (error) {
            reject(error);
          }
        }, this.options.debounceTime);
      }
    });
  }
}

/**
 * CONTROLLER
 */
interface AutoCompleteOptions<T extends SuggestionItem> {
  data: DataProviderOptions<T>;
  input?: InputOptions;
  suggestions?: SuggestionsOptions<T>;
}

class AutoComplete<T extends SuggestionItem> {
  private container: HTMLElement;
  private options: Required<AutoCompleteOptions<T>>;
  private inputManager: AutoCompleteInputManager;
  private suggestionsManager: AutoCompleteSuggestionsManager<T>;
  private dataProvider: AutoCompleteDataProvider<T>;

  constructor(container: HTMLElement, options: AutoCompleteOptions<T>) {
    this.container = container;
    this.options = {
      input: {},
      suggestions: {},
      ...options,
    };

    // Get container elements
    const inputContainer = this.container.querySelector(
      ".autocomplete__search-input-container"
    ) as HTMLElement;
    const suggestionsContainer = this.container.querySelector(
      ".autocomplete__suggestions-container"
    ) as HTMLElement;

    // Initialize sub-component manager classes
    // Input field
    this.inputManager = new AutoCompleteInputManager(
      inputContainer,
      this.options.input
    );
    // Suggestions list
    this.suggestionsManager = new AutoCompleteSuggestionsManager(
      suggestionsContainer,
      this.options.suggestions
    );
    // Data source
    this.dataProvider = new AutoCompleteDataProvider<T>(this.options.data);
  }
}

export default AutoComplete;
