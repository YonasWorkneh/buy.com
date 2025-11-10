"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  createProduct,
  type CreateProductPayload,
  type CreateProductResponse,
} from "@/lib/services/products";

type UseCreateProductOptions = UseMutationOptions<
  CreateProductResponse,
  Error,
  CreateProductPayload
>;

export default function useCreateProduct(options?: UseCreateProductOptions) {
  return useMutation({
    mutationFn: createProduct,
    ...options,
  });
}
