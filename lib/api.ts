const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL (or API_BASE_URL) environment variable."
  );
}

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
  const url = new URL("/products", BASE_API_URL);
  url.searchParams.set("limit", limit.toString());

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load popular products");
  }

  const data = (await response.json()) as PopularProductsResponse;
  return data.products ?? [];
}
