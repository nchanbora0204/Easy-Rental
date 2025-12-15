export const getApiErrorMessage = (e, fallback = "") =>
  e?.response?.data?.message || e?.message || fallback;

export const calcPageCount = (total, limit) => Math.ceil(total / limit) || 1;
