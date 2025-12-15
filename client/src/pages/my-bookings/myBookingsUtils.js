export const getApiErrorMessage = (e, fallback = "Có lỗi xảy ra") =>
  e?.response?.data?.message || e?.message || fallback;

export const formatDateVI = (dateLike) => {
  if (!dateLike) return "-";
  try {
    return new Date(dateLike).toLocaleDateString("vi-VN");
  } catch {
    return String(dateLike);
  }
};

export const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(Number(n || 0));
