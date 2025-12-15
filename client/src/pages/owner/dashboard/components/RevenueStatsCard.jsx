import { DollarSign } from "lucide-react";
import { StatCard } from "./StatCard";

export const RevenueStatsCard = ({
  revenue,
  rangeDays,
  todayRevenue,
  last7Revenue,
}) => {
  return (
    <StatCard
      title="Doanh thu"
      icon={<DollarSign className="text-green-600" size={20} />}
      iconWrapClassName="bg-green-100 p-2 rounded-lg"
      footer={`Đã thanh toán ${Math.round(rangeDays / 30)} tháng qua`}
    >
      <p className="text-2xl font-bold text-gray-800">
        {Number(revenue || 0).toLocaleString()}đ
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-green-50 rounded-md px-3 py-2">
          <p className="text-gray-500">Hôm nay</p>
          <p className="font-semibold text-gray-800">
            {Number(todayRevenue || 0).toLocaleString()}đ
          </p>
        </div>
        <div className="bg-blue-50 rounded-md px-3 py-2">
          <p className="text-gray-500">7 ngày gần nhất</p>
          <p className="font-semibold text-gray-800">
            {Number(last7Revenue || 0).toLocaleString()}đ
          </p>
        </div>
      </div>
    </StatCard>
  );
};
