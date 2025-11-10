import { Heart } from "lucide-react";
import Image from "next/image";
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
    <>
      <div className="relative w-full h-[200px] md:h-[250px] ">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 rounded-t-2xl"
        />
      </div>
      <div className="p-3 pb-2">
        <h3 className="text-md font-semibold text-[#1a1a1a] mb-2">
          {product.name}
        </h3>
        <p className="font-bold text-[#1a1a1a]">{product.price}</p>
      </div>
      <div className="flex justify-between items-center px-3 pb-3">
        <Badge
          variant="outline"
          className="rounded-full border border-gray-200 bg-transparent px-3 py-1 text-sm capitalize text-[#1a1a1a]"
        >
          {product.category}
        </Badge>
        {/* rating */}
        <Rating rating={product.rating} />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 bg-white border border-gray-200 text-[#1a1a1a] hover:bg-white cursor-pointer"
        onClick={handleToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={20} className={isFavorite ? "fill-[#1a1a1a]" : ""} />
      </Button>
    </>
  );
}
