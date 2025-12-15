import api from "../../../lib/axios";

export const fetchAdminDashboard = async () => {
  const [statsRes, kycRes, bookingsRes, revenueRes, topCarsRes, userDistRes] =
    await Promise.all([
      api.get("/stats/admin"),
      api.get("/admin/kyc/pending"),
      api.get("/admin/bookings", { params: { limit: 5 } }),
      api.get("/stats/revenue-by-month"),
      api.get("/stats/top-cars"),
      api.get("/stats/user-distribution"),
    ]);

  return {
    stats: statsRes.data?.data ?? null,
    kycList: kycRes.data?.data ?? [],
    bookings: bookingsRes.data?.data?.items ?? [],
    revenueChart: revenueRes.data?.data ?? [],
    topCars: topCarsRes.data?.data ?? [],
    userDist: userDistRes.data?.data ?? [],
  };
};

export const approveKyc = (userId) => api.post(`/admin/kyc/${userId}/approve`);

export const rejectKyc = (userId, reason) =>
  api.post(`/admin/kyc/${userId}/reject`, { reason });
