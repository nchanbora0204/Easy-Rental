export const ENDPOINTS = {
  list: "/admin/users", 
  lock: (id) => `/admin/users/${id}/lock`, 
  unlock: (id) => `/admin/users/${id}/unlock`, 
};

export const ROLES = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "owner", label: "Chủ xe" },
  { value: "user", label: "Người thuê" },
  { value: "admin", label: "Admin" },
];
