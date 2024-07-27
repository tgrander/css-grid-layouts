export interface InputOptions {
  placeholder?: string;
  defaultValue?: string;
  class?: string | null;
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export class AutoCompleteInputManager {
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
      onFocus: () => {},
      onBlur: () => {},
      ...options,
    };

    this.input.placeholder = this.options.placeholder;
    this.input.value = this.options.defaultValue;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.input.addEventListener("input", this.handleInputChange.bind(this));
    this.input.addEventListener("focus", this.handleOnFocus.bind(this));
    this.input.addEventListener("blur", this.handleOnBlur.bind(this));
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

  private handleOnFocus(event: Event) {
    this.options.onFocus(event);
  }

  private handleOnBlur(event: Event) {
    this.options.onBlur(event);
  }
}
