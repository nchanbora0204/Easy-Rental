import { ChevronLeft, ChevronRight } from "lucide-react";

const buildPages = (page, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, 2, total - 1, total, page, page - 1, page + 1]);
  const list = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < list.length; i++) {
    out.push(list[i]);
    if (i < list.length - 1 && list[i + 1] - list[i] > 1) out.push("...");
  }
  return out;
};

export const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-[var(--color-muted)]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`btn ${p === page ? "btn-primary" : "btn-ghost"}`}
              onClick={() => onChange(p)}
              aria-label={`Trang ${p}`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
