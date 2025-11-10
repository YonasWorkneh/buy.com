"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Minus, Plus, X, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm uppercase tracking-[0.3em] text-[#4a4a4a]">
              Your Shopping Cart
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a]">
              Review your picks
            </h1>
          </div>
          <Button variant="ghost" asChild>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#1a1a1a]/20 bg-white px-6 py-16 text-center shadow-sm">
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
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/favorites">Add from favorites</Link>
                </Button>
                <Button asChild>
                  <Link href="/shop">Browse products</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-100 bg-white">
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

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleDecrease(item.id, item.quantity)}
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-10 text-center text-sm font-semibold text-[#1a1a1a]">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleIncrease(item.id, item.quantity)}
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold text-indigo-600">
                        {formatCurrency(
                          Number(item.price.replace(/[^0-9.-]+/g, "")) *
                            item.quantity
                        )}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        className="rounded-full"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-[#1a1a1a]">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-[#4a4a4a]">
                  Shipping taxes, and discounts calculated at checkout.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="rounded-full"
                  >
                    Clear cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 rounded-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Favorites you might add
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/favorites">Manage favorites</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {favorites.slice(0, 2).map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-100 bg-white">
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
                    className="rounded-full bg-[#1a1a1a]"
                    onClick={() => handleAddFavoriteToCart(item)}
                  >
                    Add to cart
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
