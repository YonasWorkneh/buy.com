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

