import api from "../../../lib/axios";

export const fetchOwnerDashboard = async ({ from, to, bookingsLimit = 5 }) => {
  const [statsRes, bookingsRes] = await Promise.all([
    api.get("/stats/owner", { params: { from, to } }),
    api.get("/bookings/owner", { params: { limit: bookingsLimit, page: 1 } }),
  ]);

  const stats = statsRes?.data?.data ?? null;
  const bookings =
    bookingsRes?.data?.data?.items ?? bookingsRes?.data?.data ?? [];

  return { stats, bookings };
};
