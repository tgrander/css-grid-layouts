import type { AutoCompleteEventEmitter } from "../../events";
import { AutoCompleteEventType } from "../../events";
import type { SuggestionItem } from "../types";

export class AutoCompleteKeypressManager<T extends SuggestionItem> {
  private inputElement: HTMLElement;
  private eventEmitter: AutoCompleteEventEmitter<T>;

  constructor(
    inputElement: HTMLElement,
    eventEmitter: AutoCompleteEventEmitter<T>
  ) {
    this.inputElement = inputElement;
    this.eventEmitter = eventEmitter;
    this.addEventListeners();
  }

  private addEventListeners() {
    this.inputElement.addEventListener(
      "keydown",
      this.handleKeyDown.bind(this)
    );
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        this.eventEmitter.emit(AutoCompleteEventType.KeydownDownEnter);
        break;
      case "ArrowDown":
        this.eventEmitter.emit(AutoCompleteEventType.KeydownDownArrow);
        break;
      case "ArrowUp":
        this.eventEmitter.emit(AutoCompleteEventType.KeydownUpArrow);
        break;
      case "Backspace":
        this.eventEmitter.emit(AutoCompleteEventType.KeydownDownDelete);
        break;
      default:
        break;
    }
  }
}
