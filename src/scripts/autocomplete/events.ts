export enum AutoCompleteEventType {
  StateChanged = "state:change",
  InputChange = "input:change",
  InputClear = "input:clear",
  InputFocus = "input:focus",
  InputBlur = "input:blur",
  SuggestionsFetched = "data:fetched",
  SuggestionSelected = "suggestion:select",
  Error = "data:error",
}
