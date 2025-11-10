"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (searchQuery.trim()) {
      // TODO: Implement search logic
      console.log("Searching for:", searchQuery);
    }
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
