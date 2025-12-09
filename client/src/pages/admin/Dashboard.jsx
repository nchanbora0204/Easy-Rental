import { useEffect, useState } from "react";
import exportCSV from "../../lib/exportCSV";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import api from "../../lib/axios";
import {
  DollarSign,
  ShieldCheck,
  Car,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";



export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [kycList, setKycList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [revenueChart, setRevenueChart] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [userDist, setUserDist] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, kycRes, bookingsRes, revenueRes, topCarsRes, userDistRes] = await Promise.all([
        api.get("/stats/admin"),
        api.get("/admin/kyc/pending"),
        api.get("/admin/bookings", { params: { limit: 5 } }),
        api.get("/stats/revenue-by-month"),
        api.get("/stats/top-cars"),
        api.get("/stats/user-distribution"),
      ]);
      setStats(statsRes.data?.data);
      setKycList(kycRes.data?.data || []);
      setBookings(bookingsRes.data?.data?.items || []);
      setRevenueChart(revenueRes.data?.data || []);
      setTopCars(topCarsRes.data?.data || []);
      setUserDist(userDistRes.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/admin/kyc/${userId}/approve`);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi duyệt KYC");
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.post(`/admin/kyc/${userId}/reject`, {
        reason: "Giấy tờ không hợp lệ",
      });
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi từ chối KYC");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </AdminLayout>
    );
  }

  const totals = stats?.totals || {};
  const statusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Tổng quan hệ thống</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {(stats?.paidRevenue || 0).toLocaleString()}đ
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chờ duyệt KYC</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totals.pendingKycCount || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ShieldCheck className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng xe</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totals.carsCount || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Người dùng</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totals.usersCount || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KYC Pending */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gray-600" size={20} />
                <h2 className="font-semibold text-gray-800">KYC chờ duyệt</h2>
              </div>
              <Link
                to="/admin/kyc"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="p-6">
              {kycList.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Không có yêu cầu nào
                </p>
              ) : (
                <div className="space-y-3">
                  {kycList.slice(0, 5).map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {user.kycProfile?.fullName || "Chưa có tên"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(user._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-gray-600" size={20} />
                <h2 className="font-semibold text-gray-800">
                  Đơn hàng gần đây
                </h2>
              </div>
              <Link
                to="/admin/bookings"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Chưa có đơn hàng nào
                </p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-800">
                          {booking.car?.brand} {booking.car?.model}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${statusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {booking.user?.name || booking.user?.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(booking.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-gray-600" size={20} />
              <h2 className="font-semibold text-gray-800">Doanh thu theo tháng</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => v.toLocaleString() + "đ"} />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Car className="text-gray-600" size={20} />
              <h2 className="font-semibold text-gray-800">Top xe doanh thu cao</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCars} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
                    <Cell key={`cell-${idx}`} fill={entry.role === "owner" ? "#6366F1" : "#F59E42"} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export/Report Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="btn btn-primary"
            onClick={() => exportCSV(revenueChart, "doanhthu.csv")}
          >
            Xuất báo cáo doanh thu
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => exportCSV(topCars, "topxe.csv")}
          >
            Xuất top xe
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => exportCSV(userDist, "nguoidung.csv")}
          >
            Xuất phân bổ người dùng
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
