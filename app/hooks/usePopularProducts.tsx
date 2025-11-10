"use client";
import { useQuery } from "@tanstack/react-query";
import { getPopularProducts, type PopularProduct } from "@/lib/api";

interface UsePopularProductsResult {
  products: PopularProduct[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function usePopularProducts(
  limit = 10
): UsePopularProductsResult {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["popularProducts", limit],
    queryFn: () => getPopularProducts(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    products,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
