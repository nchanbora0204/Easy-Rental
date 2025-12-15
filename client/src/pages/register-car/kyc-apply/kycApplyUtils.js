export const getApiErrorMessage = (e, fallback = "Có lỗi xảy ra") =>
  e?.response?.data?.message || e?.message || fallback;

export const sliceDateInput = (isoLike) =>
  isoLike ? String(isoLike).slice(0, 10) : "";

export const buildInitialForm = (initial = {}) => ({
  fullName: initial?.fullName || "",
  phone: initial?.phone || "",
  dateOfBirth: sliceDateInput(initial?.dateOfBirth),
  idNumber: initial?.idNumber || "",
  idIssueDate: sliceDateInput(initial?.idIssueDate),
  address: initial?.address || "",
  bankAccount: initial?.bankAccount || "",
  bankName: initial?.bankName || "",
  note: initial?.note || "",
  fFront: null,
  fBack: null,
  fSelfie: null,
  fVehicleRegistration: null,
  fVehicleInsurance: null,
});

export const buildPreviewReader = (file, onDone) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => onDone?.(reader.result);
  reader.readAsDataURL(file);
};
