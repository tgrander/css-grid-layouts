import type { ProduceItem } from "@data/produce";
import produceItems from "@data/produce";
import html from "noop-tag";
import AutoComplete from "./autocomplete";

// Container Element
const container = document.querySelector(
  ".autocomplete__container"
) as HTMLElement;

// Data Source Function
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

const autocomplete = new AutoComplete<ProduceItem>(container, {
  data: {
    dataSource: produceDataSource,
  },
  input: {
    placeholder: "Search produce...",
  },
  suggestions: {
    defaultItems: produceItems,
    renderItem: (item) =>
      html`
        <div class="produce-item__container">
          <div class="produce-item__image ">${item.emoji}</div>
          <div class="produce-item__data">
            <p class="produce-item__name">${item.name}</p>
            <p class="produce-item__category">${item.category}</p>
          </div>
        </div>
      `,
  },
});
