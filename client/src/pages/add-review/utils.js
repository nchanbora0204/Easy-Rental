export const buildCarName = (car) => {
  const name = `${car?.brand || ""} ${car?.model || ""}`.trim();
  return name || car?.name || "Xe tự lái";
};

export const bookingCode = (bookingId = "") => String(bookingId).slice(-6);

export const safeMessage = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback;

export const isNotFound = (e) => e?.response?.status === 404;
