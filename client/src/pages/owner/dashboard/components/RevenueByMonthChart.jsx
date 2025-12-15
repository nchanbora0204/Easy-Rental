import { TrendingUp } from "lucide-react";

export const RevenueByMonthChart = ({ data = [] }) => {
  const list = Array.isArray(data) ? data : [];

  return (
    <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-gray-600" size={20} />
        <h2 className="font-semibold text-gray-800">Doanh thu theo tháng</h2>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Chưa có dữ liệu doanh thu
        </div>
      ) : (
        <div className="flex items-end gap-2 h-48">
          {list.map((item) => {
            const maxRev = Math.max(...list.map((d) => d.revenue || 0), 1);
            const height = ((item.revenue || 0) / maxRev) * 100;
            const label = item.ym
              ? `${String(item.ym).slice(5)}/${String(item.ym).slice(2, 4)}`
              : "";

            return (
              <div
                key={item.ym || label}
                className="flex-1 flex flex-col items-center justify-end"
              >
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${Number(item.revenue || 0).toLocaleString()}đ`}
                />
                <span className="text-[10px] text-gray-400 mt-2">{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
