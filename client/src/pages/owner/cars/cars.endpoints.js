export const OWNER_CARS_ENDPOINTS = {
  list: "/cars/owner",
  toggle: (id) => `/cars/${id}/toggle`,
  remove: (id) => `/cars/${id}`,
  restore: (id) => `/cars/${id}/restore`,
};
