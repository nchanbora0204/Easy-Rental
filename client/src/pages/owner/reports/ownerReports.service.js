import api from "../../../lib/axios";

export const getOwnerSummary = async ({ from, to }) => {
  const { data } = await api.get("/stats/owner/summary", {
    params: { from, to },
  });
  return data?.data || null;
};
