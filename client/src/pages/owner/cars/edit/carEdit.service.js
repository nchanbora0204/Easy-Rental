import api from "../../../../lib/axios";

export const getCarById = async (id) => {
  const { data } = await api.get(`/cars/${id}`);
  return data;
};

export const updateCarById = async (id, payload) => {
  const { data } = await api.put(`/cars/${id}`, payload);
  return data;
};
