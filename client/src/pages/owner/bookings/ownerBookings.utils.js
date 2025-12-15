export const fmtMoneyVI = (n) =>
  new Intl.NumberFormat("vi-VN").format(Number(n || 0));

export const fmtDateVI = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  return d.toLocaleDateString("vi-VN");
};

export const fmtTimeVI = (v) => {
  if (!v) return "";
  return new Date(v)
    .toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    .replace(",", "");
};

export const fmtDateTimeVI = (v) => {
  if (!v) return "-";
  return new Date(v).toLocaleString("vi-VN");
};

export const pickCarUser = (booking) => {
  const carData = Array.isArray(booking?.car) ? booking.car[0] : booking?.car;
  const userData = Array.isArray(booking?.user) ? booking.user[0] : booking?.user;

  const carName =
    `${carData?.brand || ""} ${carData?.model || ""}`.trim() || "Xe tự lái";

  const userName =
    userData?.name || userData?.fullName || userData?.email || "Khách";

  const location = carData?.location?.city || carData?.city || carData?.location;

  return { carData, userData, carName, userName, location };
};

export const buildActionList = (status) => {
  if (status === "pending") {
    return [
      { label: "Xác nhận", to: "confirmed", style: "btn-success" },
      { label: "Hủy", to: "cancelled", style: "btn-outline" },
    ];
  }
  if (status === "confirmed") {
    return [
      { label: "Bắt đầu chuyến", to: "ongoing", style: "btn-warning" },
      { label: "Hủy", to: "cancelled", style: "btn-outline" },
    ];
  }
  if (status === "ongoing") {
    return [{ label: "Hoàn thành", to: "completed", style: "btn-primary" }];
  }
  return [];
};
