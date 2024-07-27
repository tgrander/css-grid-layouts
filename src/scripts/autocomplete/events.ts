export enum AutoCompleteEventType {
  StateChanged = "state:change",
  InputChange = "input:change",
  InputFocus = "input:focus",
  InputBlur = "input:blur",
  SuggestionsFetched = "data:fetched",
  SuggestionSelected = "suggestion:select",
  Error = "data:error",
}
