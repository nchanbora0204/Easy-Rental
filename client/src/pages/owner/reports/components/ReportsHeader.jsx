import {
  BarChart2,
  CalendarRange,
} from "lucide-react";

export const ReportsHeader = ({
  from,
  to,
  setFrom,
  setTo,
  onApply,
  loading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart2 className="text-blue-600" size={26} />
          Báo cáo doanh thu
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Thống kê hiệu quả kinh doanh từ các đơn thuê xe của bạn
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <CalendarRange size={16} className="text-gray-500" />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <span className="text-gray-500">–</span>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang tải..." : "Áp dụng"}
        </button>
      </div>
    </div>
  );
};
