import { useEffect, useState } from "react";
import { OwnerLayout } from "../layout/OwnerLayout"; // named export theo refactor trước
import { fetchOwnerDashboard } from "./dashboardService";
import {
  calcCarCountFromCapacity,
  calcLast7DaysRevenue,
  calcPendingCount,
  calcTodayRevenue,
  getRange,
} from "./dashboardUtils";

import { DashboardHeader } from "./components/DashboardHeader";
import { ErrorBanner } from "./components/ErrorBanner";
import { PendingBanner } from "./components/PendingBanner";
import { RevenueStatsCard } from "./components/RevenueStatsCard";
import { StatCard } from "./components/StatCard";
import { RevenueByMonthChart } from "./components/RevenueByMonthChart";
import { TopCarsCard } from "./components/TopCarsCard";
import { RecentBookingsTable } from "./components/RecentBookingsTable";

import { ClipboardList, Car, Activity } from "lucide-react";

export const OwnerDashboard = () => {
  const [rangeDays, setRangeDays] = useState(90);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const { fromStr, toStr } = getRange(rangeDays);
        const res = await fetchOwnerDashboard({
          from: fromStr,
          to: toStr,
          bookingsLimit: 5,
        });

        if (!alive) return;
        setStats(res.stats);
        setBookings(res.bookings);
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [rangeDays]);

  const byStatus = stats?.bookingsByStatus || {};
  const completed = byStatus.completed || 0;
  const pending = calcPendingCount(byStatus);

  const util = stats?.utilization || {};
  const revenue = stats?.paidRevenue || 0;

  const revenueByDay = stats?.revenueByDay || [];
  const todayRevenue = calcTodayRevenue(revenueByDay);
  const last7Revenue = calcLast7DaysRevenue(revenueByDay);

  const carCount = calcCarCountFromCapacity(stats);

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <DashboardHeader
          rangeDays={rangeDays}
          onChangeRange={setRangeDays}
        />

        <ErrorBanner message={error} />
        <PendingBanner pending={pending} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevenueStatsCard
            revenue={revenue}
            rangeDays={rangeDays}
            todayRevenue={todayRevenue}
            last7Revenue={last7Revenue}
          />

          <StatCard
            title="Đơn hoàn thành"
            icon={<ClipboardList className="text-blue-600" size={20} />}
            iconWrapClassName="bg-blue-100 p-2 rounded-lg"
            footer="Tổng đơn đã kết thúc"
          >
            <p className="text-2xl font-bold text-gray-800">{completed}</p>
          </StatCard>

          <StatCard
            title="Số xe"
            icon={<Car className="text-purple-600" size={20} />}
            iconWrapClassName="bg-purple-100 p-2 rounded-lg"
            footer="Xe đang hoạt động"
          >
            <p className="text-2xl font-bold text-gray-800">{carCount}</p>
          </StatCard>

          <StatCard
            title="Tỷ lệ khai thác"
            icon={<Activity className="text-orange-600" size={20} />}
            iconWrapClassName="bg-orange-100 p-2 rounded-lg"
            footer={`${util.bookedDays || 0}/${util.capacityDays || 0} ngày`}
          >
            <p className="text-2xl font-bold text-gray-800">
              {util.utilization || 0}%
            </p>
          </StatCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueByMonthChart data={stats?.revenueByMonth || []} />
          <TopCarsCard topCars={stats?.topCars || []} />
        </div>

        <RecentBookingsTable bookings={bookings} />
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
