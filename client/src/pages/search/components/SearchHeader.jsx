import { Grid3x3, List } from "lucide-react";

export const SearchHeader = ({ totalResults, viewMode, onViewModeChange, children }) => {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tìm kiếm xe</h1>
            <p className="text-[var(--color-muted)]">
              {totalResults} xe phù hợp với tìm kiếm của bạn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
              aria-label="Grid view"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`btn ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
