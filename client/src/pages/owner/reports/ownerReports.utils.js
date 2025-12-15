export const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(Number(n || 0));

export const formatAxisVND = (v) => {
  const n = Number(v || 0);
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}tr`;
  return `${Math.round(n / 1_000)}k`;
};

export const buildRevenueByMonth = (raw) =>
  (raw || []).map((m) => ({
    month: m.ym || `${m.year || ""}-${String(m.month || "").padStart(2, "0")}`,
    revenue: m.revenue || 0,
    count: m.count || 0,
  }));

export const calcTotalBookings = (bookingsByStatus = {}) => {
  const s = bookingsByStatus;
  return (
    (s.pending || 0) +
    (s.confirmed || 0) +
    (s.ongoing || 0) +
    (s.completed || 0) +
    (s.cancelled || 0) +
    (s.cancelled_timeout || 0)
  );
};

export const calcCompletionRate = (
  bookingsByStatus = {},
  totalBookings = 0
) => {
  if (!totalBookings) return 0;
  const done = bookingsByStatus.completed || 0;
  return Math.round((done / totalBookings) * 100);
};

export const hasReportData = ({ totalBookings = 0, totalRevenue = 0 } = {}) =>
  totalBookings > 0 || totalRevenue > 0;

export const getApiErrorMessage = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || "Có lỗi xảy ra";
