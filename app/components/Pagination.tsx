"use client";

import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 0) {
    return null;
  }

  const paginationNumbers = Array.from(
    { length: totalPages },
    (_, index) => index
  );

  const isFirstPage = page === 0;
  const isLastPage = page >= totalPages - 1;
  const lastPageIndex = Math.max(totalPages - 1, 0);

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-gray-200 px-6 py-3">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#1a1a1a] disabled:opacity-40 cursor-pointer"
          onClick={() => onPageChange((prev) => Math.max(prev - 1, 0))}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          {paginationNumbers.map((index) => (
            <button
              key={index}
              onClick={() => onPageChange(index)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition cursor-pointer ${
                page === index
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#1a1a1a] hover:bg-[#f5f1e8]"
              }`}
              aria-label={`Page ${index + 1}`}
              aria-current={page === index ? "page" : undefined}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#1a1a1a] disabled:opacity-40 cursor-pointer"
          onClick={() =>
            onPageChange((prev) => Math.min(prev + 1, lastPageIndex))
          }
          disabled={isLastPage}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
