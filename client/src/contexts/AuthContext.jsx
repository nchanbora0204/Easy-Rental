import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthHeader = (token) => {
    if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.Authorization;
  };

  const refreshMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      const u = data?.data || null;
      setUser(u);
      if (u) localStorage.setItem("me", JSON.stringify(u));
    } catch {
      setUser(null);
      localStorage.removeItem("me");
    }
  };

  useEffect(() => {
    // Khởi tạo phiên đăng nhập từ localStorage + gọi /auth/me để đồng bộ
    (async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      setAuthHeader(token);
      const cached = localStorage.getItem("me");
      if (cached) setUser(JSON.parse(cached));
      if (token) await refreshMe();
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    const token = data?.token || data?.accessToken || data?.data?.token;
    const me = data?.user || data?.data?.user;

    if (!token || !me)
      throw new Error(data?.message || "Phản hồi đăng nhập không hợp lệ");

    localStorage.setItem("token", token);
    localStorage.setItem("me", JSON.stringify(me));
    setAuthHeader(token);
    setUser(me);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    const token = data?.token;
    const me = data?.user;
    if (!token || !me) throw new Error("Đăng ký thất bại");

    localStorage.setItem("token", token);
    localStorage.setItem("me", JSON.stringify(me));
    setAuthHeader(token);
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    setAuthHeader(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider
      value={{ user, setUser, loading, login, register, logout, refreshMe }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
