export const ENDPOINTS = {
  list: "/admin/bookings",
  detail: (id) => `/admin/bookings/${id}`,
};

export const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "ongoing", label: "Đang thuê" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã hủy" },
];
