export const DEFAULT_LIMIT = 10;

export const ENDPOINTS = {
  list: "/bookings/owner",
  export: "/bookings/owner/export",
  status: (id) => `/bookings/${id}/status`,
};

export const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "ongoing", label: "Đang thuê" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export const STATUS_BADGE_MAP = {
  pending: { className: "badge", label: "Chờ xác nhận" },
  confirmed: { className: "badge badge-success", label: "Đã xác nhận" },
  ongoing: { className: "badge badge-warning", label: "Đang thuê" },
  completed: { className: "badge badge-info", label: "Hoàn thành" },
  cancelled: { className: "badge badge-ghost", label: "Đã hủy" },
};

export const CONFIRM_TEXT = {
  confirmed: "Xác nhận đơn này?",
  ongoing: "Đánh dấu đơn đang diễn ra?",
  completed: "Đánh dấu đơn đã hoàn thành?",
  cancelled: "Hủy đơn này?",
};
