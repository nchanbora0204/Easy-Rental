import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Car, Users } from "lucide-react";

export const ChartsGrid = ({ revenueChart, topCars, userDist }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-gray-600" size={20} />
          <h2 className="font-semibold text-gray-800">Doanh thu theo tháng</h2>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={revenueChart}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => v.toLocaleString() + "đ"} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <Car className="text-gray-600" size={20} />
          <h2 className="font-semibold text-gray-800">Top xe doanh thu cao</h2>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={topCars}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="car" />
            <YAxis />
            <Tooltip formatter={(v) => v.toLocaleString() + "đ"} />
            <Bar dataKey="revenue" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-gray-600" size={20} />
          <h2 className="font-semibold text-gray-800">Phân bổ người dùng</h2>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={userDist}
              dataKey="count"
              nameKey="role"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={(entry) => entry.role}
            >
              {userDist.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.role === "owner" ? "#6366F1" : "#F59E42"}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
