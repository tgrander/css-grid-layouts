import type { AutoCompleteEventEmitter } from "../../events";
import { AutoCompleteEventType } from "../../events";
import type { SuggestionItem } from "../types";

export type DataSourceFunction<T extends SuggestionItem> = (
  query: string
) => Promise<T[]>;

export interface DataProviderOptions<T extends SuggestionItem> {
  dataSource: DataSourceFunction<T>;
  debounceTime?: number;
}

export class AutoCompleteDataProvider<T extends SuggestionItem> {
  private options: Required<DataProviderOptions<T>>;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private eventEmitter: AutoCompleteEventEmitter<T>;

  constructor(
    options: DataProviderOptions<T>,
    eventEmitter: AutoCompleteEventEmitter<T>
  ) {
    this.options = {
      debounceTime: 100,
      ...options,
    };
    this.eventEmitter = eventEmitter;
  }

  public async fetchSuggestions(query: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      try {
        const suggestions = await this.options.dataSource(query);
        this.eventEmitter.emit(
          AutoCompleteEventType.SuggestionsFetched,
          suggestions
        );
      } catch (error) {
        this.eventEmitter.emit(AutoCompleteEventType.Error, error as Error);
      }
    }, this.options.debounceTime);
  }
}
