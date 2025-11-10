"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, Plus, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsList, type PopularProduct } from "@/lib/services/products";
import { motion } from "framer-motion";

export default function MyAdsPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["my-ads-products"],
    queryFn: () =>
      getProductsList({ limit: 30, sortBy: "title", order: "asc" }),
    placeholderData: (prev) => prev,
  });

  const products = useMemo<PopularProduct[]>(
    () => data?.products ?? [],
    [data?.products]
  );

  return (
    <section className="w-full px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1a1a1a]">
              My Product Listings
            </h1>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Review every product you have published through the marketplace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#1a1a1a] text-white hover:bg-[#2d2d2d]"
            >
              <Link href="/myads/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center text-red-600">
            <PackageSearch className="h-10 w-10" />
            <p className="text-lg font-semibold">
              We couldn&apos;t load your product catalog.
            </p>
            <p className="text-sm">
              Please refresh to try again or contact support if the issue
              persists.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#d8d5ce] bg-white px-6 py-16 text-center">
            <PackageSearch className="h-10 w-10 text-[#9182d9]" />
            <div>
              <p className="text-lg font-semibold text-[#1a1a1a]">
                No products yet
              </p>
              <p className="mt-1 text-sm text-[#4a4a4a]">
                Start building your catalog by adding your first product.
              </p>
            </div>
            <Button asChild className="rounded-full bg-[#1a1a1a] text-white">
              <Link href="/myads/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </Link>
            </Button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {products.map((product) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 rounded-3xl border border-[#d8d5ce] bg-white p-5 shadow-sm"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                  {(() => {
                    const imageSrc =
                      product.thumbnail ||
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1518131678677-a1c53c105fe0?w=600&h=600&fit=crop";
                    return (
                      <Image
                        src={imageSrc}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    );
                  })()}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-[#1a1a1a]">
                      {product.title}
                    </h2>
                    <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                      {product.category.replace(/-/g, " ")}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-sm text-[#4a4a4a]">
                    {product.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between text-sm text-[#1a1a1a]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                      Price
                    </p>
                    <p className="text-base font-semibold">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                      Stock
                    </p>
                    <p className="text-base font-semibold">{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                      Discount
                    </p>
                    <p className="text-base font-semibold">
                      {product.discountPercentage ?? 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Link
                    className="text-sm font-semibold text-[#1a1a1a] hover:underline"
                    href={`/products/${product.id}`}
                  >
                    View detail
                  </Link>
                  <Link
                    className="text-sm text-[#4a4a4a] underline-offset-2 hover:underline"
                    href={`/shop?highlight=${product.id}`}
                  >
                    View in shop
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
