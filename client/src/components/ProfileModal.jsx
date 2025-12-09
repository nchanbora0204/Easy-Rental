import { useEffect, useState } from "react";
import api from "../lib/axios";
import { X, Upload, Trash2, KeyRound } from "lucide-react";

export default function ProfileModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("profile");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    avatar: "",
    avatarPublicId: "",
  });

  useEffect(() => {
    if (!open) return;
    setTab("profile");
    setMsg("");
    (async () => {
      try {
        const { data } = await api.get("/auth/me"); 
        const u = data?.data || {};
        setForm((s) => ({
          ...s,
          name: u.name || "",
          phone: u.phone || "",
          city: u.city || "",
          avatar: u.avatar || "",
          avatarPublicId: u.avatarPublicId || "",
        }));
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
      }
    })();
  }, [open]);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    try {
      setLoading(true);
      setMsg("");
      const { data } = await api.patch("/users/me", {
        name: form.name,
        phone: form.phone,
        city: form.city,
        avatar: form.avatar,
        avatarPublicId: form.avatarPublicId,
      });
      setMsg("Đã lưu thay đổi!");
      const u = data?.data || {};
      setForm((s) => ({ ...s, ...u }));
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file) => {
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
      onChange("avatar", r.secure_url || r.url);
      onChange("avatarPublicId", r.public_id || "");
      setMsg("Tải ảnh xong, bấm Lưu thay đổi để cập nhật hồ sơ.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    if (!form.avatarPublicId) {
      onChange("avatar", "");
      return;
    }
    try {
      setLoading(true);
      setMsg("");
      await api.delete("/uploads/delete", {
        data: { public_id: form.avatarPublicId },
      });
      onChange("avatar", "");
      onChange("avatarPublicId", "");
      setMsg("Đã xóa ảnh. Bấm Lưu thay đổi để cập nhật hồ sơ.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [changing, setChanging] = useState(false);
  const changePassword = async () => {
    try {
      setChanging(true);
      setMsg("");
      await api.post("/users/change-password", { oldPassword, newPassword });
      setMsg("Đã đổi mật khẩu.");
      setOld("");
      setNew("");
      setTab("profile");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setChanging(false);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-[16px] shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <div className="flex items-center gap-3">
              <button
                className={`px-2 py-1 rounded ${
                  tab === "profile" ? "bg-accent/10 text-accent" : ""
                }`}
                onClick={() => setTab("profile")}
              >
                Hồ sơ
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  tab === "password" ? "bg-accent/10 text-accent" : ""
                }`}
                onClick={() => setTab("password")}
              >
                <KeyRound size={16} className="inline mr-1" />
                Mật khẩu
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {msg && (
              <div className="text-sm text-[var(--color-muted)]">{msg}</div>
            )}

            {tab === "password" ? (
              <>
                <div>
                  <div className="label">Mật khẩu hiện tại</div>
                  <input
                    type="password"
                    className="input w-full"
                    value={oldPassword}
                    onChange={(e) => setOld(e.target.value)}
                  />
                </div>
                <div>
                  <div className="label">Mật khẩu mới</div>
                  <input
                    type="password"
                    className="input w-full"
                    value={newPassword}
                    onChange={(e) => setNew(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary w-full"
                  disabled={changing}
                  onClick={changePassword}
                >
                  {changing ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <img
                    src={
                      form.avatar || "https://placehold.co/80x80?text=Avatar"
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="flex items-center gap-2">
                    <label className="btn btn-outline inline-flex items-center gap-2 cursor-pointer">
                      <Upload size={16} /> Tải ảnh
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => uploadAvatar(e.target.files?.[0])}
                      />
                    </label>
                    {form.avatar && (
                      <button
                        className="btn btn-ghost text-danger inline-flex items-center gap-2"
                        onClick={deleteAvatar}
                      >
                        <Trash2 size={16} /> Xoá
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="label">Họ tên</div>
                  <input
                    className="input w-full"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <div className="label">Số điện thoại</div>
                  <input
                    className="input w-full"
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <div className="label">Thành phố</div>
                  <input
                    className="input w-full"
                    value={form.city}
                    onChange={(e) => onChange("city", e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-full"
                  disabled={loading}
                  onClick={save}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
