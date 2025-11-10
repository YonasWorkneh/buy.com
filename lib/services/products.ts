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

