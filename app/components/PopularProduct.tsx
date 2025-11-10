import { Heart } from "lucide-react";
import Image from "next/image";
import { Rating } from "./Rating";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
}

export default function PopularProduct({ product }: { product: Product }) {
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
      <div className="p-2">
        <h3 className="text-md font-semibold text-[#1a1a1a] mb-2">
          {product.name}
        </h3>
        <p className="font-bold text-[#1a1a1a]">{product.price}</p>
      </div>
      <div className="flex justify-between items-center">
        {/* category-badge */}
        <div className=" w-fit p-2">
          <div className="rounded-full border border-gray-200 p-1 px-3 text-sm">
            {product.category}
          </div>
        </div>
        {/* rating */}
        <Rating rating={product.rating} />
      </div>

      <button
        className="absolute z-1000 top-3 right-3 bg-white rounded-md p-1 border border-gray-200 cursor-pointer"
        onClick={() => alert("prodduct favorited")}
      >
        <Heart size={20} />
      </button>
    </>
  );
}
