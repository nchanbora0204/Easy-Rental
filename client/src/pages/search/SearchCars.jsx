import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axios";
import SemanticSearchBox from "../../components/SemanticSearchBox";

import {
  DEFAULT_FILTERS,
  buildFiltersFromSearchParams,
  buildSearchParamsFromFilters,
  hasActiveFilters,
  PAGE_SIZE_OPTIONS,
} from "./search.constants";

import { SearchHeader } from "./components/SearchHeader";
import { SearchToolbar } from "./components/SearchToolbar";
import { SearchFiltersSidebar } from "./components/SearchFiltersSidebar";
import { SearchFiltersDrawer } from "./components/SearchFiltersDrawer";
import { SearchResults } from "./components/SearchResults";

const clampInt = (value, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
};

const getInitialPageSize = (sp) => {
  const raw = sp.get("pageSize") || sp.get("limit");
  const n = clampInt(raw, PAGE_SIZE_OPTIONS[1] || 9);
  return PAGE_SIZE_OPTIONS.includes(n) ? n : PAGE_SIZE_OPTIONS[1] || 9;
};

const SearchCars = () => {
  const [sp, setSp] = useSearchParams();
  const spKey = sp.toString();

  const [filters, setFilters] = useState(() =>
    buildFiltersFromSearchParams(sp)
  );
  const [draft, setDraft] = useState(() => buildFiltersFromSearchParams(sp));

  const [cars, setCars] = useState([]);
  const [semanticResults, setSemanticResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [page, setPage] = useState(() => clampInt(sp.get("page"), 1));
  const [pageSize, setPageSize] = useState(() => getInitialPageSize(sp));

  useEffect(() => {
    const nextFilters = buildFiltersFromSearchParams(sp);
    setFilters(nextFilters);
    setDraft(nextFilters);
    setSemanticResults(null);

    setPage(clampInt(sp.get("page"), 1));
    setPageSize(getInitialPageSize(sp));
  }, [spKey]);

  const carsToShow = semanticResults ?? cars;
  const totalItems = carsToShow.length;

  const totalPages = useMemo(() => {
    const tp = Math.ceil(totalItems / pageSize);
    return Math.max(1, tp || 1);
  }, [totalItems, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedCars = useMemo(() => {
    const start = (page - 1) * pageSize;
    return carsToShow.slice(start, start + pageSize);
  }, [carsToShow, page, pageSize]);

  const rangeText = useMemo(() => {
    if (!totalItems) return "0 kết quả";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(totalItems, page * pageSize);
    return `${start}-${end}/${totalItems} kết quả`;
  }, [page, pageSize, totalItems]);

  const activeFilters = useMemo(() => hasActiveFilters(filters), [filters]);

  const load = useCallback(async (f) => {
    setLoading(true);
    setErr("");
    try {
      const params = {};

      if (f.city) params.city = f.city;
      if (f.seats) params.seats = f.seats;
      if (f.minPrice) params.minPrice = f.minPrice;
      if (f.maxPrice) params.maxPrice = f.maxPrice;
      if (f.transmission) params.transmission = f.transmission;
      if (f.brand) params.brand = f.brand;
      if (f.fuel) params.fuel = f.fuel;
      if (f.segment) params.segment = f.segment;
      if (f.featured) params.featured = f.featured;
      if (f.sort) params.sort = f.sort;

      const { data } = await api.get("/cars", { params });
      const results = data?.data || data?.items || [];
      setCars(Array.isArray(results) ? results : []);
      setSemanticResults(null);
    } catch (e) {
      setErr(
        e?.response?.data?.message || e.message || "Không tải được danh sách xe"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const syncUrl = (nextFilters, nextPage, nextPageSize) => {
    const nextSp = buildSearchParamsFromFilters(nextFilters);
    if (nextPage && nextPage !== 1) nextSp.set("page", String(nextPage));
    if (nextPageSize) nextSp.set("pageSize", String(nextPageSize));
    setSp(nextSp, { replace: true });
  };

  const applyFilters = () => {
    const next = { ...draft };
    setFilters(next);
    setSemanticResults(null);

    const nextPage = 1;
    setPage(nextPage);
    setShowFilters(false);

    syncUrl(next, nextPage, pageSize);
  };

  const clearFilters = () => {
    setDraft(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSemanticResults(null);

    const nextPage = 1;
    setPage(nextPage);
    setShowFilters(false);

    syncUrl(DEFAULT_FILTERS, nextPage, pageSize);
  };

  const handleSemanticResults = (list) => {
    const arr = Array.isArray(list) ? list : [];
    setSemanticResults(arr);

    const nextPage = 1;
    setPage(nextPage);

    syncUrl(filters, nextPage, pageSize);
  };

  const changePage = (nextPage) => {
    const p = Math.min(Math.max(1, nextPage), totalPages);
    setPage(p);
    syncUrl(filters, p, pageSize);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changePageSize = (nextSize) => {
    const size = PAGE_SIZE_OPTIONS.includes(nextSize)
      ? nextSize
      : PAGE_SIZE_OPTIONS[1] || 9;
    setPageSize(size);

    const nextPage = 1;
    setPage(nextPage);

    syncUrl(filters, nextPage, size);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SearchHeader
        totalResults={totalItems}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      >
        <SemanticSearchBox onResults={handleSemanticResults} />
      </SearchHeader>

      <div className="px-6 lg:px-12 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <SearchFiltersSidebar
            draft={draft}
            setDraft={setDraft}
            loading={loading}
            activeFilters={activeFilters}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          <SearchFiltersDrawer
            open={showFilters}
            draft={draft}
            setDraft={setDraft}
            activeFilters={activeFilters}
            onClose={() => setShowFilters(false)}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          <div className="lg:col-span-3 space-y-4">
            <SearchToolbar
              sort={draft.sort}
              onChangeSort={(v) => setDraft((prev) => ({ ...prev, sort: v }))}
              pageSize={pageSize}
              onChangePageSize={changePageSize}
              page={page}
              totalPages={totalPages}
              rangeText={rangeText}
              onOpenFilters={() => setShowFilters(true)}
            />

            <SearchResults
              loading={loading}
              err={err}
              cars={pagedCars}
              viewMode={viewMode}
              onClear={clearFilters}
              page={page}
              totalPages={totalPages}
              onChangePage={changePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCars;
