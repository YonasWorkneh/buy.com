"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Handbag,
  Plus,
  Minus,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/ui/Rating";
import { getProductById } from "@/lib/services/products";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/cartSlice";
import { FavoriteProductSummary } from "@/lib/store/favoritesSlice";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const dispatch = useAppDispatch();

  const productId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return NaN;
    return Number(raw);
  }, [params]);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => getProductById(productId),
    enabled: !Number.isNaN(productId),
    staleTime: 1000 * 60 * 5,
  });

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product?.id ?? 0,
        name: product?.title ?? "",
        price: `$${Number(product?.price).toFixed(2)}`,
        image: product?.images?.[0] ?? "",
        category: product?.category ?? "",
        rating: product?.rating ?? 0,
      })
    );
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    toast.success("Proceeding to checkout (simulated)!");
  };

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setImageIndex((prev) =>
      prev === 0 ? product.images!.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setImageIndex((prev) =>
      prev === product.images!.length - 1 ? 0 : prev + 1
    );
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (Number.isNaN(productId)) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-24 flex flex-col items-center gap-6">
        <AlertCircle className="h-10 w-10 text-red-600" />
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">
          Invalid product identifier
        </h1>
        <Button onClick={() => router.back()} variant="outline">
          Go back
        </Button>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-[520px] w-full rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 rounded-2xl border border-red-200 bg-red-50 px-8 py-12 text-center text-red-600">
          <AlertCircle className="h-10 w-10" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              We couldn&apos;t load this product.
            </h1>
            <p className="text-sm">
              Please check your connection or try again in a few moments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
            <Button asChild>
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentImage = product.images?.[imageIndex] ?? product.thumbnail;
  const bulletPoints = [
    product.description,
    `Brand: ${product.brand}`,
    product.availabilityStatus ?? "Currently available.",
    product.shippingInformation ?? "Ships within 2-5 business days.",
    product.warrantyInformation ?? "Warranty information available on request.",
  ].filter(Boolean);

  const accordionSections = [
    {
      id: "dimensions",
      label: "Specifications",
      content: product.dimensions
        ? `Weight: ${product.weight ?? "N/A"}kg · Dimensions: ${
            product.dimensions.width
          }cm (W) × ${product.dimensions.height}cm (H) × ${
            product.dimensions.depth
          }cm (D)`
        : `Weight: ${
            product.weight ?? "N/A"
          }kg · Dimensions data not available.`,
    },
    {
      id: "return-policy",
      label: "Return Policy",
      content:
        product.returnPolicy ??
        "Returns accepted within 30 days of purchase in original condition.",
    },
  ];

  const reviews = product.reviews ?? [];

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 border border-gray-200 rounded-full! px-8 py-2 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to shop
            </button>
          </Button>
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <div className="absolute inset-y-0 left-4 flex items-center z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevImage}
                  className="rounded-full bg-white/50! hover:bg-white shadow cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextImage}
                  className="rounded-full bg-white/50! hover:bg-white shadow cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
              <div className="relative h-[540px] w-full">
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  className="object-contain p-12"
                  priority
                />
              </div>
            </div>
            {product.images?.length ? (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setImageIndex(index)}
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border ${
                      imageIndex === index
                        ? "border-[#1a1a1a]"
                        : "border-gray-200"
                    } bg-white transition`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-contain p-3"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.3em] text-[#4a4a4a]">
                  {product.brand}
                </p>
                <h1 className="text-4xl font-semibold text-[#1a1a1a]">
                  {product.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
                <div className="-ml-2">
                  <Rating rating={product.rating} />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-[#1a1a1a]">
                  ${product.price.toFixed(2)}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 gap-2 rounded-none bg-[#1a1a1a] py-6 text-base hover:bg-[#2a2a2a] cursor-pointer"
                  >
                    <Handbag size={18} />
                    Add to cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="flex-1 gap-2 rounded-none border border-[#1a1a1a] py-6 text-base hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
                  >
                    <CreditCard size={18} />
                    Buy now
                  </Button>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-[#4a4a4a]">
                {bulletPoints.map((item, index) => (
                  <li key={index} className="flex gap-3 items-center">
                    <span className="mt-1 block h-1.5! w-1.5! rounded-full bg-[#1a1a1a] " />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-b border-gray-200 py-6">
              {accordionSections.map(({ id, label, content }) => {
                const isOpen = openSections[id] ?? false;
                return (
                  <div
                    key={id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(id)}
                      className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]"
                      aria-expanded={isOpen}
                    >
                      {label}
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="pb-4 text-sm leading-relaxed text-[#4a4a4a]">
                            {typeof content === "string" ? content : content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {reviews.length > 0 && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleSection("reviews")}
                  className="flex w-full items-center justify-between border-b border-gray-200 pb-4 text-left text-sm font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]"
                  aria-expanded={openSections["reviews"] ?? false}
                >
                  Reviews ({reviews.length})
                  {openSections["reviews"] ? (
                    <Minus size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openSections["reviews"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={`${review.reviewerEmail}-${review.date}`}
                            className="rounded-2xl p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2">
                                <span className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User />
                                </span>
                                <span>{review.reviewerName}</span>
                              </p>
                              <span className="text-xs text-[#4a4a4a]">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-[#4a4a4a]">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
