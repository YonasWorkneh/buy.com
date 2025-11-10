"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { HeartOff, ArrowLeft, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  toggleFavorite,
  clearFavorites,
  type FavoriteProductSummary,
} from "@/lib/store/favoritesSlice";
import { Rating } from "../components/Rating";

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = (product: FavoriteProductSummary) => {
    try {
      dispatch(toggleFavorite(product));
      toast.success("Removed from favorites.");
    } catch {
      setError("Unable to update favorites. Please try again.");
      toast.error("Unable to update favorites.");
    }
  };

  const handleClearAll = () => {
    try {
      dispatch(clearFavorites());
      toast.success("Cleared favorites.");
    } catch {
      setError("Unable to clear favorites. Please try again.");
      toast.error("Unable to clear favorites.");
    }
  };

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              Your Favorites
            </h1>
            <p className="text-[#4a4a4a]">
              Keep track of products you love. Add them to your cart whenever
              you&apos;re ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" asChild>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 cursor-pointer border border-gray-200 rounded-full! px-4 py-2"
              >
                <ArrowLeft size={16} />
                Back to shop
              </Link>
            </Button>
            {favorites.length > 0 && (
              <Button variant="outline" onClick={handleClearAll}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#1a1a1a]/20 px-6 py-16 text-center"
          >
            <HeartOff className="h-10 w-10 text-[#1a1a1a]" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#1a1a1a]">
                Your favorites list is empty
              </h2>
              <p className="text-sm text-[#4a4a4a] max-w-sm">
                Explore our collection and add products to your favorites to
                keep track of them here.
              </p>
            </div>
            <Button asChild>
              <Link href="/shop">Browse products</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {favorites.map((product) => (
              <motion.div
                key={product.id}
                variants={listVariants}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 h-[450px]"
              >
                <div className="relative h-[220px] w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <Badge
                    variant="outline"
                    className="rounded-full border border-gray-200 bg-transparent px-3 py-1 text-xs capitalize text-[#1a1a1a]"
                  >
                    {product.category}
                  </Badge>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a1a1a]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#4a4a4a]">{product.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                  <Rating rating={product.rating} />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(product)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-gray-200 rounded-full! px-4 py-2 cursor-pointer"
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
