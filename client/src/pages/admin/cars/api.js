import api from "../../../lib/axios";
import { ENDPOINTS } from "./constants";


export const fetchCars = async ({ q, status, page, limit }) => {
  const params = { q, page, limit };
  if (status === "active") params.active = "true";
  else if (status === "removed") params.active = "false";

  const { data } = await api.get(ENDPOINTS.list, { params });
  const payload = data?.data || {};
  return {
    items: payload.items || [],
    total: payload.total || 0,
  };
};

export const carAction = async ({ id, kind }) => {
  const url = kind === "remove" ? ENDPOINTS.remove(id) : ENDPOINTS.restore(id);

  try {
    await api.post(url);
  } catch (err) {
    if (err?.response?.status === 404) {
      await api.patch(url);
      return;
    }
    throw err;
  }
};
