import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Users,
  DollarSign,
  Gauge,
  SlidersHorizontal,
  X,
  Star,
  TrendingUp,
  Filter,
  Grid3x3,
  List,
} from "lucide-react";
import api from "../lib/axios";
import SemanticSearchBox from "../components/SemanticSearchBox";

const CITY_OPTIONS = [
  { value: "", label: "Tất cả thành phố" },
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "hanoi", label: "Hà Nội" },
  { value: "danang", label: "Đà Nẵng" },
  { value: "cantho", label: "Cần Thơ" },
  { value: "nhatrang", label: "Nha Trang" },
];

const DEFAULT_FILTERS = {
  city: "",
  seats: "",
  minPrice: "",
  maxPrice: "",
  transmission: "",
  brand: "",
  fuel: "",
  segment: "",
  featured: "",
  sort: "popular",
};

const buildInitialFilters = () => {
  const params = new URLSearchParams(window.location.search);
  const initial = { ...DEFAULT_FILTERS };

  [
    "city",
    "seats",
    "minPrice",
    "maxPrice",
    "transmission",
    "brand",
    "fuel",
    "segment",
    "featured",
    "sort",
  ].forEach((key) => {
    const v = params.get(key);
    if (v) initial[key] = v;
  });

  return initial;
};

export default function SearchCars() {
  const [q, setQ] = useState(buildInitialFilters);
  const [cars, setCars] = useState([]);
  const [semanticResults, setSemanticResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [totalResults, setTotalResults] = useState(0);

  const hasActiveFilters =
    q.city ||
    q.seats ||
    q.minPrice ||
    q.maxPrice ||
    q.transmission ||
    q.brand ||
    q.fuel ||
    q.segment ||
    q.featured;

  const fmtVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));

  const carsToShow = semanticResults ?? cars;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {};

        if (q.city) params.city = q.city;
        if (q.seats) params.seats = q.seats;
        if (q.minPrice) params.minPrice = q.minPrice;
        if (q.maxPrice) params.maxPrice = q.maxPrice;
        if (q.transmission) params.transmission = q.transmission;
        if (q.brand) params.brand = q.brand;
        if (q.fuel) params.fuel = q.fuel;
        if (q.segment) params.segment = q.segment;
        if (q.featured) params.featured = q.featured;
        if (q.sort) params.sort = q.sort;

        const { data } = await api.get("/cars", { params });
        const results = data?.data || [];
        setCars(results);
        setTotalResults(results.length);
        setSemanticResults(null);
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [q]);

  const clearFilters = () => {
    setQ(DEFAULT_FILTERS);
  };

  const handleSemanticResults = (list) => {
    setSemanticResults(list || []);
    setTotalResults((list || []).length);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
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
                onClick={() => setViewMode("grid")}
                className={`btn ${
                  viewMode === "grid" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`btn ${
                  viewMode === "list" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Thanh tìm kiếm thông minh (semantic search) */}
          <div className="mt-4">
            <SemanticSearchBox onResults={handleSemanticResults} />
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-12 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="card sticky top-20">
              <div className="card-body space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-primary" />
                    Bộ lọc
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-danger hover:underline flex items-center gap-1"
                    >
                      <X size={14} />
                      Xóa
                    </button>
                  )}
                </div>

                {/* City Filter */}
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-primary" />
                    Địa điểm
                  </label>
                  <select
                    className="select w-full"
                    value={q.city}
                    onChange={(e) =>
                      setQ((prev) => ({ ...prev, city: e.target.value }))
                    }
                  >
                    {CITY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seats Filter */}
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <Users size={16} className="text-primary" />
                    Số chỗ ngồi
                  </label>
                  <select
                    className="select w-full"
                    value={q.seats}
                    onChange={(e) =>
                      setQ((prev) => ({ ...prev, seats: e.target.value }))
                    }
                  >
                    <option value="">Tất cả</option>
                    <option value="4">4 chỗ</option>
                    <option value="5">5 chỗ</option>
                    <option value="7">7 chỗ</option>
                    <option value="9">9 chỗ trở lên</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-primary" />
                    Khoảng giá (đ/ngày)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      className="input"
                      placeholder="Tối thiểu"
                      value={q.minPrice}
                      onChange={(e) =>
                        setQ((prev) => ({ ...prev, minPrice: e.target.value }))
                      }
                    />
                    <input
                      type="number"
                      className="input"
                      placeholder="Tối đa"
                      value={q.maxPrice}
                      onChange={(e) =>
                        setQ((prev) => ({ ...prev, maxPrice: e.target.value }))
                      }
                    />
                  </div>
                </div>
                {/* Segment / Hạng xe */}
                <div>
                  <label className="label mb-2">Hạng xe</label>
                  <select
                    className="select w-full"
                    value={q.segment}
                    onChange={(e) =>
                      setQ((prev) => ({ ...prev, segment: e.target.value }))
                    }
                  >
                    <option value="">Tất cả</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="premium">Cao cấp</option>
                    <option value="luxury">Xe sang</option>
                  </select>
                </div>

                {/* Chỉ hiện xe nổi bật */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="featuredOnly"
                    type="checkbox"
                    className="w-4 h-4"
                    checked={q.featured === "true"}
                    onChange={(e) =>
                      setQ((prev) => ({
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

                {/* Transmission */}
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <Gauge size={16} className="text-primary" />
                    Hộp số
                  </label>
                  <select
                    className="select w-full"
                    value={q.transmission}
                    onChange={(e) =>
                      setQ((prev) => ({
                        ...prev,
                        transmission: e.target.value,
                      }))
                    }
                  >
                    <option value="">Tất cả</option>
                    <option value="automatic">Số tự động</option>
                    <option value="manual">Số sàn</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="label mb-2">Hãng xe</label>
                  <select
                    className="select w-full"
                    value={q.brand}
                    onChange={(e) =>
                      setQ((prev) => ({ ...prev, brand: e.target.value }))
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
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="label mb-2">Nhiên liệu</label>
                  <select
                    className="select w-full"
                    value={q.fuel}
                    onChange={(e) =>
                      setQ((prev) => ({ ...prev, fuel: e.target.value }))
                    }
                  >
                    <option value="">Tất cả</option>
                    <option value="Xăng">Xăng</option>
                    <option value="Dầu diesel">Dầu diesel</option>
                    <option value="Điện">Điện</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  <Search size={18} />
                  {loading ? "Đang tìm..." : "Áp dụng"}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-primary shadow-lg w-14 h-14 rounded-full"
            >
              <Filter size={24} />
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--color-surface)] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Bộ lọc</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X size={24} />
                    </button>
                  </div>

                  {/* City filter (mobile) */}
                  <div>
                    <label className="label flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-primary" />
                      Địa điểm
                    </label>
                    <select
                      className="select w-full"
                      value={q.city}
                      onChange={(e) =>
                        setQ((prev) => ({ ...prev, city: e.target.value }))
                      }
                    >
                      {CITY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hạng xe (mobile) */}
                  <div>
                    <label className="label mb-2">Hạng xe</label>
                    <select
                      className="select w-full"
                      value={q.segment}
                      onChange={(e) =>
                        setQ((prev) => ({ ...prev, segment: e.target.value }))
                      }
                    >
                      <option value="">Tất cả</option>
                      <option value="standard">Tiêu chuẩn</option>
                      <option value="premium">Cao cấp</option>
                      <option value="luxury">Xe sang</option>
                    </select>
                  </div>

                  {/* Chỉ xe nổi bật (mobile) */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id="featuredOnlyMobile"
                      type="checkbox"
                      className="w-4 h-4"
                      checked={q.featured === "true"}
                      onChange={(e) =>
                        setQ((prev) => ({
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
                    className="btn btn-primary w-full mt-4"
                    onClick={() => setShowFilters(false)}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort & View Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--color-muted)]">
                  Sắp xếp:
                </label>
                <select
                  className="select text-sm"
                  value={q.sort}
                  onChange={(e) =>
                    setQ((prev) => ({ ...prev, sort: e.target.value }))
                  }
                >
                  <option value="popular">Phổ biến</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-[var(--color-bg)]" />
                    <div className="card-body space-y-3">
                      <div className="h-4 bg-[var(--color-bg)] rounded w-3/4" />
                      <div className="h-4 bg-[var(--color-bg)] rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && carsToShow.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-4"
                }
              >
                {carsToShow.map((c) => {
                  const name =
                    `${c.brand || ""} ${c.model || ""}`.trim() || "Xe tự lái";
                  const image =
                    c.images?.[0] ||
                    c.image ||
                    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";
                  const city = c.location?.city || c.city || "";
                  const district = c.location?.district || "";

                  if (viewMode === "grid") {
                    return (
                      <Link
                        key={c._id}
                        to={`/cars/${c._id}`}
                        state={{ car: c }}
                        className="card group hover:shadow-xl transition-all"
                      >
                        <div className="relative overflow-hidden rounded-t-[var(--radius-lg)]">
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {c.featured && (
                            <div className="absolute top-3 left-3">
                              <span className="badge badge-warning flex items-center gap-1">
                                <TrendingUp size={12} />
                                Nổi bật
                              </span>
                            </div>
                          )}
                          {c.avgRating && (
                            <div className="absolute top-3 right-3">
                              <span className="badge badge-success flex items-center gap-1">
                                <Star size={12} fill="currentColor" />
                                {c.avgRating}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-3">
                            <MapPin size={14} />
                            {city}
                            {district && ` • ${district}`}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)] mb-3">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {c.seatingCapacity || c.seats} chỗ
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Gauge size={14} />
                              {c.transmission === "automatic"
                                ? "Tự động"
                                : "Số sàn"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                            <div>
                              <span className="text-xl font-bold text-primary">
                                {fmtVND(c.pricePerDay)}đ
                              </span>
                              <span className="text-sm text-[var(--color-muted)]">
                                /ngày
                              </span>
                            </div>
                            <button className="btn btn-primary">
                              Thuê ngay
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  // List view
                  return (
                    <Link
                      key={c._id}
                      to={`/cars/${c._id}`}
                      state={{ car: c }}
                      className="card hover:shadow-xl transition-all"
                    >
                      <div className="card-body">
                        <div className="flex gap-4">
                          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)]">
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg">
                                  {name}
                                </h3>
                                {c.avgRating && (
                                  <span className="badge badge-success flex items-center gap-1">
                                    <Star size={12} fill="currentColor" />
                                    {c.avgRating}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-[var(--color-muted)] mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  {c.seatingCapacity || c.seats} chỗ
                                </span>
                                <span className="flex items-center gap-1">
                                  <Gauge size={14} />
                                  {c.transmission === "automatic"
                                    ? "Tự động"
                                    : "Số sàn"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-primary">
                                  {fmtVND(c.pricePerDay)}đ
                                </span>
                                <span className="text-sm text-[var(--color-muted)]">
                                  /ngày
                                </span>
                              </div>
                              <button className="btn btn-primary">
                                Thuê ngay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!loading && carsToShow.length === 0 && (
              <div className="card">
                <div className="card-body text-center py-16">
                  <div className="w-20 h-20 bg-[var(--color-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} className="text-[var(--color-muted)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Không tìm thấy xe phù hợp
                  </h3>
                  <p className="text-[var(--color-muted)] mb-6">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với điều kiện khác
                  </p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
