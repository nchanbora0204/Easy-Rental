import { useEffect, useState, useCallback } from "react";
import api from "../lib/axios";

export default function useKycStatus(pollMs = 0) {
  const [state, setState] = useState({
    role: null,
    kycStatus: null,
    ownerStatus: null,
    profile: null,
    loading: true,
    err: null,
  });

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      const u = data?.data || {};
      setState({
        role: u.role || null,
        kycStatus: u.kycStatus || "none",
        ownerStatus: u.ownerStatus || "none",
        profile: u.kycProfile || null,
        loading: false,
        err: null,
      });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, err: e }));
    }
  }, []);

  useEffect(() => {
    fetchMe();
    if (!pollMs) return;
    const id = setInterval(fetchMe, pollMs);
    return () => clearInterval(id);
  }, [fetchMe, pollMs]);

  return { ...state, refresh: fetchMe };
}
