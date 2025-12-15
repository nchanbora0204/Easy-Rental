import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

//utils
const TOKEN_KEY = "token";
const ME_KEY = "me";

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const setAuthHeader = (token) => {
  if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.Authorization;
};

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const getStoredMe = () => safeJsonParse(localStorage.getItem(ME_KEY));

const storeAuth = ({ token, me }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ME_KEY, JSON.stringify(me));
};

const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ME_KEY);
};

//provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      const u = data?.data || null;

      setUser(u);
      if (u) localStorage.setItem(ME_KEY, JSON.stringify(u));
      else localStorage.removeItem(ME_KEY);

      return u;
    } catch {
      setUser(null);
      localStorage.removeItem(ME_KEY);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const token = getStoredToken();
      const cachedMe = getStoredMe();

      setAuthHeader(token);
      if (cachedMe) setUser(cachedMe);

      if (token) await refreshMe();

      setLoading(false);
    };

    init();
  }, [refreshMe]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    const token = data?.token || data?.accessToken || data?.data?.token;
    const me = data?.user || data?.data?.user;

    if (!token || !me) {
      throw new Error(data?.message || "Phản hồi đăng nhập không hợp lệ");
    }

    storeAuth({ token, me });
    setAuthHeader(token);
    setUser(me);

    return me;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data?.success === false) throw new Error(data?.message || "Đăng ký thất bại");
    return data;
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setAuthHeader(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, logout, refreshMe }),
    [user, loading, login, register, logout, refreshMe]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export default AuthProvider;
