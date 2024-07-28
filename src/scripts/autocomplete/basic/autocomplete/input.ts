import type { AutoCompleteEventEmitter } from "../../events";
import { AutoCompleteEventType } from "../../events";
import type { SuggestionItem } from "../types";

export interface InputOptions {
  placeholder?: string;
  minChars?: number;
}

export class AutoCompleteInputManager<T extends SuggestionItem> {
  private input: HTMLInputElement;
  private options: Required<InputOptions>;
  private eventEmitter: AutoCompleteEventEmitter<T>;

  constructor(
    container: HTMLElement,
    options: InputOptions,
    eventEmitter: AutoCompleteEventEmitter<T>
  ) {
    this.input = container.closest("input") as HTMLInputElement;
    this.eventEmitter = eventEmitter;
    this.options = this.mergeDefaultOptions(options);
    this.init();
  }

  private mergeDefaultOptions(options: InputOptions): Required<InputOptions> {
    return {
      placeholder: "",
      minChars: 1,
      ...options,
    };
  }

  private init() {
    this.input.placeholder = this.options.placeholder;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.input.addEventListener("input", this.handleInput.bind(this));
    this.input.addEventListener("focus", () =>
      this.eventEmitter.emit(AutoCompleteEventType.InputFocus)
    );
    this.input.addEventListener("blur", () =>
      this.eventEmitter.emit(AutoCompleteEventType.InputBlur)
    );
  }

  private handleInput() {
    const value = this.input.value.trim();
    if (value.length > this.options.minChars) {
      this.eventEmitter.emit(AutoCompleteEventType.InputChange, value);
    } else {
      this.eventEmitter.emit(AutoCompleteEventType.InputClear);
    }
  }

  public getValue() {
    return this.input.value;
  }

  public setValue(value: string) {
    this.input.value = value;
  }
}
