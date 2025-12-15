import api from "../../../lib/axios";
import { ENDPOINTS } from "./ownerBookings.constants";

export const fetchOwnerBookings = async ({ q, status, page, limit }) => {
  const { data } = await api.get(ENDPOINTS.list, {
    params: { q, status, page, limit },
  });

  const items = data?.data || [];
  const pg = data?.paging || {};
  return {
    items,
    paging: {
      page: pg.page || page,
      pages: pg.pages || 1,
      total: pg.total || items.length,
    },
  };
};

export const exportOwnerBookings = async ({ q, status }) => {
  const res = await api.get(ENDPOINTS.export, {
    params: { q, status },
    responseType: "blob",
  });
  return res.data;
};

export const updateBookingStatus = async ({ bookingId, status }) => {
  const { data } = await api.patch(ENDPOINTS.status(bookingId), { status });
  return data?.data;
};
