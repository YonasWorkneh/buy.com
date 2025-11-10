"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Handbag, Heart, Menu, Plus, X } from "lucide-react";
import Navigation, { navItems } from "./Navigation";
import SearchBar from "./SearchBar";
import { useAppSelector } from "@/lib/store/hooks";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const favoritesCount = useAppSelector(
    (state) => state.favorites.items.length
  );
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const navLinks = useMemo(
    () =>
      navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center justify-between text-lg font-medium transition ${
            pathname === item.href
              ? "text-[#1a1a1a]"
              : "text-[#4a4a4a] hover:text-[#1a1a1a]"
          }`}
        >
          <span>{item.label}</span>
        </Link>
      )),
    [pathname]
  );

  return (
    <>
      <header className="w-full bg-[#ede8d048] px-4 py-4 md:px-12 lg:px-16 md:py-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          {/* Mobile menu toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden rounded-full border border-transparent p-2 text-[#1a1a1a] transition hover:border-[#1a1a1a]/20 hover:bg-[#f5f1e8]/70"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="text-2xl font-bold text-[#1a1a1a]">
              <span className="font-bold">BUY</span>
              <span className="font-normal">.com</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <Navigation />

          {/* Right side icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            <Link
              href="/favorites"
              className="relative rounded-full p-2 text-[#1a1a1a] transition hover:bg-[#f5f1e8] hover:text-[#4a4a4a]"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#1a1a1a] px-1 text-[10px] font-semibold text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative rounded-full p-2 text-[#1a1a1a] transition hover:bg-[#f5f1e8] hover:text-[#4a4a4a]"
            >
              <Handbag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#1a1a1a] px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/myads/new"
              className="hidden rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2a2a2a] md:inline-flex md:items-center md:gap-2"
            >
              <Plus size={16} />
              Add product
            </Link>
          </div>
        </div>
        {/* Mobile search bar */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[78%] max-w-xs flex-col gap-6 bg-[#f5f1e8] px-6 py-6 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#1a1a1a]">
                  Menu
                </span>
                <button
                  type="button"
                  className="rounded-full border border-transparent p-2 text-[#1a1a1a] transition hover:border-[#1a1a1a]/20 hover:bg-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">{navLinks}</nav>

              <div className="flex flex-col gap-3 border-t border-[#d8d5ce] pt-4">
                <Link
                  href="/myads/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2a2a2a]"
                >
                  <Plus size={16} />
                  Add product
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
