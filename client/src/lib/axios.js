import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, "")}/auth/refresh`;
    refreshPromise = axios
      .post(refreshUrl, {}, { withCredentials: true })
      .then((res) => {
        const newToken = res.data?.data?.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          return newToken;
        }
        localStorage.removeItem("token");
        throw new Error("Missing refreshed token");
      })
      .catch((err) => {
        localStorage.removeItem("token");
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

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
  async (err) => {
    if (window.__API_DEBUG__) {
      console.error(
        "[API ERR]",
        err.config?.url,
        err.response?.status,
        err.response?.data
      );
    }
    const status = err.response?.status;
    const originalConfig = err.config || {};

    const isAuthRefresh = originalConfig.url?.includes("/auth/refresh");

    if (status === 401 && !originalConfig._retry && !isAuthRefresh) {
      originalConfig._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalConfig);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
