import api from "../../../lib/axios";

export const getPendingKyc = async () => {
  return api.get("/admin/kyc/pending", { params: { status: "pending" } });
};

export const approveKyc = async (userId) => {
  return api.post(`/admin/kyc/${userId}/approve`);
};

export const rejectKyc = async (userId, reason) => {
  return api.post(`/admin/kyc/${userId}/reject`, { reason });
};
