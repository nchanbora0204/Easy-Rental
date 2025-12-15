import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

if (typeof window !== "undefined") window.__API_DEBUG__ = true;

api.interceptors.response.use(
  (res) => {
    if (window.__API_DEBUG__) console.log("[API OK]", res.config.url, res.data);
    return res;
  },
  (err) => {
    if (window.__API_DEBUG__) {
      console.error(
        "[API ERR]",
        err.config?.url,
        err.response?.status,
        err.response?.data
      );
    }
    return Promise.reject(err);
  }
);

export default api;
