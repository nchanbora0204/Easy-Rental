import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { fetchAdminDashboard, approveKyc, rejectKyc } from "./api";

import { DashboardHeader } from "./components/DashboardHeader";
import { ErrorBanner } from "./components/ErrorBanner";
import { StatsCards } from "./components/StatsCards";
import { KycPendingCard } from "./components/KycPendingCard";
import { RecentBookingsCard } from "./components/RecentBookingsCard";
import { ChartsGrid } from "./components/ChartsGrid";
import { ExportButtons } from "./components/ExportButtons";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [kycList, setKycList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [revenueChart, setRevenueChart] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [userDist, setUserDist] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAdminDashboard();
      setStats(data.stats);
      setKycList(data.kycList);
      setBookings(data.bookings);
      setRevenueChart(data.revenueChart);
      setTopCars(data.topCars);
      setUserDist(data.userDist);
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = useCallback(
    async (userId) => {
      try {
        setError("");
        await approveKyc(userId);
        await loadData();
      } catch (err) {
        setError(err?.response?.data?.message || "Lỗi duyệt KYC");
      }
    },
    [loadData]
  );

  const handleReject = useCallback(
    async (userId) => {
      try {
        setError("");
        await rejectKyc(userId, "Giấy tờ không hợp lệ");
        await loadData();
      } catch (err) {
        setError(err?.response?.data?.message || "Lỗi từ chối KYC");
      }
    },
    [loadData]
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <ErrorBanner error={error} />

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KycPendingCard
            kycList={kycList}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <RecentBookingsCard bookings={bookings} />
        </div>

        <ChartsGrid
          revenueChart={revenueChart}
          topCars={topCars}
          userDist={userDist}
        />

        <ExportButtons
          revenueChart={revenueChart}
          topCars={topCars}
          userDist={userDist}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
