import { useEffect, useMemo, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import api from "../../lib/axios";
import {
  BarChart2,
  CalendarRange,
  Wallet,
  ListChecks,
  Activity,
  CarFront,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const fmtVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));

export default function OwnerReports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/stats/owner/summary", {
        // 👉 nếu backend khác URL, sửa ở đây
        params: { from, to },
      });
      setStats(data?.data || null);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e.message ||
          "Không tải được báo cáo doanh thu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookingsByStatus = stats?.bookingsByStatus || {};

  const totalBookings = useMemo(() => {
    const s = bookingsByStatus;
    return (
      (s.pending || 0) +
      (s.confirmed || 0) +
      (s.ongoing || 0) +
      (s.completed || 0) +
      (s.cancelled || 0) +
      (s.cancelled_timeout || 0)
    );
  }, [bookingsByStatus]);

  const completionRate = useMemo(() => {
    if (!totalBookings) return 0;
    const done = bookingsByStatus.completed || 0;
    return Math.round((done / totalBookings) * 100);
  }, [bookingsByStatus, totalBookings]);

  const totalRevenue = stats?.paidRevenue || 0;
  const revenueByDay = stats?.revenueByDay || []; // [{date, revenue}]
  const revenueByMonth = (stats?.revenueByMonth || []).map((m) => ({
    month: m.ym || `${m.year || ""}-${String(m.month || "").padStart(2, "0")}`,
    revenue: m.revenue || 0,
    count: m.count || 0,
  }));
  const topCars = stats?.topCars || []; // [{carId, brand, model, revenue, orders}]
  const utilization = stats?.utilization || {
    utilization: 0,
    bookedDays: 0,
    capacityDays: 0,
  };

  const hasData = totalBookings > 0 || totalRevenue > 0;

  return (
    <OwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/*Header*/}
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

          {/*Bộ lọc ngày*/}
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
              onClick={load}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tải..." : "Áp dụng"}
            </button>
          </div>
        </div>

        {/*Error*/}
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={18} />
            <span>{err}</span>
          </div>
        )}

        {/*Nếu chưa có data*/}
        {!loading && !hasData && (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
            Chưa có dữ liệu để thống kê. Hãy chờ khách đặt xe nhé!
          </div>
        )}

        {/*Summary cards*/}
        {hasData && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/*Tổng doanh thu*/}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Wallet className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Tổng doanh thu</div>
                <div className="text-lg font-bold text-gray-900">
                  {fmtVND(totalRevenue)}đ
                </div>
              </div>
            </div>

            {/*Tổng số đơn*/}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <ListChecks className="text-green-600" size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Tổng số đơn</div>
                <div className="text-lg font-bold text-gray-900">
                  {totalBookings}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Hoàn thành: {bookingsByStatus.completed || 0} • Hủy:{" "}
                  {(bookingsByStatus.cancelled || 0) +
                    (bookingsByStatus.cancelled_timeout || 0)}
                </div>
              </div>
            </div>

            {/*Tỉ lệ hoàn thành*/}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Tỉ lệ hoàn thành</div>
              <div className="text-lg font-bold text-gray-900">
                {completionRate}%
              </div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500 mt-2">
                Dựa trên tất cả trạng thái đơn trong khoảng thời gian lọc
              </div>
            </div>

            {/*Mức độ sử dụng xe*/}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-purple-600" />
                <span className="text-xs text-gray-500">Mức độ sử dụng xe</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {utilization.utilization ?? 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <CarFront size={12} />
                Ngày được thuê: {utilization.bookedDays ?? 0} /{" "}
                {utilization.capacityDays ?? 0}
              </div>
            </div>
          </div>
        )}

        {/*Charts*/}
        {hasData && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/*Doanh thu theo ngày*/}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Doanh thu theo ngày
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ tính các đơn đã thanh toán
                  </p>
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
                      <YAxis
                        tickFormatter={(v) =>
                          v >= 1_000_000
                            ? `${Math.round(v / 1_000_000)}tr`
                            : `${Math.round(v / 1_000)}k`
                        }
                        tick={{ fontSize: 11 }}
                      />
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

            {/*Doanh thu theo tháng*/}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Doanh thu theo tháng
                  </h2>
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
                      <YAxis
                        tickFormatter={(v) =>
                          v >= 1_000_000
                            ? `${Math.round(v / 1_000_000)}tr`
                            : `${Math.round(v / 1_000)}k`
                        }
                        tick={{ fontSize: 11 }}
                      />
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
          </div>
        )}

        {/*Top xe theo doanh thu*/}
        {hasData && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Top xe theo doanh thu
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Dựa trên tổng doanh thu các đơn đã thanh toán
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      #
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Xe
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Số đơn
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCars.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                  {topCars.map((c, idx) => (
                    <tr
                      key={c.carId || `${c.brand}-${c.model}-${idx}`}
                      className="border-t"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">
                        {c.brand} {c.model}{" "}
                        {c.year ? (
                          <span className="text-gray-400">({c.year})</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{c.orders ?? c.count ?? 0}</td>
                      <td className="px-4 py-3 font-semibold">
                        {fmtVND(c.revenue || 0)}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
