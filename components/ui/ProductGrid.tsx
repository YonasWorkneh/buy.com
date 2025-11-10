import React from "react";

import { PopularProduct } from "@/lib/services/products";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Handbag, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductGrid({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  isInCart,
}: {
  product: PopularProduct;
  onAddToCart: (product: PopularProduct) => void;
  onToggleFavorite: (product: PopularProduct) => void;
  isFavorite: boolean;
  isInCart: boolean;
}) {
  const router = useRouter();
  return (
    <article
      key={product.id}
      className="group flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 transition hover:-translate-y-1 cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <Link
        href={`/products/${product.id}`}
        className="relative h-48 w-full overflow-hidden rounded-xl"
      >
        <Image
          src={product.images?.[0] || product.thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[#4a4a4a]">
          {product.category.replace(/-/g, " ")}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="text-lg font-semibold text-[#1a1a1a] hover:underline"
        >
          {product.title}
        </Link>
        <p className="text-sm text-[#4a4a4a] leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-2 text-sm text-[#1a1a1a]">
        <span className="text-base font-semibold">
          ${Number(product.price).toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full size-8 bg-transparent text-[#1a1a1a] border border-gray-200  cursor-pointer"
            onClick={() => onToggleFavorite(product)}
          >
            <Heart size={16} className={isFavorite ? "fill-[#1a1a1a]" : ""} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full size-8 bg-transparent text-[#1a1a1a] border border-gray-200 cursor-pointer"
            onClick={() => onAddToCart(product)}
          >
            {isInCart ? <Check size={16} /> : <Handbag size={16} />}
          </Button>
        </div>
      </div>
    </article>
  );
}
