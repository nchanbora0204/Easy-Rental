import { useState } from "react";
import { Search } from "lucide-react";
import api from "../lib/axios";

export default function SemanticSearchBox({ onResults, filters = {} }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const text = q.trim();
    if (!text) return;

    try {
      setLoading(true);
      const params = {
        q: text,
        limit: 20,
      };
      if (filters.city) params.city = filters.city;
      if (filters.seats) params.seats = filters.seats;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.segment) params.segment = filters.segment;
      if (filters.brand) params.brand = filters.brand;
      if (filters.fuel) params.fuel = filters.fuel;

      const { data } = await api.get("/search/cars", { params });
      const list = data?.data ?? [];
      onResults?.(list);
    } catch (e) {
      console.error("semantic search error", e);
      alert(
        e?.response?.data?.message || e.message || "Không tìm được xe phù hợp."
      );
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

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
        onClick={handleSearch}
        disabled={loading}
        className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Đang tìm..." : "Tìm thông minh"}
      </button>
    </div>
  );
}
