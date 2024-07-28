import AutoComplete from "./autocomplete";
import type { ProduceItem } from "@data/produce";
import type { SuggestionItem } from "./types";
import html from "noop-tag";
import produceItems from "@data/produce";

const container = document.querySelector(
  ".autocomplete__container"
) as HTMLElement;

const produceDataSource = async (query: string): Promise<ProduceItem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const lowercaseQuery = query.toLowerCase();

  return produceItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
  );
};

interface Produce extends SuggestionItem {
  data: ProduceItem;
}

const items: Produce[] = produceItems.map((produce) => ({
  id: produce.id,
  value: produce.name,
  label: produce.name,
  data: produce,
}));

const autocomplete = new AutoComplete<Produce>(container, {
  data: {
    dataSource: produceDataSource,
  },
  input: {
    placeholder: "Search produce...",
  },
  suggestions: {
    defaultItems: produceItems,
    renderItem: (item: Produce) =>
      html`
        <div class="produce-item__container">
          <div class="produce-item__image ">${item.data.emoji}</div>
          <div class="produce-item__data">
            <p class="produce-item__name">${item.data.name}</p>
            <p class="produce-item__category">${item.data.category}</p>
          </div>
        </div>
      `,
  },
});
