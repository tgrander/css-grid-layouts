import {
  AutoCompleteDataProvider,
  AutoCompleteInputManager,
  AutoCompleteSuggestionsManager,
} from "./autocomplete/index";
import type { AutoCompleteState, SuggestionItem } from "./types";
import type {
  DataProviderOptions,
  InputOptions,
  SuggestionsOptions,
} from "./autocomplete/";

import type { AutoCompleteEventMap } from "../events";
import { AutoCompleteEventType } from "../events";
import { EventEmitter } from "@lib/event-emitter";

interface AutoCompleteOptions<T extends SuggestionItem> {
  data: DataProviderOptions<T>;
  input?: InputOptions;
  suggestions?: SuggestionsOptions<T>;
}

class AutoComplete<T extends SuggestionItem> {
  private container: HTMLElement;
  private options: Required<AutoCompleteOptions<T>>;
  private inputManager!: AutoCompleteInputManager;
  private suggestionsManager!: AutoCompleteSuggestionsManager<T>;
  private dataProvider!: AutoCompleteDataProvider<T>;
  private eventEmitter: EventEmitter<AutoCompleteEventMap<T>>;
  private state: AutoCompleteState<T> = {
    isLoading: false,
    error: null,
    suggestions: [],
    selectedIndex: -1,
  };

  constructor(container: HTMLElement, options: AutoCompleteOptions<T>) {
    this.container = container;
    this.eventEmitter = new EventEmitter();
    this.options = this.mergeDefaultOptions(options);

    this.initializeManagers();
    this.setupEventListeners();
  }

  private mergeDefaultOptions(
    options: AutoCompleteOptions<T>
  ): Required<AutoCompleteOptions<T>> {
    return {
      input: {},
      suggestions: {},
      ...options,
    };
  }

  private initializeManagers() {
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
    this.suggestionsManager = new AutoCompleteSuggestionsManager<T>(
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

  private setupEventListeners() {
    this.eventEmitter.on(
      AutoCompleteEventType.InputFocus,
      this.handleInputFocus.bind(this)
    );
    this.eventEmitter.on(
      AutoCompleteEventType.InputBlur,
      this.handleInputBlur.bind(this)
    );
    this.eventEmitter.on(
      AutoCompleteEventType.InputChange,
      this.handleInputChange.bind(this)
    );
    this.eventEmitter.on(
      AutoCompleteEventType.SuggestionsFetched,
      this.handleSuggestionsFetched.bind(this)
    );
    this.eventEmitter.on(
      AutoCompleteEventType.SuggestionSelected,
      this.handleSuggestionSelected.bind(this)
    );
    this.eventEmitter.on(
      AutoCompleteEventType.Error,
      this.handleError.bind(this)
    );
  }

  private handleInputFocus() {
    this.suggestionsManager.open();
  }

  private handleInputBlur() {
    // Add a small delay to allow for suggestion selection
    setTimeout(() => this.suggestionsManager.close(), 200);
  }

  private handleInputChange(query: string) {
    this.setState({ isLoading: true, error: null });
    this.dataProvider.fetchSuggestions(query);
  }

  private handleSuggestionsFetched(suggestions: T[]) {
    this.setState({ isLoading: false, suggestions });
    this.suggestionsManager.render(suggestions);
  }

  private handleSuggestionSelected(
    data: AutoCompleteEventMap<T>[AutoCompleteEventType.SuggestionSelected]
  ) {
    this.inputManager.setValue(data.item.value);
    this.suggestionsManager.close();
  }

  private handleError(error: Error) {
    this.setState({ isLoading: false, error });
  }

  private setState(partialState: Partial<AutoCompleteState<T>>) {
    this.state = {
      ...this.state,
      ...partialState,
    };
    this.eventEmitter.emit(AutoCompleteEventType.StateChanged, this.state);
  }
}

export default AutoComplete;
