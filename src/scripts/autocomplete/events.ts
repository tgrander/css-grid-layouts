import type {
  AutoCompleteState,
  SuggestionItem,
} from "@scripts/autocomplete/basic/types";

import type { EventEmitter } from "@lib/event-emitter";

export enum AutoCompleteEventType {
  // State
  StateChanged = "state:change",
  // Input
  InputChange = "input:change",
  InputClear = "input:clear",
  InputFocus = "input:focus",
  InputBlur = "input:blur",
  // Suggestions
  SuggestionSelected = "suggestion:select",
  SuggestionHighlight = "suggestion:highlight",
  // Data
  SuggestionsFetched = "data:fetched",
  Error = "data:error",
  // Keydown
  KeydownUpArrow = "keydown:up",
  KeydownDownArrow = "keydown:down",
  KeydownDownEnter = "keydown:enter",
  KeydownDownDelete = "keydown:delete",
}

export type AutoCompleteEventMap<T extends SuggestionItem> = {
  [K in keyof typeof AutoCompleteEventType]: unknown;
} & {
  // State
  [AutoCompleteEventType.StateChanged]: AutoCompleteState<T>;
  // Input
  [AutoCompleteEventType.InputChange]: string;
  [AutoCompleteEventType.InputClear]: void;
  [AutoCompleteEventType.InputFocus]: void;
  [AutoCompleteEventType.InputBlur]: void;
  // Suggestions
  [AutoCompleteEventType.SuggestionsFetched]: T[];
  [AutoCompleteEventType.SuggestionSelected]: {
    item: T;
    index: number;
    element: HTMLElement;
  };
  [AutoCompleteEventType.SuggestionHighlight]: {
    index: number;
    element: HTMLElement;
  };
  // Data
  [AutoCompleteEventType.Error]: Error;
  // Keypress
  [AutoCompleteEventType.KeydownUpArrow]: void;
  [AutoCompleteEventType.KeydownDownArrow]: void;
  [AutoCompleteEventType.KeydownDownEnter]: void;
  [AutoCompleteEventType.KeydownDownDelete]: void;
};

export type AutoCompleteEventEmitter<T extends SuggestionItem> = EventEmitter<
  AutoCompleteEventMap<T>
>;
