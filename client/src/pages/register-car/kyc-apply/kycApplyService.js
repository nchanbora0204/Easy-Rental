import api from "../../../lib/axios";

export const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data?.data || {};
};

export const uploadKycFiles = async (form) => {
  const fd = new FormData();
  if (form.fFront) fd.append("idFrontUrl", form.fFront);
  if (form.fBack) fd.append("idBackUrl", form.fBack);
  if (form.fSelfie) fd.append("selfieWithIdUrl", form.fSelfie);
  if (form.fVehicleRegistration)
    fd.append("vehicleRegistrationUrl", form.fVehicleRegistration);
  if (form.fVehicleInsurance)
    fd.append("vehicleInsuranceUrl", form.fVehicleInsurance);

  const { data } = await api.post("/uploads/kyc", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data?.data || {};
};

export const submitKycApply = async (payload) => {
  await api.post("/kyc/apply", payload);
};
