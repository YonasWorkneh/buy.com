"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchProducts,
  type ProductSearchResult,
} from "@/lib/services/products";

export function useProductSearch(query: string) {
  const trimmedQuery = useMemo(() => query.trim(), [query]);

  const result = useQuery<ProductSearchResult[]>({
    queryKey: ["product-search", trimmedQuery],
    queryFn: () => searchProducts(trimmedQuery),
    enabled: trimmedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...result,
    results: result.data ?? [],
    isSearching: result.isFetching,
  };
}
