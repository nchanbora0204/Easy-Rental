import { Filter } from "lucide-react";
import { SORT_OPTIONS, PAGE_SIZE_OPTIONS } from "../search.constants";

export const SearchToolbar = ({
  sort,
  onChangeSort,
  pageSize,
  onChangePageSize,
  page,
  totalPages,
  rangeText,
  onOpenFilters,
}) => {
  return (
    <>
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={onOpenFilters}
          className="btn btn-primary shadow-lg w-14 h-14 rounded-full"
          aria-label="Mở bộ lọc"
        >
          <Filter size={24} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--color-muted)]">
              Sắp xếp:
            </label>
            <select
              className="select text-sm"
              value={sort}
              onChange={(e) => onChangeSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--color-muted)]">
              Hiển thị:
            </label>
            <select
              className="select text-sm"
              value={pageSize}
              onChange={(e) => onChangePageSize(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}/trang
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-[var(--color-muted)]">
          {rangeText} • Trang {page}/{totalPages}
        </div>
      </div>
    </>
  );
};
