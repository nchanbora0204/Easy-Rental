import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../lib/axios";

const cleanObject = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

const SemanticSearchBox = ({
  onResults,
  onError,
  filters = {},
  limit = 20,
}) => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const paramsBase = useMemo(
    () =>
      cleanObject({
        limit,
        city: filters.city,
        seats: filters.seats,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        segment: filters.segment,
        brand: filters.brand,
        fuel: filters.fuel,
      }),
    [filters, limit]
  );

  const handleSearch = useCallback(async () => {
    const text = q.trim();
    if (!text || loading) return;

    try {
      setLoading(true);

      const params = { ...paramsBase, q: text };
      const { data } = await api.get("/search/cars", { params });

      const list = data?.data ?? [];
      onResults?.(list);
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Không tìm được xe phù hợp.";
      console.error("semantic search error", e);

      if (onError) onError(message, e);
      else alert(message);
    } finally {
      setLoading(false);
    }
  }, [q, loading, paramsBase, onResults, onError]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  return (
    <div className="flex items-center gap-2 bg-white/90 border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
      <Search size={18} className="text-gray-400" />

      <input
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        placeholder="Ví dụ: xe 7 chỗ đi Đà Lạt, gầm cao, tiết kiệm xăng..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={loading || !q.trim()}
        className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Đang tìm..." : "Tìm thông minh"}
      </button>
    </div>
  );
};

export default SemanticSearchBox;
