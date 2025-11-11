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

  const isFirstPage = page === 0;
  const isLastPage = page >= totalPages - 1;
  const lastPageIndex = Math.max(totalPages - 1, 0);

  const createPaginationItems = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index);
    }

    const items = [0, 1, 2];

    if (page > 2 && page < lastPageIndex - 1) {
      items.push(page);
    }

    if (page >= lastPageIndex - 1) {
      items.push(lastPageIndex - 2, lastPageIndex - 1);
    }

    const uniqueItems = Array.from(new Set(items.filter((i) => i >= 0 && i < lastPageIndex)));

    return [...uniqueItems.sort((a, b) => a - b), lastPageIndex];
  };

  const paginationNumbers = createPaginationItems();

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-gray-200 px-4 py-3 sm:px-6 sm:py-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a1a1a] transition hover:bg-[#f5f1e8] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPageChange((prev) => Math.max(prev - 1, 0))}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {paginationNumbers.map((index, arrayIndex) => {
            const isLastItem = arrayIndex === paginationNumbers.length - 1;
            const isGapNeeded =
              arrayIndex < paginationNumbers.length - 1 &&
              paginationNumbers[arrayIndex + 1] - index > 1;

            return (
              <div key={`page-${index}`} className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(index)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition hover:bg-[#f5f1e8] sm:h-8 sm:w-8 sm:text-sm ${
                    page === index ? "bg-[#1a1a1a] text-white" : "text-[#1a1a1a]"
                  }`}
                  aria-label={`Page ${index + 1}`}
                  aria-current={page === index ? "page" : undefined}
                >
                  {index + 1}
                </button>
                {isGapNeeded && <span className="text-sm text-[#4a4a4a]">…</span>}
              </div>
            );
          })}
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a1a1a] transition hover:bg-[#f5f1e8] disabled:cursor-not-allowed disabled:opacity-40"
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
