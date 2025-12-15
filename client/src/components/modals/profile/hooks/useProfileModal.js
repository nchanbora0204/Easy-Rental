import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../../lib/axios";
import { TABS, initialForm } from "../constants";

export const useProfileModal = (open) => {
  const [tab, setTab] = useState(TABS.PROFILE);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const avatarSrc = useMemo(
    () => form.avatar || "https://placehold.co/80x80?text=Avatar",
    [form.avatar]
  );

  const setErrorMsg = useCallback((e) => {
    setMsg(e?.response?.data?.message || e?.message || "Có lỗi xảy ra");
  }, []);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetState = useCallback(() => {
    setTab(TABS.PROFILE);
    setMsg("");
    setLoading(false);
    setChanging(false);
    setForm(initialForm);
    setOldPassword("");
    setNewPassword("");
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      setMsg("");
      const { data } = await api.get("/auth/me");
      const u = data?.data || {};
      setForm({
        ...initialForm,
        name: u.name || "",
        phone: u.phone || "",
        city: u.city || "",
        avatar: u.avatar || "",
        avatarPublicId: u.avatarPublicId || "",
      });
    } catch (e) {
      setErrorMsg(e);
    }
  }, [setErrorMsg]);

  useEffect(() => {
    if (!open) return;
    resetState();
    fetchMe();
  }, [open, resetState, fetchMe]);

  const saveProfile = useCallback(async () => {
    try {
      setLoading(true);
      setMsg("");

      const payload = {
        name: form.name,
        phone: form.phone,
        city: form.city,
        avatar: form.avatar,
        avatarPublicId: form.avatarPublicId,
      };

      const { data } = await api.patch("/users/me", payload);

      setMsg("Đã lưu thay đổi!");
      const u = data?.data || {};
      setForm((prev) => ({ ...prev, ...u }));
    } catch (e) {
      setErrorMsg(e);
    } finally {
      setLoading(false);
    }
  }, [form, setErrorMsg]);

  const uploadAvatar = useCallback(
    async (file) => {
      if (!file) return;

      const fd = new FormData();
      fd.append("file", file);

      try {
        setLoading(true);
        setMsg("");

        const { data } = await api.post("/uploads/avatar", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const r = data?.data || {};
        setField("avatar", r.secure_url || r.url || "");
        setField("avatarPublicId", r.public_id || "");
        setMsg("Tải ảnh xong, bấm Lưu thay đổi để cập nhật hồ sơ.");
      } catch (e) {
        setErrorMsg(e);
      } finally {
        setLoading(false);
      }
    },
    [setField, setErrorMsg]
  );

  const deleteAvatar = useCallback(async () => {
    try {
      setLoading(true);
      setMsg("");

      if (!form.avatarPublicId) {
        setField("avatar", "");
        setMsg("Đã xoá ảnh tạm. Bấm Lưu thay đổi để cập nhật hồ sơ.");
        return;
      }

      await api.delete("/uploads/delete", {
        data: { public_id: form.avatarPublicId },
      });

      setField("avatar", "");
      setField("avatarPublicId", "");
      setMsg("Đã xóa ảnh. Bấm Lưu thay đổi để cập nhật hồ sơ.");
    } catch (e) {
      setErrorMsg(e);
    } finally {
      setLoading(false);
    }
  }, [form.avatarPublicId, setField, setErrorMsg]);

  const changePassword = useCallback(async () => {
    try {
      setChanging(true);
      setMsg("");

      await api.post("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setMsg("Đã đổi mật khẩu.");
      setOldPassword("");
      setNewPassword("");
      setTab(TABS.PROFILE);
    } catch (e) {
      setErrorMsg(e);
    } finally {
      setChanging(false);
    }
  }, [oldPassword, newPassword, setErrorMsg]);

  return {
    tab,
    setTab,
    msg,
    loading,
    changing,

    form,
    setField,
    avatarSrc,

    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,

    saveProfile,
    uploadAvatar,
    deleteAvatar,
    changePassword,
  };
};
