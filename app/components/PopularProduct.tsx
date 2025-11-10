import { Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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

export default function PopularProduct({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    state.favorites.items.some(
      (item: FavoriteProductSummary) => item.id === product.id
    )
  );

  const handleToggleFavorite = () => {
    const payload: FavoriteProductSummary = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    };

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
    <div className="relative overflow-hidden shadow-none border border-gray-200 rounded-2xl h-[450px]">
      <div className="p-0">
        <div className="relative h-[200px] md:h-[250px] w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="space-y-3 px-4 pb-2 pt-4 bg-none!">
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
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 bg-white border border-gray-200 text-[#1a1a1a] hover:bg-white"
        onClick={handleToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={20} className={isFavorite ? "fill-[#1a1a1a]" : ""} />
      </Button>
    </div>
  );
}
