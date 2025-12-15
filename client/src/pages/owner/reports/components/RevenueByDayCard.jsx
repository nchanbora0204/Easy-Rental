import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fmtVND, formatAxisVND } from "../ownerReports.utils";

export const RevenueByDayCard = ({ show, revenueByDay }) => {
  if (!show) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-semibold text-gray-800">Doanh thu theo ngày</h2>
          <p className="text-xs text-gray-500 mt-1">Chỉ tính các đơn đã thanh toán</p>
        </div>
      </div>

      <div className="h-64">
        {revenueByDay.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            Chưa có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatAxisVND} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => `${fmtVND(value)}đ`}
                labelFormatter={(label) => `Ngày ${label}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
