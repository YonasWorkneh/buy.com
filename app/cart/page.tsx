"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Minus, Plus, X, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/store/cartSlice";
import { addToCart } from "@/lib/store/cartSlice";
import type { FavoriteProductSummary } from "@/lib/store/favoritesSlice";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function CartPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleDecrease = (id: number, current: number) => {
    const updated = Math.max(1, current - 1);
    dispatch(updateQuantity({ id, quantity: updated }));
  };

  const handleIncrease = (id: number, current: number) => {
    dispatch(updateQuantity({ id, quantity: current + 1 }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart.");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared.");
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout (simulated).");
  };

  const handleAddFavoriteToCart = (product: FavoriteProductSummary) => {
    dispatch(addToCart(product));
    toast.success("Added favorite to cart!");
  };

  return (
    <section className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5 text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-[#4a4a4a]">
              Your Shopping Cart
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a]">
              Review your picks
            </h1>
          </div>
          <Button
            variant="ghost"
            asChild
            className="w-full rounded-full border border-gray-200 px-5 py-2 text-[#1a1a1a] hover:bg-[#f5f1e8] md:w-auto"
          >
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium md:w-auto"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-[#1a1a1a]/20 px-6 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1a1a1a]/5">
                <ShoppingCart size={28} className="text-[#1a1a1a]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[#1a1a1a]">
                  Your cart is empty
                </h2>
                <p className="text-sm text-[#4a4a4a] max-w-sm">
                  Start by adding items from your favorites or continue browsing
                  our latest arrivals.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border border-gray-200 text-sm text-[#1a1a1a] hover:bg-[#f5f1e8] sm:w-auto"
                >
                  <Link href="/favorites" className="w-full">
                    Add from favorites
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-full bg-[#1a1a1a] text-sm text-white hover:bg-[#2a2a2a] sm:w-auto"
                >
                  <Link href="/shop" className="w-full">
                    Browse products
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,2fr)_1fr] lg:items-start lg:gap-10">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-[#1a1a1a]">
                            {item.name}
                          </h3>
                          <p className="text-xs uppercase tracking-[0.3em] text-[#4a4a4a]">
                            #{item.id}
                          </p>
                          <p className="text-sm text-[#4a4a4a] capitalize">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex items-center gap-3">
                          <button
                            className="grid size-9 place-items-center rounded-full border border-gray-200 text-[#1a1a1a]"
                            onClick={() =>
                              handleDecrease(item.id, item.quantity)
                            }
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-[#1a1a1a]">
                            {item.quantity}
                          </span>
                          <button
                            className="grid size-9 place-items-center rounded-full border border-gray-200 text-[#1a1a1a]"
                            onClick={() =>
                              handleIncrease(item.id, item.quantity)
                            }
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#1a1a1a]">
                          {formatCurrency(
                            Number(item.price.replace(/[^0-9.-]+/g, "")) *
                              item.quantity
                          )}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                          className="rounded-full text-[#4a4a4a] hover:bg-[#f5f1e8]"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 rounded-2xl border border-gray-200 p-6 shadow-sm lg:sticky lg:top-28">
                  <div className="flex items-center justify-between text-[#1a1a1a]">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="text-lg font-semibold text-[#1a1a1a]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a4a4a]">
                    Shipping, taxes, and discounts calculated at checkout.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      className="rounded-full border border-gray-200 text-sm text-[#1a1a1a] hover:bg-[#f5f1e8]"
                    >
                      Clear cart
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="rounded-full bg-[#1a1a1a] text-sm text-white hover:bg-[#2a2a2a] col-span-2"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cartItems.length === 0 && favorites.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-[#1a1a1a] text-center sm:text-left">
                Favorites you might add
              </h2>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="self-center rounded-full text-[#1a1a1a] hover:bg-[#f5f1e8] sm:self-auto"
              >
                <Link href="/favorites">Manage favorites</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {favorites.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-[#1a1a1a]">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#4a4a4a]">{item.category}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                    onClick={() => handleAddFavoriteToCart(item)}
                  >
                    Add to cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
