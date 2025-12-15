import api from "../../../lib/axios";
import { ENDPOINTS } from "./constants";

export const fetchUsers = async ({ q, role, page, limit }) => {
  const params = { q, page, limit };
  if (role && role !== "all") params.role = role;

  const { data } = await api.get(ENDPOINTS.list, { params });
  const payload = data?.data || {};

  return {
    items: payload.items || [],
    total: payload.total || 0,
  };
};

export const lockUser = (id) =>
  api.patch(ENDPOINTS.lock(id), { isLocked: true });

export const unlockUser = (id) =>
  api.patch(ENDPOINTS.unlock(id), { isLocked: false });
