import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fmtVND, formatAxisVND } from "../ownerReports.utils";

export const RevenueByMonthCard = ({ show, revenueByMonth }) => {
  if (!show) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-semibold text-gray-800">Doanh thu theo tháng</h2>
          <p className="text-xs text-gray-500 mt-1">
            Tổng doanh thu các tháng (đơn đã thanh toán)
          </p>
        </div>
      </div>

      <div className="h-64">
        {revenueByMonth.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            Chưa có dữ liệu doanh thu theo tháng
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatAxisVND} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => `${fmtVND(value)}đ`}
                labelFormatter={(label) => `Tháng ${label}`}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
