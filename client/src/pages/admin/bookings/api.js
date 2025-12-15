import api from "../../../lib/axios";
import { ENDPOINTS } from "./constants";

export const fetchBookings = async ({ status, from, to, q, page, limit }) => {
  const params = { page, limit };
  if (status && status !== "all") params.status = status;
  if (from) params.from = from;
  if (to) params.to = to;
  if (q) params.q = q;

  const { data } = await api.get(ENDPOINTS.list, { params });
  const payload = data?.data || {};
  return {
    items: payload.items || [],
    total: payload.total || 0,
  };
};

export const fetchBookingDetail = async (id) => {
  const { data } = await api.get(ENDPOINTS.detail(id));
  return data?.data || {};
};
