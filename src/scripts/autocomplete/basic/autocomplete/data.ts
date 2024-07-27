import type { EventEmitter } from "@lib/event-emitter";
import type { SuggestionItem } from "../types";

export type DataSourceFunction<T extends SuggestionItem> = (
  query: string
) => Promise<T[]>;

export interface DataProviderOptions<T extends SuggestionItem> {
  dataSource: DataSourceFunction<T>;
  debounceTime?: number | null;
}

export class AutoCompleteDataProvider<T extends SuggestionItem> {
  private options: Required<DataProviderOptions<T>>;
  private debounceTimer: number | null = null;
  private eventEmitter: EventEmitter;

  constructor(options: DataProviderOptions<T>, eventEmitter: EventEmitter) {
    this.options = {
      debounceTime: null,
      ...options,
    };

    this.eventEmitter = eventEmitter;
  }

  public async fetchSuggestions(query: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (this.options.debounceTime) {
        if (this.debounceTimer !== null) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = window.setTimeout(async () => {
          try {
            const results = await this.options.dataSource(query);
            resolve(results);
          } catch (error) {
            reject(error);
          }
        }, this.options.debounceTime);
      }
    });
  }
}
