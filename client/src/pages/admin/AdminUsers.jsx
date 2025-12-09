import { useEffect, useState } from "react";
import api from "../../lib/axios";
import {
  Search,
  ShieldBan,
  ShieldCheck,
  UserRound,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";
import AdminLayout from "./AdminLayout";

// API endpoints
const ENDPOINTS = {
  list: "/admin/users", // GET ?q=&role=&page=&limit=
  lock: (id) => `/admin/users/${id}/lock`, // PATCH
  unlock: (id) => `/admin/users/${id}/unlock`, // PATCH
};

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    try {
      const params = { q, page, limit };
      if (role !== "all") params.role = role;

      const { data } = await api.get(ENDPOINTS.list, { params });

      const payload = data?.data || {};
      setRows(payload.items || []);
      setTotal(payload.total || 0);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const act = async (id, kind) => {
    const url = kind === "lock" ? ENDPOINTS.lock(id) : ENDPOINTS.unlock(id);
    try {
      await api.patch(url, { isLocked: kind === "lock" });

      // cập nhật state theo kết quả mong muốn
      setRows((s) =>
        s.map((r) =>
          r._id === id
            ? { ...r, locked: kind === "lock", isLocked: kind === "lock" }
            : r
        )
      );
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const hasNext = page * limit < total;

  return (
    <AdminLayout>
      <div className="section py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        </div>

        {msg && (
          <div className="card mb-4 bg-red-50 border-red-200">
            <div className="card-body text-red-700 text-sm">{msg}</div>
          </div>
        )}

        {/* Bộ lọc / tìm kiếm */}
        <form onSubmit={onSearch} className="card mb-4">
          <div className="card-body grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Search size={18} />
              <input
                className="input w-full"
                placeholder="Tìm tên / email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="owner">Chủ xe</option>
              <option value="user">Người thuê</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary">Tìm</button>
          </div>
        </form>

        {/* Bảng users */}
        <div className="card">
          <div className="card-body overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">Người dùng</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Vai trò</th>
                  <th className="py-3 px-2">KYC</th>
                  <th className="py-3 px-2">Ngày tạo</th>
                  <th className="py-3 px-2">Trạng thái</th>
                  <th className="py-3 px-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center">
                      <Loader2 className="inline animate-spin" /> Đang tải…
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((u) => (
                    <tr key={u._id} className="border-b last:border-0">
                      <td className="py-3 px-2 flex items-center gap-2">
                        <UserRound size={16} />{" "}
                        {u.name || u.fullName || "(Chưa đặt tên)"}
                      </td>
                      <td className="py-3 px-2 flex items-center gap-2">
                        <Mail size={16} /> {u.email}
                      </td>
                      <td className="py-3 px-2">{u.role}</td>
                      <td className="py-3 px-2">{u.kycStatus || "-"}</td>
                      <td className="py-3 px-2 flex items-center gap-2">
                        <Calendar size={16} />{" "}
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-3 px-2">
                        {u.locked ?? u.isLocked ? (
                          <span className="text-danger">Locked</span>
                        ) : (
                          <span className="text-success">Active</span>
                        )}
                      </td>

                      <td className="py-3 px-2 text-right">
                        {u.isLocked ? (
                          <button
                            type="button"
                            onClick={() => act(u._id, "unlock")}
                            className="btn btn-outline inline-flex items-center gap-1"
                          >
                            <ShieldCheck size={16} /> Mở khóa
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => act(u._id, "lock")}
                            className="btn btn-ghost text-danger inline-flex items-center gap-1"
                          >
                            <ShieldBan size={16} /> Khóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-6 text-center text-[var(--color-muted)]"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn btn-ghost"
            >
              ← Trước
            </button>
            <div className="text-sm text-[var(--color-muted)]">
              Trang {page} / {total ? Math.ceil(total / limit) : 1}
            </div>
            <button
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="btn btn-ghost"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
