"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductSearch } from "@/app/hooks/useProductSearch";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, isSearching, isError } = useProductSearch(searchQuery);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Results are handled via dropdown; no navigation on submit.
  };

  const shouldShowResults =
    isOpen &&
    searchQuery.trim().length >= 2 &&
    (results.length > 0 || isSearching || isError);

  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: 10 }}
            animate={{ width: 280, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mr-2 overflow-hidden md:w-[320px]"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center h-10 border border-[#1a1a1a]/20 rounded-full px-4 pr-2 w-full"
            >
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent border-none outline-none text-[#1a1a1a] text-sm placeholder:text-[#4a4a4a] min-w-0"
              />
              {searchQuery && (
                <motion.button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 p-1 text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors shrink-0"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </motion.button>
              )}
            </form>

            <AnimatePresence>
              {shouldShowResults && (
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[#1a1a1a]/10 absolute top-full left-0 w-full bg-[#f5f5f5] z-50"
                >
                  <div className="py-2">
                    {isSearching && (
                      <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#4a4a4a]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching products…
                      </div>
                    )}
                    {!isSearching && isError && (
                      <div className="px-4 py-3 text-sm text-red-600">
                        Unable to fetch products. Please try again.
                      </div>
                    )}
                    {!isSearching && !isError && results.length === 0 && (
                      <div className="px-4 py-3 text-sm text-[#4a4a4a]">
                        No products found. Try a different keyword.
                      </div>
                    )}
                    {!isSearching &&
                      !isError &&
                      results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={closeSearch}
                          className="flex items-start gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-gray-300/20 cursor-pointer"
                        >
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={
                                product.thumbnail ||
                                product.images?.[0] ||
                                "/placeholder.png"
                              }
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium leading-tight">
                              {product.title}
                            </p>
                            <p className="text-xs text-[#4a4a4a]">
                              {product.category} • ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 text-[#1a1a1a] hover:text-[#4a4a4a] transition-colors shrink-0 relative z-10 cursor-pointer"
        aria-label="Search"
      >
        <Search size={20} />
      </motion.button>
    </div>
  );
}
