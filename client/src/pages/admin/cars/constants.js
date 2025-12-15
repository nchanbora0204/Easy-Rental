export const ENDPOINTS = {
  list: "/admin/cars",
  remove: (id) => `/admin/cars/${id}/remove`,
  restore: (id) => `/admin/cars/${id}/restore`,
};

export const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "removed", label: "Đã gỡ" },
];
