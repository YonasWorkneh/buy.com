"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, PackageSearch, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  deleteListing,
  getListings,
  type MyListingRecord,
} from "@/lib/db/myListings";
import useDeleteProduct from "@/app/hooks/useDeleteProduct";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function MyAdsPage() {
  const [listings, setListings] = useState<MyListingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const deleteProductMutation = useDeleteProduct({
    onSuccess: async () => {
      if (pendingDeleteId != null) {
        await deleteListing(pendingDeleteId);
        setListings((prev) =>
          prev.filter((item) => item.id !== pendingDeleteId)
        );
      }
      toast.success("Listing deleted.");
    },
    onError: (err) => {
      console.error("Failed to delete product", err);
      toast.error("Unable to delete product. Please try again.");
    },
    onSettled: () => {
      setPendingDeleteId(null);
    },
  });

  const loadListings = useCallback(async () => {
    try {
      setError(null);
      const data = await getListings();
      setListings(data);
    } catch (err) {
      console.error("Failed to load listings", err);
      setError("Unable to read listings from your device.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const sortedListings = useMemo(
    () =>
      [...listings].sort((a, b) => {
        const aDate = a.createdAt ?? "";
        const bDate = b.createdAt ?? "";
        return bDate.localeCompare(aDate);
      }),
    [listings]
  );

  return (
    <section className="w-full px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a1a1a]">
              My Listings
            </h1>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Review every product you have published through the marketplace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center text-red-600">
            <PackageSearch className="h-10 w-10" />
            <p className="text-lg font-semibold">
              We couldn&apos;t load your product catalog.
            </p>
            <p className="text-sm">{error}</p>
          </div>
        ) : sortedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#d8d5ce] px-6 py-16 text-center">
            <PackageSearch className="h-10 w-10 text-[#1a1a1a]" />
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
                Add Product
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
            {sortedListings.map((product) => {
              const createdDate = product.createdAt
                ? new Date(product.createdAt)
                : null;
              const createdLabel =
                createdDate && !Number.isNaN(createdDate.getTime())
                  ? new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                    }).format(createdDate)
                  : "Recently added";

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4 rounded-3xl border border-[#d8d5ce] p-5"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={
                        product.thumbnail ||
                        product.images?.[0] ||
                        "https://images.unsplash.com/photo-1518131678677-a1c53c105fe0?w=600&h=600&fit=crop"
                      }
                      alt={product.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-[#1a1a1a]">
                        {product.title}
                      </h2>
                      {product.category ? (
                        <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                          {product.category.replace(/-/g, " ")}
                        </span>
                      ) : null}
                    </div>
                    {product.description ? (
                      <p className="line-clamp-3 text-sm text-[#4a4a4a]">
                        {product.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm text-[#1a1a1a]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                        Price
                      </p>
                      <p className="text-base font-semibold">
                        ${Number(product.price ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
                        Stock
                      </p>
                      <p className="text-base font-semibold">
                        {product.stock ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-[#4a4a4a]">
                      Added {createdLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 rounded-full border border-[#d8d5ce] px-3 text-xs text-[#1a1a1a] hover:bg-[#f5f1e8]"
                        onClick={() =>
                          router.push(`/myads/new?editId=${product.id}`)
                        }
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={
                          pendingDeleteId === product.id ||
                          deleteProductMutation.isPending
                        }
                        className="flex items-center gap-1 rounded-full border border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                        onClick={() => {
                          const targetRemoteId = product.remoteId ?? product.id;
                          setPendingDeleteId(product.id);
                          deleteProductMutation.mutate(targetRemoteId);
                        }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
