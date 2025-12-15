import { MapPin, X } from "lucide-react";
import { CITY_OPTIONS } from "../search.constants";

export const SearchFiltersDrawer = ({
  open,
  draft,
  setDraft,
  activeFilters,
  onClose,
  onApply,
  onClear,
}) => {
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--color-surface)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Bộ lọc</h3>
            <button type="button" onClick={onClose} aria-label="Đóng">
              <X size={24} />
            </button>
          </div>

          {activeFilters ? (
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-danger hover:underline"
            >
              Xóa tất cả bộ lọc
            </button>
          ) : null}

          <div>
            <label className="label flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-primary" />
              Địa điểm
            </label>
            <select
              className="select w-full"
              value={draft.city}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, city: e.target.value }))
              }
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label mb-2">Hạng xe</label>
            <select
              className="select w-full"
              value={draft.segment}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, segment: e.target.value }))
              }
            >
              <option value="">Tất cả</option>
              <option value="standard">Tiêu chuẩn</option>
              <option value="premium">Cao cấp</option>
              <option value="luxury">Xe sang</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="featuredOnlyMobile"
              type="checkbox"
              className="w-4 h-4"
              checked={draft.featured === "true"}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  featured: e.target.checked ? "true" : "",
                }))
              }
            />
            <label
              htmlFor="featuredOnlyMobile"
              className="text-sm text-[var(--color-muted)]"
            >
              Chỉ hiển thị xe nổi bật
            </label>
          </div>

          <button
            type="button"
            className="btn btn-primary w-full mt-4"
            onClick={onApply}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
