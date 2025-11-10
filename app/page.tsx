"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Handbag,
  Smartphone,
  Sofa,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import PopularProduct from "../components/ui/PopularProduct";
import usePopularProducts from "./hooks/usePopularProducts";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/cartSlice";
import {
  toggleFavorite,
  type FavoriteProductSummary,
} from "@/lib/store/favoritesSlice";

const reviewImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
];

const categories = [
  { icon: Smartphone, label: "Electronics" },
  { icon: Handbag, label: "Fashion" },
  { icon: Sofa, label: "Home" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
  },
};

export default function Home() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const favoriteItems = useAppSelector((state) => state.favorites.items);
  const { products, isLoading, error } = usePopularProducts(20);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  const formattedProducts: FavoriteProductSummary[] = products.map(
    (product) => ({
      id: product.id,
      name: product.title,
      price: `$${Number(product.price).toFixed(2)}`,
      image: product.images?.[0] || product.thumbnail,
      category: product.category,
      rating: Number(product.rating ?? 0),
    })
  );

  const handleAddToCart = (
    product: FavoriteProductSummary,
    isInCart = false
  ) => {
    const alreadyInCart =
      isInCart || cartItems.some((item) => item.id === product.id);

    if (alreadyInCart) {
      toast.success("Already in cart.");
      return;
    }

    dispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  const handleToggleFavorite = (
    product: FavoriteProductSummary,
    isFavorite = false
  ) => {
    const alreadyFavorite =
      isFavorite || favoriteItems.some((item) => item.id === product.id);

    if (alreadyFavorite) {
      toast.success("Already in favorites.");
      return;
    }

    dispatch(toggleFavorite(product));
    toast.success("Added to favorites!");
  };

  const popularSkeletons = Array.from({ length: 4 }, (_, index) => index);
  const shouldAnimatePopular = !isMobile;

  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 md:py-24 flex flex-col items-center">
        <div className="relative">
          <p className="text-sm text-[#1a1a1a] absolute top-0 left-2">
            BUY.COM
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-tight mb-6 max-w-4xl"
          >
            Search. Shop. Smile
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-lg md:text-xl text-[#4a4a4a] mb-8 max-w-2xl text-center"
        >
          Our products are carefully curated, quality-assured & delivered fresh
          to your door daily.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <Button size="lg" className="rounded-full px-8 text-lg font-medium">
            Shop Now
          </Button>
        </motion.div>

        {/* Social Proof and Categories */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
          {/* Social Proof */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-3">
              {reviewImages.map((src, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                >
                  <Image
                    src={src}
                    alt="Customer"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="text-[#1a1a1a] font-medium underline"
            >
              10.8K+ reviews
            </motion.span>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full border border-zinc-200 overflow-hidden flex items-center justify-center cursor-pointer"
                  >
                    <Icon className="text-zinc-900" size={20} />
                  </motion.div>
                );
              })}
            </div>
            <motion.span
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="text-[#1a1a1a] font-medium text-sm md:text-base"
            >
              Electronics, Fashion, Home & More
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* Product Image Grid Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 md:-mt-40">
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0"
          >
            {/* Left Image - Most rotation to the right */}
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.6 }}
              className="relative w-full md:w-[450px] h-[300px] md:h-[350px] scale-[0.8] rounded-[30px] overflow-hidden shadow-lg z-10 transform md:rotate-12 transition-transform duration-300"
            >
              <Image
                src="/images/woman-browse.jpg"
                alt="Product"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Center Image - Moderate rotation to the right */}
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.6 }}
              className="relative w-full md:w-[380px] h-[450px] md:h-[500px] rounded-[20px] overflow-hidden shadow-xl z-20 transform md:-rotate-8 transition-transform duration-300"
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
                alt="Product"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Right Image - Smallest rotation to the right */}
            <motion.div
              variants={imageVariants}
              transition={{ duration: 0.6 }}
              className="relative w-full md:w-[400px] h-[300px] md:h-[350px] scale-[0.7] rounded-[30px] overflow-hidden shadow-lg z-30 transform md:-rotate-18 transition-transform duration-300 border-5 border-[#Ede8d0] ml-[-80px]"
            >
              <Image
                src="/images/woman-happy.jpg"
                alt="Product"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24 mt-28">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Underlines */}
          <div className="mb-12 md:mb-16 flex flex-col items-center gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex items-center justify-center gap-3 md:gap-4"
            >
              {/* Left Underline */}
              <motion.div
                variants={underlineVariants}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="h-[2px] bg-[#1a1a1a] flex-1 max-w-[60px] md:max-w-[100px] origin-left"
              />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#1a1a1a] px-4 md:px-8 text-center whitespace-nowrap"
              >
                Popular Products
              </motion.h2>
              {/* Right Underline */}
              <motion.div
                variants={underlineVariants}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-[2px] bg-[#1a1a1a] flex-1 max-w-[60px] md:max-w-[100px] origin-right"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full px-6"
              >
                <Link href="/shop" className="inline-flex items-center gap-2">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Products Grid */}
          <motion.div
            initial={shouldAnimatePopular ? "hidden" : false}
            whileInView={shouldAnimatePopular ? "visible" : undefined}
            viewport={
              shouldAnimatePopular ? { once: true, amount: 0.2 } : undefined
            }
            variants={shouldAnimatePopular ? containerVariants : undefined}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {isLoading &&
              popularSkeletons.map((item) => (
                <motion.div
                  key={`popular-skeleton-${item}`}
                  variants={shouldAnimatePopular ? itemVariants : undefined}
                  className="group"
                >
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <Skeleton className="h-[200px] md:h-[250px] w-full rounded-xl" />
                    <div className="space-y-3 pt-4">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </div>
                  </div>
                </motion.div>
              ))}

            {!isLoading && error && (
              <motion.div
                variants={shouldAnimatePopular ? itemVariants : undefined}
                className="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-600"
              >
                <AlertCircle className="h-6 w-6" />
                <p className="text-lg font-semibold">Unable to load products</p>
                <p className="text-sm text-red-500">
                  {error || "Please try again later."}
                </p>
              </motion.div>
            )}

            {!isLoading && !error && formattedProducts.length === 0 && (
              <motion.div
                variants={shouldAnimatePopular ? itemVariants : undefined}
                className="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#1a1a1a]/20 bg-white px-6 py-12 text-center"
              >
                <p className="text-lg font-semibold text-[#1a1a1a]">
                  No popular products right now
                </p>
                <p className="text-sm text-[#4a4a4a] max-w-md">
                  Check back soon—our team is refreshing the catalog with the
                  latest best sellers.
                </p>
              </motion.div>
            )}

            {!isLoading &&
              !error &&
              formattedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={shouldAnimatePopular ? itemVariants : undefined}
                  transition={
                    shouldAnimatePopular ? { duration: 0.5 } : undefined
                  }
                  whileHover={shouldAnimatePopular ? { y: -8 } : undefined}
                  className="group cursor-pointer"
                >
                  <PopularProduct
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
