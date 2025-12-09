import { useEffect, useState } from "react";
import api from "../../lib/axios";
import OwnerLayout from "./OwnerLayout";
import {
  DollarSign,
  ClipboardList,
  Car,
  TrendingUp,
  AlertCircle,
  Calendar,
  Activity,
  Bell,
} from "lucide-react";

export default function OwnerDashboard() {
  const [rangeDays, setRangeDays] = useState(90);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [rangeDays]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const to = new Date();
      const from = new Date(to.getTime() - rangeDays * 24 * 60 * 60 * 1000);
      const fmt = (d) => d.toISOString().slice(0, 10);

      const [statsRes, bookingsRes] = await Promise.all([
        api.get("/stats/owner", { params: { from: fmt(from), to: fmt(to) } }),
        api.get("/bookings/owner", { params: { limit: 5, page: 1 } }),
      ]);

      setStats(statsRes.data?.data);
      setBookings(
        bookingsRes.data?.data?.items || bookingsRes.data?.data || []
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </OwnerLayout>
    );
  }

  const byStatus = stats?.bookingsByStatus || {};
  const completed = byStatus.completed || 0;
  const pending =
    (byStatus.pending || 0) +
    (byStatus.confirmed || 0) +
    (byStatus.ongoing || 0);
  const util = stats?.utilization || {};
  const revenue = stats?.paidRevenue || 0;

  const revenueByDay = stats?.revenueByDay || [];
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayRevenue =
    revenueByDay.find((d) => d.date === todayStr)?.revenue || 0;

  const last7Revenue = revenueByDay.reduce((sum, d) => {
    const day = new Date(d.date);
    const diffDays =
      (new Date().setHours(0, 0, 0, 0) - day.setHours(0, 0, 0, 0)) /
      (24 * 60 * 60 * 1000);
    return diffDays >= 0 && diffDays <= 6 ? sum + d.revenue : sum;
  }, 0);

  // Tính số xe từ capacityDays
  let carCount = 0;
  if (stats?.range?.from && stats?.range?.to && util.capacityDays) {
    const from = new Date(stats.range.from);
    const to = new Date(stats.range.to);
    const totalDays = Math.max(
      1,
      Math.ceil((to - from) / (24 * 60 * 60 * 1000))
    );
    carCount = Math.round(util.capacityDays / totalDays);
  }

  const statusMap = {
    pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    ongoing: { label: "Đang thuê", color: "bg-purple-100 text-purple-700" },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-700" },
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
            <p className="text-gray-500 mt-1">Theo dõi hiệu suất kinh doanh</p>
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Khoảng:</span>
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              {[30, 90, 180].map((days) => (
                <button
                  key={days}
                  onClick={() => setRangeDays(days)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    rangeDays === days
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {Math.round(days / 30)} tháng
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Pending Alert */}
        {pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <Bell size={18} />
            <span>
              Bạn có <strong>{pending} đơn</strong> cần xác nhận/đang diễn ra
            </span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Doanh thu</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
              </div>
            </div>

            <p className="text-2xl font-bold text-gray-800">
              {revenue.toLocaleString()}đ
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Đã thanh toán {Math.round(rangeDays / 30)} tháng qua
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-green-50 rounded-md px-3 py-2">
                <p className="text-gray-500">Hôm nay</p>
                <p className="font-semibold text-gray-800">
                  {todayRevenue.toLocaleString()}đ
                </p>
              </div>
              <div className="bg-blue-50 rounded-md px-3 py-2">
                <p className="text-gray-500">7 ngày gần nhất</p>
                <p className="font-semibold text-gray-800">
                  {last7Revenue.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Đơn hoàn thành</p>
              <div className="bg-blue-100 p-2 rounded-lg">
                <ClipboardList className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{completed}</p>
            <p className="text-xs text-gray-500 mt-2">Tổng đơn đã kết thúc</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Số xe</p>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Car className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{carCount}</p>
            <p className="text-xs text-gray-500 mt-2">Xe đang hoạt động</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Tỷ lệ khai thác</p>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Activity className="text-orange-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {util.utilization || 0}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {util.bookedDays || 0}/{util.capacityDays || 0} ngày
            </p>
          </div>
        </div>

        {/* Charts & Top Cars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue by Month Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-gray-600" size={20} />
              <h2 className="font-semibold text-gray-800">
                Doanh thu theo tháng
              </h2>
            </div>

            {(stats?.revenueByMonth || []).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Chưa có dữ liệu doanh thu
              </div>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {(stats?.revenueByMonth || []).map((item) => {
                  const maxRev = Math.max(
                    ...(stats?.revenueByMonth || []).map((d) => d.revenue),
                    1
                  );
                  const height = (item.revenue / maxRev) * 100;
                  const label = item.ym
                    ? `${item.ym.slice(5)}/${item.ym.slice(2, 4)}`
                    : "";

                  return (
                    <div
                      key={item.ym}
                      className="flex-1 flex flex-col items-center justify-end"
                    >
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                        title={`${item.revenue.toLocaleString()}đ`}
                      />
                      <span className="text-[10px] text-gray-400 mt-2">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Cars */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="text-gray-600" size={20} />
              <h2 className="font-semibold text-gray-800">Top xe</h2>
            </div>

            {(stats?.topCars || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có dữ liệu
              </div>
            ) : (
              <div className="space-y-3">
                {(stats?.topCars || []).slice(0, 5).map((car, idx) => (
                  <div
                    key={car.carId || idx}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {car.orders} đơn · {car.revenue?.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-gray-600" size={20} />
            <h2 className="font-semibold text-gray-800">Đơn gần đây</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-2 px-3 text-gray-600">Mã đơn</th>
                    <th className="py-2 px-3 text-gray-600">Khách</th>
                    <th className="py-2 px-3 text-gray-600">Xe</th>
                    <th className="py-2 px-3 text-gray-600">Thời gian</th>
                    <th className="py-2 px-3 text-gray-600">Tổng tiền</th>
                    <th className="py-2 px-3 text-gray-600">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {b.code || b._id?.slice(-6)}
                      </td>
                      <td className="py-3 px-3 text-gray-700">
                        {b.user?.name || b.user?.email}
                      </td>
                      <td className="py-3 px-3 text-gray-700">
                        {b.car?.brand} {b.car?.model}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">
                        {new Date(b.pickupDate).toLocaleDateString()} -{" "}
                        {new Date(b.returnDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-gray-700">
                        {b.total?.toLocaleString()}đ
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            statusMap[b.status]?.color || "bg-gray-100"
                          }`}
                        >
                          {statusMap[b.status]?.label || b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
