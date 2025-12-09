import { useEffect, useState } from "react";
import api from "../../lib/axios";
import {
  Calendar,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react";
import AdminLayout from "./AdminLayout";

const ENDPOINTS = {
  list: "/admin/bookings",
  detail: (id) => `/admin/bookings/${id}`,
};

export default function AdminBookings() {
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    try {
        // only include params when they have meaningful values
        const params = { page, limit };
        if (status && status !== "all") params.status = status;
        if (from) params.from = from;
        if (to) params.to = to;
        if (q) params.q = q;

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

  const hasNext = page * limit < total;

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const view = async (id) => {
    try {
      const { data } = await api.get(ENDPOINTS.detail(id));
      const payload = data?.data || {};
      const booking = payload.booking || null;
      const payment = Array.isArray(payload.payments)
        ? payload.payments[0]
        : payload.payment;
      setDetail(booking ? { ...booking, payment } : null);
      setOpen(true);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <AdminLayout>
      <div className="section py-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
        {msg && (
          <div className="card mb-4 bg-red-50 border-red-200">
            <div className="card-body text-red-700 text-sm">{msg}</div>
          </div>
        )}

        <form onSubmit={onSearch} className="card mb-4">
          <div className="card-body grid gap-3 md:grid-cols-5">
            <div className="flex items-center gap-2 md:col-span-2">
              <Search size={18} />
              <input
                className="input w-full"
                placeholder="Tìm theo xe / user / mã đơn…"
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
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="ongoing">Đang thuê</option>
              <option value="completed">Hoàn tất</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <input
              type="date"
              className="input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
              className="input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <button className="btn btn-primary md:col-span-1">
              <Filter size={16} /> Lọc
            </button>
          </div>
        </form>

        <div className="card">
          <div className="card-body overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">Mã đơn</th>
                  <th className="py-3 px-2">Xe</th>
                  <th className="py-3 px-2">Người thuê</th>
                  <th className="py-3 px-2">Chủ xe</th>
                  <th className="py-3 px-2">Đón → Trả</th>
                  <th className="py-3 px-2">Tổng tiền</th>
                  <th className="py-3 px-2">Trạng thái</th>
                  <th className="py-3 px-2 text-right">Xem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-center">
                      <Loader2 className="inline animate-spin" /> Đang tải…
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((b) => (
                    <tr key={b._id} className="border-b last:border-0">
                      <td className="py-3 px-2">{b._id}</td>
                      <td className="py-3 px-2">
                        {b.car?.brand} {b.car?.model}
                      </td>
                      <td className="py-3 px-2">
                        {b.user?.name || b.user?.email}
                      </td>
                      <td className="py-3 px-2">
                        {b.owner?.name || b.owner?.email}
                      </td>
                      <td className="py-3 px-2 text-xs flex items-center gap-2">
                        <Calendar size={14} />{" "}
                        {new Date(b.pickupDate).toLocaleDateString()} →{" "}
                        {new Date(b.returnDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {b.total?.toLocaleString?.() || b.total} đ
                      </td>
                      <td className="py-3 px-2">
                        {b.status === "completed" ? (
                          <span className="text-success inline-flex items-center gap-1">
                            <CheckCircle2 size={14} /> Hoàn tất
                          </span>
                        ) : b.status === "cancelled" ? (
                          <span className="text-danger inline-flex items-center gap-1">
                            <XCircle size={14} /> Hủy
                          </span>
                        ) : (
                          <span className="text-[var(--color-muted)] inline-flex items-center gap-1">
                            <Clock size={14} /> {b.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          className="btn btn-outline inline-flex items-center gap-1"
                          onClick={() => view(b._id)}
                        >
                          <Eye size={16} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
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

        {/* Detail Modal */}
        {open && (
          <div className="fixed inset-0 z-[100]">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-3xl bg-white rounded-[16px] shadow-xl overflow-hidden">
                <div className="px-5 py-3 border-b font-semibold">
                  Chi tiết đơn hàng
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div>
                    <b>Mã đơn:</b> {detail?._id}
                  </div>
                  <div>
                    <b>Xe:</b> {detail?.car?.brand} {detail?.car?.model} •{" "}
                    {detail?.car?.year}
                  </div>
                  <div>
                    <b>Người thuê:</b>{" "}
                    {detail?.user?.name || detail?.user?.email}
                  </div>
                  <div>
                    <b>Chủ xe:</b> {detail?.owner?.name || detail?.owner?.email}
                  </div>
                  <div>
                    <b>Ngày:</b> {new Date(detail?.pickupDate).toLocaleString()}{" "}
                    → {new Date(detail?.returnDate).toLocaleString()}
                  </div>
                  <div>
                    <b>Trạng thái:</b> {detail?.status}
                  </div>
                  <div>
                    <b>Tổng tiền:</b>{" "}
                    {detail?.total?.toLocaleString?.() || detail?.total} đ
                  </div>
                  {detail?.payment && (
                    <div className="mt-2 p-3 rounded border bg-[var(--color-bg)]">
                      <div className="font-medium mb-1">Thanh toán</div>
                      <div>Trạng thái: {detail.payment.status}</div>
                      <div>Mã: {detail.payment._id}</div>
                      <div>Phương thức: {detail.payment.method}</div>
                    </div>
                  )}
                </div>
                <div className="px-5 py-3 border-t text-right">
                  <button
                    className="btn btn-primary"
                    onClick={() => setOpen(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
