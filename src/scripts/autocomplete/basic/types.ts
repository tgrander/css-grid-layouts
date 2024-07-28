export interface AutoCompleteState<T extends SuggestionItem> {
  isLoading: boolean;
  error: Error | null;
  suggestions: T[];
  selectedIndex: number;
}

export interface SuggestionItem {
  id: string | number; // Unique identifier for the item
  value: string; // The main value to be displayed and used for filtering
  label?: string; // Optional label that can be different from the value
  data?: any; // Optional additional data associated with the item
}
