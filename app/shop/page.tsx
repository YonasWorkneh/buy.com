"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProductCategories,
  getProductsList,
  type ProductListParams,
  type PopularProduct,
} from "@/lib/services/products";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Handbag,
  Heart,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/cartSlice";
import type { FavoriteProductSummary } from "@/lib/store/favoritesSlice";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationControls from "@/app/components/Pagination";
import ProductList from "../components/ProductList";
import ProductGrid from "../components/ProductGrid";

type ViewMode = "grid" | "list";

const sortSelections: Array<{
  label: string;
  value: string;
  params?: ProductListParams;
}> = [
  {
    label: "Title (A-Z)",
    value: "title-asc",
    params: { sortBy: "title", order: "asc" },
  },
  {
    label: "Title (Z-A)",
    value: "title-desc",
    params: { sortBy: "title", order: "desc" },
  },
  {
    label: "Price (Low-High)",
    value: "price-asc",
    params: { sortBy: "price", order: "asc" },
  },
  {
    label: "Price (High-Low)",
    value: "price-desc",
    params: { sortBy: "price", order: "desc" },
  },
];

const availabilityFilters = [
  { id: "in-stock", label: "In Stock" },
  { id: "low-stock", label: "Low Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
];

export default function ShopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [selectedSort, setSelectedSort] = useState(sortSelections[0]);
  const [page, setPage] = useState(0);

  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategories,
    staleTime: 1000 * 60 * 60,
  });

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: [
      "shop-products",
      selectedSort.value,
      selectedCategories[0] ?? "all",
      page,
    ],
    queryFn: () => {
      const category =
        selectedCategories.length === 1 ? selectedCategories[0] : undefined;
      return getProductsList(
        {
          ...selectedSort.params,
          limit: 15,
          skip: page * 15,
        },
        category
      );
    },
    placeholderData: (previousData) => previousData,
  });

  const filteredProducts = useMemo(() => {
    const source = productsResponse?.products ?? [];
    let nextProducts = [...source];

    if (selectedAvailability.length) {
      nextProducts = nextProducts.filter((product) => {
        const status = (product.availabilityStatus ?? "").toLowerCase();
        return selectedAvailability.some((filter) => {
          if (filter === "in-stock")
            return status.includes("stock") && status.includes("in");
          if (filter === "low-stock") return status.includes("low");
          if (filter === "out-of-stock") return status.includes("out");
          return false;
        });
      });
    }

    return nextProducts;
  }, [productsResponse, selectedAvailability]);

  const totalProducts = productsResponse?.total ?? 0;
  const totalPages = totalProducts ? Math.ceil(totalProducts / 15) : 0;

  const toggleAvailability = (value: string) => {
    setSelectedAvailability((prev) => {
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      return next;
    });
    setPage(0);
  };

  const handleAddToCart = (product: PopularProduct) => {
    const payload: FavoriteProductSummary = {
      id: product.id,
      name: product.title,
      price: `$${Number(product.price).toFixed(2)}`,
      image: product.images?.[0] || product.thumbnail,
      category: product.category,
      rating: Number(product.rating ?? 0),
    };
    dispatch(addToCart(payload));
    toast.success("Added to cart!");
  };

  const startEntry = filteredProducts.length ? page * 15 + 1 : 0;
  const endEntry = filteredProducts.length
    ? page * 15 + filteredProducts.length
    : 0;
  const favorites = useAppSelector((state) => state.favorites.items);
  const cart = useAppSelector((state) => state.cart.items);

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#1a1a1a]">
                All Products
              </h1>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#4a4a4a]">
                Showing {startEntry} – {endEntry} of {totalProducts} entries
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-full border border-[#d8d5ce] bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                    viewMode === "grid"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-[#4a4a4a]"
                  }`}
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid size={16} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                    viewMode === "list"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-[#4a4a4a]"
                  }`}
                  aria-pressed={viewMode === "list"}
                >
                  <Rows3 size={16} />
                  List
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-xs uppercase tracking-[0.3em] text-[#4a4a4a]"
                >
                  Sort by
                </label>
                <Select
                  value={selectedSort.value}
                  onValueChange={(value) => {
                    const next = sortSelections.find(
                      (option) => option.value === value
                    );
                    if (next) {
                      setSelectedSort(next);
                      setPage(0);
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px] shadow-none">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="px-0 w-full">
                    {sortSelections.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="w-full rounded-md pl-10"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        <div
          className="grid gap-10"
          style={{ gridTemplateColumns: "260px 1fr" }}
        >
          <aside className="space-y-10">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]">
                <SlidersHorizontal size={16} />
                Filters
              </h2>

              <div className="mt-6 space-y-6 text-sm">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#4a4a4a]">
                    Categories
                  </p>
                  <div className="space-y-3">
                    {categoriesData?.map((category) => {
                      const isSelected = selectedCategories.includes(category);
                      return (
                        <label
                          key={category}
                          className="flex items-center gap-3 text-sm text-[#1a1a1a]"
                        >
                          <input
                            type="checkbox"
                            className="accent-[#1a1a1a]"
                            checked={isSelected}
                            onChange={() => {
                              if (!isSelected) {
                                setSelectedCategories([category]);
                              } else {
                                setSelectedCategories([]);
                              }
                              setPage(0);
                            }}
                          />
                          <span className="capitalize">
                            {category.replace(/-/g, " ")}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#4a4a4a]">
                    Availability
                  </p>
                  <div className="space-y-3">
                    {availabilityFilters.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-3 text-sm text-[#1a1a1a]"
                      >
                        <input
                          type="checkbox"
                          className="accent-[#1a1a1a]"
                          checked={selectedAvailability.includes(filter.id)}
                          onChange={() => toggleAvailability(filter.id)}
                        />
                        <span>{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedCategories.length > 0 ||
                selectedAvailability.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-8 rounded-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedAvailability([]);
                    setPage(0);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </aside>

          <main>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-72 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#1a1a1a]/20 p-12 text-center text-[#4a4a4a]">
                No products match your filters just yet. Try adjusting your
                selection.
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const isInFavorite = favorites.some(
                    (item) => item.id === product.id
                  );
                  const isInCart = cart.some((item) => item.id === product.id);
                  return (
                    <ProductGrid
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isFavorite={isInFavorite}
                      isInCart={isInCart}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const isInFavorite = favorites.some(
                    (item) => item.id === product.id
                  );
                  const isInCart = cart.some((item) => item.id === product.id);
                  return (
                    <ProductList
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isFavorite={isInFavorite}
                      isInCart={isInCart}
                    />
                  );
                })}
              </div>
            )}

            {totalProducts > 0 && (
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
