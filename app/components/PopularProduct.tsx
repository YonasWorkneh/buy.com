import { Check, Handbag, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "./Rating";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  toggleFavorite,
  type FavoriteProductSummary,
} from "@/lib/store/favoritesSlice";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
}

interface PopularProductProps {
  product: Product;
  onAddToCart?: (product: FavoriteProductSummary) => void;
}

export default function PopularProduct({
  product,
  onAddToCart,
}: PopularProductProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    state.favorites.items.some(
      (item: FavoriteProductSummary) => item.id === product.id
    )
  );
  const isInCart = useAppSelector((state) =>
    state.cart.items.some((item) => item.id === product.id)
  );

  const payload: FavoriteProductSummary = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    rating: product.rating,
  };

  const handleToggleFavorite = () => {
    try {
      dispatch(toggleFavorite(payload));
      if (isFavorite) {
        toast.success("Removed from favorites.");
      } else {
        toast.success("Added to favorites!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 transition hover:-translate-y-1">
      <div className="p-0">
        <Link
          href={`/products/${product.id}`}
          className="relative block h-[200px] md:h-[250px] w-full overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 pb-2 pt-4">
        <Badge
          variant="outline"
          className="w-fit rounded-full border border-gray-200 bg-transparent px-3 py-1 text-xs capitalize text-[#1a1a1a]"
        >
          {product.category}
        </Badge>
        <Link href={`/products/${product.id}`} className="block space-y-1">
          <h3 className="text-lg font-semibold text-[#1a1a1a] group-hover:text-[#111]">
            {product.name}
          </h3>
          <p className="text-sm text-[#4a4a4a]">{product.price}</p>
        </Link>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <div className="-ml-2">
          <Rating rating={product.rating} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border border-gray-200 bg-transparent px-4 py-2 shadow-none"
          >
            <Link href={`/products/${product.id}`}>View details</Link>
          </Button>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="bg-none! border border-gray-200 text-[#1a1a1a] cursor-pointer"
          onClick={handleToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={20} className={isFavorite ? "fill-[#1a1a1a]" : ""} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="bg-none! border border-gray-200 text-[#1a1a1a] cursor-pointer"
          onClick={() => !isInCart && onAddToCart?.(product)}
          aria-label={isInCart ? "In cart" : "Add to cart"}
        >
          {isInCart ? <Check size={20} /> : <Handbag size={20} />}
        </Button>
      </div>
    </div>
  );
}
