import api from "../../../../lib/axios";

export const createCar = async (formData) => {
  const { data } = await api.post("/cars", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
