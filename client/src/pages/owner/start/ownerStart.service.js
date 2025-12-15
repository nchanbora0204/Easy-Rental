import api from "../../../lib/axios";

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data?.data || {};
};

export const getKycMe = async () => {
  const { data } = await api.get("/kyc/me");
  return data?.data || {};
};

export const updateMyProfile = async ({ name, phone, city }) => {
  await api.patch("/users/me", { name, phone, city });
};
