"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { deleteProduct } from "@/lib/services/products";

type UseDeleteProductOptions = UseMutationOptions<void, Error, number>;

export default function useDeleteProduct(
  options?: UseDeleteProductOptions
) {
  return useMutation({
    mutationFn: () => deleteProduct(1),
    ...options,
  });
}


