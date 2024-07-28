import type {
  AutoCompleteState,
  SuggestionItem,
} from "@scripts/autocomplete/basic/types";

import type { EventEmitter } from "@lib/event-emitter";

export enum AutoCompleteEventType {
  StateChanged = "state:change",
  InputChange = "input:change",
  InputClear = "input:clear",
  InputFocus = "input:focus",
  InputBlur = "input:blur",
  SuggestionsFetched = "data:fetched",
  SuggestionSelected = "suggestion:select",
  SuggestionHighlight = "suggestion:highlight",
  Error = "data:error",
}

export type AutoCompleteEventMap<T extends SuggestionItem> = {
  [K in keyof typeof AutoCompleteEventType]: unknown;
} & {
  [AutoCompleteEventType.StateChanged]: AutoCompleteState<T>;
  [AutoCompleteEventType.InputChange]: string;
  [AutoCompleteEventType.InputClear]: undefined;
  [AutoCompleteEventType.InputFocus]: undefined;
  [AutoCompleteEventType.InputBlur]: undefined;
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
  [AutoCompleteEventType.Error]: Error;
};

export type AutoCompleteEventEmitter<T extends SuggestionItem> = EventEmitter<
  AutoCompleteEventMap<T>
>;
