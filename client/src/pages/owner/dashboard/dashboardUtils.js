export const fmtISODate = (d) => d.toISOString().slice(0, 10);

export const getRange = (rangeDays) => {
  const to = new Date();
  const from = new Date(to.getTime() - rangeDays * 24 * 60 * 60 * 1000);
  return { from, to, fromStr: fmtISODate(from), toStr: fmtISODate(to) };
};

export const calcPendingCount = (byStatus = {}) =>
  (byStatus.pending || 0) + (byStatus.confirmed || 0) + (byStatus.ongoing || 0);

export const calcTodayRevenue = (revenueByDay = []) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  return revenueByDay.find((d) => d.date === todayStr)?.revenue || 0;
};

export const calcLast7DaysRevenue = (revenueByDay = []) => {
  const today0 = new Date();
  today0.setHours(0, 0, 0, 0);

  return revenueByDay.reduce((sum, d) => {
    const day = new Date(d.date);
    day.setHours(0, 0, 0, 0);
    const diffDays = (today0 - day) / (24 * 60 * 60 * 1000);
    return diffDays >= 0 && diffDays <= 6 ? sum + (d.revenue || 0) : sum;
  }, 0);
};

export const calcCarCountFromCapacity = (stats) => {
  const util = stats?.utilization || {};
  if (!stats?.range?.from || !stats?.range?.to || !util.capacityDays) return 0;

  const from = new Date(stats.range.from);
  const to = new Date(stats.range.to);
  const totalDays = Math.max(1, Math.ceil((to - from) / (24 * 60 * 60 * 1000)));
  return Math.round(util.capacityDays / totalDays);
};

export const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  ongoing: { label: "Đang thuê", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-700" },
};
