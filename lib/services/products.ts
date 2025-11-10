import { api } from "../api";

export interface PopularProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  tags: string[];
  images: string[];
  thumbnail: string;
  availabilityStatus?: string;
}

interface PopularProductsResponse {
  products: PopularProduct[];
  total: number;
  skip: number;
  limit: number;
}

export async function getPopularProducts(limit = 10) {
  const response = await api.get<PopularProductsResponse>("/products", {
    params: { limit },
  });

  return response.data.products ?? [];
}

export interface ProductDetail extends PopularProduct {
  sku: string;
  stock: number;
  brand: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  minimumOrderQuantity?: number;
  returnPolicy?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
}

export async function getProductById(id: number) {
  const response = await api.get<ProductDetail>(`/products/${id}`);
  return response.data;
}

export async function getProductCategories() {
  const response = await api.get<string[]>("/products/category-list");
  return response.data;
}

export interface ProductSearchResult {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  images: string[];
  description: string;
  rating: number;
  category: string;
}

interface ProductSearchResponse {
  products: ProductSearchResult[];
}

export async function searchProducts(query: string) {
  const response = await api.get<ProductSearchResponse>("/products/search", {
    params: { q: query },
  });

  return response.data.products ?? [];
}

interface ProductListResponse {
  products: PopularProduct[];
  total: number;
  limit: number;
  skip: number;
}

export interface ProductListParams {
  sortBy?: "title" | "price";
  order?: "asc" | "desc";
  limit?: number;
  skip?: number;
  category?: string;
}

export async function getProductsList(
  params: ProductListParams = {},
  category?: string
) {
  const targetCategory = category ?? params.category;
  const endpoint = targetCategory
    ? `/products/category/${targetCategory}`
    : "/products";
  const response = await api.get<ProductListResponse>(endpoint, {
    params: {
      limit: params.limit ?? 15,
      skip: params.skip ?? 0,
      ...(params.sortBy
        ? { sortBy: params.sortBy, order: params.order ?? "asc" }
        : {}),
    },
  });

  return response.data;
}
