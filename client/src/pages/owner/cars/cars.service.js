import api from "../../../lib/axios";
import { OWNER_CARS_ENDPOINTS } from "./cars.endpoints";

export const getOwnerCars = async ({ q, status, page, limit }) => {
  const { data } = await api.get(OWNER_CARS_ENDPOINTS.list, {
    params: { q, status, page, limit },
  });
  const { items = [], total = 0 } = data?.data || {};
  return { items, total };
};

export const toggleOwnerCar = async (id) => {
  await api.patch(OWNER_CARS_ENDPOINTS.toggle(id));
};

export const removeOwnerCar = async (id) => {
  await api.delete(OWNER_CARS_ENDPOINTS.remove(id));
};

export const restoreOwnerCar = async (id) => {
  await api.patch(OWNER_CARS_ENDPOINTS.restore(id));
};
