import type {
  DataProviderOptions,
  InputOptions,
  SuggestionsOptions,
} from "./autocomplete/";
import {
  AutoCompleteDataProvider,
  AutoCompleteInputManager,
  AutoCompleteSuggestionsManager,
} from "./autocomplete/index";

import { EventEmitter } from "@lib/event-emitter";
import type { SuggestionItem } from "./types";

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
  private eventEmitter: EventEmitter;

  constructor(container: HTMLElement, options: AutoCompleteOptions<T>) {
    this.container = container;

    // Event Emitter
    const eventEmitter = new EventEmitter();
    this.eventEmitter = eventEmitter;

    // Options
    this.options = {
      input: {},
      suggestions: {},
      ...options,
    };

    // Get container elements
    const inputContainer = this.container.querySelector(
      ".autocomplete__search-input"
    ) as HTMLElement;
    const suggestionsContainer = this.container.querySelector(
      ".autocomplete__suggestions-container"
    ) as HTMLElement;

    // Initialize sub-component manager classes
    // Input field
    this.inputManager = new AutoCompleteInputManager(
      inputContainer,
      this.options.input,
      this.eventEmitter
    );
    // Suggestions list
    this.suggestionsManager = new AutoCompleteSuggestionsManager(
      suggestionsContainer,
      this.options.suggestions,
      this.eventEmitter
    );
    // Data source
    this.dataProvider = new AutoCompleteDataProvider<T>(
      this.options.data,
      this.eventEmitter
    );
  }
}

export default AutoComplete;
