import React from "react";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  function prev() {
    if (page > 1) onPageChange(page - 1);
  }
  function next() {
    if (page < pageCount) onPageChange(page + 1);
  }
  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-md border border-neutral-300 px-3 py-1 text-sm disabled:opacity-50"
        onClick={prev}
        disabled={page <= 1}
      >
        Prev
      </button>
      <span className="text-sm text-neutral-700">
        {page} / {pageCount}
      </span>
      <button
        className="rounded-md border border-neutral-300 px-3 py-1 text-sm disabled:opacity-50"
        onClick={next}
        disabled={page >= pageCount}
      >
        Next
      </button>
    </div>
  );
}

