"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  type UpdateProductPayload,
  updateProduct,
  type CreateProductResponse,
} from "@/lib/services/products";

interface UpdateProductVariables {
  id: number;
  payload: UpdateProductPayload;
  method?: "patch" | "put";
}

type UseUpdateProductOptions = UseMutationOptions<
  CreateProductResponse,
  Error,
  UpdateProductVariables
>;

export default function useUpdateProduct(options?: UseUpdateProductOptions) {
  return useMutation({
    mutationFn: ({ payload, method = "patch" }) =>
      updateProduct(1, payload, method),
    ...options,
  });
}
