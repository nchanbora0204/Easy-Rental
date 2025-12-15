export const CITY_OPTIONS = [
  { value: "", label: "Tất cả thành phố" },
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "hanoi", label: "Hà Nội" },
  { value: "danang", label: "Đà Nẵng" },
  { value: "cantho", label: "Cần Thơ" },
  { value: "nhatrang", label: "Nha Trang" },
];

export const DEFAULT_FILTERS = {
  pickup: "",
  return: "",
  pickupTime: "",
  returnTime: "",
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

export const FILTER_KEYS = [
  "pickup",
  "return",
  "pickupTime",
  "returnTime",
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
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Phổ biến" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "newest", label: "Mới nhất" },
];

export const PAGE_SIZE_OPTIONS = [6, 9, 12, 18];

export const buildFiltersFromSearchParams = (sp) => {
  const initial = { ...DEFAULT_FILTERS };
  FILTER_KEYS.forEach((key) => {
    const v = sp.get(key);
    if (v != null && v !== "") initial[key] = v;
  });
  return initial;
};

export const buildSearchParamsFromFilters = (filters) => {
  const p = new URLSearchParams();
  FILTER_KEYS.forEach((key) => {
    const v = filters[key];
    if (v != null && v !== "" && v !== DEFAULT_FILTERS[key])
      p.set(key, String(v));
  });
  return p;
};

export const hasActiveFilters = (filters) => {
  return Boolean(
    filters.pickup ||
      filters.return ||
      filters.city ||
      filters.seats ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.transmission ||
      filters.brand ||
      filters.fuel ||
      filters.segment ||
      filters.featured
  );
};
