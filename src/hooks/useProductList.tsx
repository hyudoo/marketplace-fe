import React from "react";
export type Product = {
  name: string;
};

export type UseProductListProps = {
  /** Delay to wait before fetching more items */
  fetchDelay?: number;
};

export function useProductList({ fetchDelay = 0 }: UseProductListProps = {}) {
  const [items, setItems] = React.useState<Product[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const limit = 10; // Number of items per page, adjust as necessary

  const loadProduct = async (currentOffset: number) => {
    const controller = new AbortController();
    const { signal } = controller;

    try {
      setIsLoading(true);

      if (offset > 0) {
        // Delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, fetchDelay));
      }

      let res = await fetch(
        `https://pokeapi.co/api/v2/Product?offset=${currentOffset}&limit=${limit}`,
        { signal }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      let json = await res.json();

      setHasMore(json.next !== null);
      // Append new results to existing ones
      setItems((prevItems) => [...prevItems, ...json.results]);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("There was an error with the fetch operation:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadProduct(offset);
  }, []);

  const onLoadMore = () => {
    const newOffset = offset + limit;

    setOffset(newOffset);
    loadProduct(newOffset);
  };

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
  };
}
