import {
  Search,
  MapPin,
  Users,
  DollarSign,
  Gauge,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { CITY_OPTIONS } from "../search.constants";

export const SearchFiltersSidebar = ({
  draft,
  setDraft,
  loading,
  activeFilters,
  onApply,
  onClear,
}) => {
  return (
    <div className="hidden lg:block">
      <div className="card sticky top-20">
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-primary" />
              Bộ lọc
            </h3>

            {activeFilters && (
              <button
                type="button"
                onClick={onClear}
                className="text-sm text-danger hover:underline flex items-center gap-1"
              >
                <X size={14} />
                Xóa
              </button>
            )}
          </div>

          <Field
            label="Địa điểm"
            icon={<MapPin size={16} className="text-primary" />}
          >
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
          </Field>

          <Field
            label="Số chỗ ngồi"
            icon={<Users size={16} className="text-primary" />}
          >
            <select
              className="select w-full"
              value={draft.seats}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, seats: e.target.value }))
              }
            >
              <option value="">Tất cả</option>
              <option value="4">4 chỗ</option>
              <option value="5">5 chỗ</option>
              <option value="7">7 chỗ</option>
              <option value="9">9 chỗ trở lên</option>
            </select>
          </Field>

          <Field
            label="Khoảng giá (đ/ngày)"
            icon={<DollarSign size={16} className="text-primary" />}
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="input"
                placeholder="Tối thiểu"
                value={draft.minPrice}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, minPrice: e.target.value }))
                }
              />
              <input
                type="number"
                className="input"
                placeholder="Tối đa"
                value={draft.maxPrice}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
              />
            </div>
          </Field>

          <Field label="Hạng xe">
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
          </Field>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="featuredOnly"
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
              htmlFor="featuredOnly"
              className="text-sm text-[var(--color-muted)]"
            >
              Chỉ hiển thị xe nổi bật
            </label>
          </div>

          <Field
            label="Hộp số"
            icon={<Gauge size={16} className="text-primary" />}
          >
            <select
              className="select w-full"
              value={draft.transmission}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, transmission: e.target.value }))
              }
            >
              <option value="">Tất cả</option>
              <option value="automatic">Số tự động</option>
              <option value="manual">Số sàn</option>
            </select>
          </Field>

          <Field label="Hãng xe">
            <select
              className="select w-full"
              value={draft.brand}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, brand: e.target.value }))
              }
            >
              <option value="">Tất cả hãng</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Mazda">Mazda</option>
              <option value="Hyundai">Hyundai</option>
              <option value="KIA">KIA</option>
              <option value="VinFast">VinFast</option>
              <option value="Ford">Ford</option>
            </select>
          </Field>

          <Field label="Nhiên liệu">
            <select
              className="select w-full"
              value={draft.fuel}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, fuel: e.target.value }))
              }
            >
              <option value="">Tất cả</option>
              <option value="Xăng">Xăng</option>
              <option value="Dầu diesel">Dầu diesel</option>
              <option value="Điện">Điện</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </Field>

          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={onApply}
          >
            <Search size={18} />
            {loading ? "Đang tìm..." : "Áp dụng"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, icon, children }) => {
  return (
    <div>
      <label className="label flex items-center gap-2 mb-2">
        {icon ? icon : null}
        {label}
      </label>
      {children}
    </div>
  );
};
