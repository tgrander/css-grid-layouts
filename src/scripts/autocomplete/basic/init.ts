import AutoComplete from "./autocomplete";
import type { ProduceItem } from "@data/produce";
import type { SuggestionItem } from "./types";
import html from "noop-tag";
import produce from "@data/produce";

interface ProduceSuggestionItem extends SuggestionItem {
  data: ProduceItem;
}

const container = document.querySelector(
  ".autocomplete__container"
) as HTMLElement;

const produceDataSource = async (
  query: string
): Promise<ProduceSuggestionItem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const lowercaseQuery = query.toLowerCase();

  return produce
    .filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery)
    )
    .map(convertToSuggestionItem);
};

const autocomplete = new AutoComplete<ProduceSuggestionItem>(container, {
  data: {
    dataSource: produceDataSource,
  },
  input: {
    placeholder: "Search produce...",
  },
  suggestions: {
    defaultItems: produce.map(convertToSuggestionItem),
    renderItem: (item) =>
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

function convertToSuggestionItem(produce: ProduceItem): ProduceSuggestionItem {
  return {
    id: produce.id,
    value: produce.name,
    label: produce.name,
    data: produce,
  };
}
