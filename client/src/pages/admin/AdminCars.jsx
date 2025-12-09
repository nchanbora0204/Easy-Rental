import { useEffect, useState } from "react";
import api from "../../lib/axios";
import {
  Car,
  Search,
  UserRound,
  BadgeX,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import AdminLayout from "./AdminLayout";

const ENDPOINTS = {
  list: "/admin/cars", 
  remove: (id) => `/admin/cars/${id}/remove`, 
  restore: (id) => `/admin/cars/${id}/restore`,
};

export default function AdminCars() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); 
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
      if (status === "active") params.active = "true";
      else if (status === "removed") params.active = "false";

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
  }, [page, status]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const act = async (id, kind) => {
    const url =
      kind === "remove" ? ENDPOINTS.remove(id) : ENDPOINTS.restore(id);
    try {
      await api.post(url).catch(async (err) => {
        if (err?.response?.status === 404) await api.patch(url);
        else throw err;
      });

      setRows((s) =>
        s.map((r) =>
          r._id === id
            ? {
                ...r,
                status: kind === "remove" ? "removed" : "active",
                deletedAt:
                  kind === "remove" ? new Date().toISOString() : undefined,
              }
            : r
        )
      );
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const canNext = page * limit < total;

  return (
    <AdminLayout>
      <div className="section py-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý xe</h1>

        {msg && (
          <div className="card mb-4 bg-red-50 border-red-200">
            <div className="card-body text-red-700 text-sm">{msg}</div>
          </div>
        )}

        <form onSubmit={onSearch} className="card mb-4">
          <div className="card-body grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Search size={18} />
              <input
                className="input w-full"
                placeholder="Tìm theo tên xe / biển số…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="removed">Đã gỡ</option>
            </select>
            <button className="btn btn-primary">Tìm</button>
          </div>
        </form>

        <div className="card">
          <div className="card-body overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">Xe</th>
                  <th className="py-3 px-2">Chủ xe</th>
                  <th className="py-3 px-2">Năm</th>
                  <th className="py-3 px-2">Giá/ngày</th>
                  <th className="py-3 px-2">Trạng thái</th>
                  <th className="py-3 px-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center">
                      <Loader2 className="inline animate-spin" /> Đang tải…
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((c) => {
                    const isRemoved =
                      c.status === "removed" ||
                      !!c.deletedAt ||
                      c.removed === true;

                    return (
                      <tr key={c._id} className="border-b last:border-0">
                        <td className="py-3 px-2 flex items-center gap-2">
                          <Car size={16} /> {c.brand} {c.model}
                        </td>
                        <td className="py-3 px-2 flex items-center gap-2">
                          <UserRound size={16} />{" "}
                          {c.owner?.name || c.owner?.email}
                        </td>
                        <td className="py-3 px-2">{c.year}</td>
                        <td className="py-3 px-2">
                          {c.pricePerDay?.toLocaleString?.() || c.pricePerDay} đ
                        </td>
                        <td className="py-3 px-2">
                          {isRemoved ? (
                            <span className="text-danger">Đã gỡ</span>
                          ) : (
                            <span className="text-success">Đang hoạt động</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {isRemoved ? (
                            <button
                              onClick={() => act(c._id, "restore")}
                              className="btn btn-outline inline-flex items-center gap-1"
                            >
                              <RotateCcw size={16} /> Khôi phục
                            </button>
                          ) : (
                            <button
                              onClick={() => act(c._id, "remove")}
                              className="btn btn-ghost text-danger inline-flex items-center gap-1"
                            >
                              <BadgeX size={16} /> Gỡ xe
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-center text-[var(--color-muted)]"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn btn-ghost"
            >
              ← Trước
            </button>
            <div className="text-sm text-[var(--color-muted)]">
              Trang {page}
            </div>
            <button
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
              className="btn btn-ghost"
            >
              Sau →
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-[var(--color-muted)] flex items-center gap-1">
          <CheckCircle2 size={14} /> Hành động áp dụng ngay, có thể hoàn tác
          bằng “Khôi phục”.
        </div>
      </div>
    </AdminLayout>
  );
}
