import { useCallback, useEffect, useMemo, useState } from "react";
import OwnerLayout from "../layout/OwnerLayout";

import { getOwnerSummary } from "./ownerReports.service";
import {
  buildRevenueByMonth,
  calcCompletionRate,
  calcTotalBookings,
  getApiErrorMessage,
  hasReportData,
} from "./ownerReports.utils";

import { ReportsHeader } from "./components/ReportsHeader";
import { ErrorAlert } from "./components/ErrorAlert";
import { EmptyState } from "./components/EmptyState";
import { SummaryCards } from "./components/SummaryCards";
import { RevenueByDayCard } from "./components/RevenueByDayCard";
import { RevenueByMonthCard } from "./components/RevenueByMonthCard";
import { TopCarsTable } from "./components/TopCarsTable";

const OwnerReports = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getOwnerSummary({ from, to });
      setStats(data || null);
    } catch (e) {
      setErr(getApiErrorMessage(e, "Không tải được báo cáo doanh thu"));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const bookingsByStatus = stats?.bookingsByStatus || {};

  const totalBookings = useMemo(
    () => calcTotalBookings(bookingsByStatus),
    [bookingsByStatus]
  );

  const completionRate = useMemo(
    () => calcCompletionRate(bookingsByStatus, totalBookings),
    [bookingsByStatus, totalBookings]
  );

  const totalRevenue = stats?.paidRevenue || 0;
  const revenueByDay = stats?.revenueByDay || [];
  const revenueByMonth = useMemo(
    () => buildRevenueByMonth(stats?.revenueByMonth),
    [stats?.revenueByMonth]
  );

  const topCars = stats?.topCars || [];
  const utilization = stats?.utilization || {
    utilization: 0,
    bookedDays: 0,
    capacityDays: 0,
  };

  const hasData = useMemo(
    () => hasReportData({ totalBookings, totalRevenue }),
    [totalBookings, totalRevenue]
  );

  return (
    <OwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <ReportsHeader
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          onApply={load}
          loading={loading}
        />

        <ErrorAlert message={err} />

        <EmptyState show={!loading && !hasData} />

        <SummaryCards
          show={hasData}
          totalRevenue={totalRevenue}
          totalBookings={totalBookings}
          bookingsByStatus={bookingsByStatus}
          completionRate={completionRate}
          utilization={utilization}
        />

        {hasData && (
          <div className="grid lg:grid-cols-2 gap-6">
            <RevenueByDayCard show={hasData} revenueByDay={revenueByDay} />
            <RevenueByMonthCard
              show={hasData}
              revenueByMonth={revenueByMonth}
            />
          </div>
        )}

        <TopCarsTable show={hasData} topCars={topCars} />
      </div>
    </OwnerLayout>
  );
};

export default OwnerReports;
