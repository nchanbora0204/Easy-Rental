import api from "../../../lib/axios";

export const fetchOwnerCalendar = async ({ from, to }) => {
  const { data } = await api.get("/owner/calendar", { params: { from, to } });
  const d = data?.data || {};
  return {
    bookings: d.bookings || [],
    blocks: d.blocks || [],
  };
};

export const createCalendarBlock = async ({ date, reason }) => {
  const { data } = await api.post("/owner/calendar/blocks", { date, reason });
  return data?.data || null;
};

export const deleteCalendarBlock = (blockId) =>
  api.delete(`/owner/calendar/blocks/${blockId}`);
