import type { ProduceItem } from "@data/produce";
import produceItems from "@data/produce";
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
  suggestions: {
    defaultItems: produceItems,
  },
});
