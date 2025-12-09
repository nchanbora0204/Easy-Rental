import { useEffect, useRef, useState } from "react";
import api from "../../lib/axios";
import OwnerLayout from "./OwnerLayout";
import {
  Search,
  RefreshCcw,
  Download,
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Car as CarIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));

const fmtDateTime = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  return d.toLocaleString("vi-VN");
};

const fmtDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  return d.toLocaleDateString("vi-VN");
};

const Badge = ({ status }) => {
  const map = {
    pending: "badge",
    confirmed: "badge badge-success",
    ongoing: "badge badge-warning",
    completed: "badge badge-info",
    cancelled: "badge badge-ghost",
  };
  const labelMap = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    ongoing: "Đang thuê",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return (
    <span className={map[status] || "badge"}>{labelMap[status] || status}</span>
  );
};

const ENDPOINTS = {
  list: "/bookings/owner",
  export: "/bookings/owner/export",
  status: (id) => `/bookings/${id}/status`,
};

export default function OwnerBookings() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const searchRef = useRef(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [paging, setPaging] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [actionKey, setActionKey] = useState(null);

  const fetchData = async ({ keepPage = false } = {}) => {
    setLoading(true);
    setMsg("");
    try {
      const curPage = keepPage ? page : 1;
      const { data } = await api.get(ENDPOINTS.list, {
        params: { q, status, page: curPage, limit },
      });

      const items = data?.data || [];
      const pg = data?.paging || {};
      setRows(items);
      setPaging({
        page: pg.page || curPage,
        pages: pg.pages || 1,
        total: pg.total || items.length,
      });
      if (!keepPage) setPage(curPage);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Lỗi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load lần đầu
    fetchData({ keepPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // đổi page hoặc status thì load lại
    fetchData({ keepPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData({ keepPage: false });
  };

  const handleReset = () => {
    setQ("");
    setStatus("all");
    setPage(1);
    fetchData({ keepPage: false });
    if (searchRef.current) searchRef.current.focus();
  };

  const doExport = async () => {
    try {
      const res = await api.get(ENDPOINTS.export, {
        params: { q, status },
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Danh sach don thue-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setMsg(
        e?.response?.data?.message || e.message || "Không xuất được file Excel"
      );
    }
  };

  const changeStatus = async (bookingId, newStatus) => {
    const key = `${bookingId}:${newStatus}`;
    const confirmText = {
      confirmed: "Xác nhận đơn này?",
      ongoing: "Đánh dấu đơn đang diễn ra?",
      completed: "Đánh dấu đơn đã hoàn thành?",
      cancelled: "Hủy đơn này?",
    }[newStatus];

    if (confirmText && !window.confirm(confirmText)) return;

    setActionKey(key);
    setMsg("");
    try {
      const { data } = await api.patch(ENDPOINTS.status(bookingId), {
        status: newStatus,
      });
      const updated = data?.data;
      setRows((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                status: updated?.status || newStatus,
                total: updated?.total ?? b.total,
                days: updated?.days ?? b.days,
              }
            : b
        )
      );
    } catch (e) {
      setMsg(
        e?.response?.data?.message ||
          e.message ||
          "Không cập nhật được trạng thái"
      );
    } finally {
      setActionKey(null);
    }
  };

  const renderActions = (row) => {
    const list = [];
    if (row.status === "pending") {
      list.push({ label: "Xác nhận", to: "confirmed", style: "btn-success" });
      list.push({ label: "Hủy", to: "cancelled", style: "btn-outline" });
    } else if (row.status === "confirmed") {
      list.push({
        label: "Bắt đầu chuyến",
        to: "ongoing",
        style: "btn-warning",
      });
      list.push({ label: "Hủy", to: "cancelled", style: "btn-outline" });
    } else if (row.status === "ongoing") {
      list.push({ label: "Hoàn thành", to: "completed", style: "btn-primary" });
    }

    if (!list.length) return <span className="text-xs text-gray-400">—</span>;

    return (
      <div className="flex flex-wrap gap-1">
        {list.map((a) => {
          const key = `${row._id}:${a.to}`;
          const loading = actionKey === key;
          return (
            <button
              key={a.to}
              type="button"
              className={`btn btn-xs ${a.style}`}
              onClick={() => changeStatus(row._id, a.to)}
              disabled={loading}
            >
              {loading && (
                <Loader2 className="w-3 h-3 mr-1 animate-spin inline-block" />
              )}
              {a.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <OwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/**header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Đơn hàng</h1>
            <p className="text-sm text-gray-500 mt-1">
              Xem và xử lý các đơn thuê xe của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleReset}
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Làm mới
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={doExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/**Lọc, tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3"
        >
          <div className="flex-1 min-w-[220px] flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Tìm theo xe, khách hàng, email..."
              className="input flex-1"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="ongoing">Đang thuê</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Tìm
            </button>
          </div>
        </form>

        {/*Thông báo lỗi*/}
        {msg && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        {/*Bảng đơn hàng*/}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Tổng cộng{" "}
              <span className="font-semibold text-gray-800">
                {paging.total}
              </span>{" "}
              đơn
            </div>
            <div className="text-xs text-gray-400">
              Trang {paging.page}/{paging.pages || 1}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Xe</th>
                  <th className="px-4 py-2 text-left">Khách hàng</th>
                  <th className="px-4 py-2 text-left">Thời gian</th>
                  <th className="px-4 py-2 text-right">Tổng tiền</th>
                  <th className="px-4 py-2 text-center">Trạng thái</th>
                  <th className="px-4 py-2 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      Chưa có đơn nào
                    </td>
                  </tr>
                ) : (
                  rows.map((b) => {
                    const carData = Array.isArray(b.car) ? b.car[0] : b.car;
                    const userData = Array.isArray(b.user) ? b.user[0] : b.user;

                    const carName =
                      `${carData?.brand || ""} ${
                        carData?.model || ""
                      }`.trim() || "Xe tự lái";

                    const userName =
                      userData?.name ||
                      userData?.fullName ||
                      userData?.email ||
                      "Khách";

                    const location =
                      carData?.location?.city ||
                      carData?.city ||
                      carData?.location;

                    return (
                      <tr
                        key={b._id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-semibold flex items-center gap-2">
                            <CarIcon className="w-4 h-4 text-blue-500" />
                            {carName}
                          </div>
                          {location && (
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {location}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{userName}</span>
                          </div>
                          {userData?.phone && (
                            <div className="text-xs text-gray-500 mt-1">
                              {userData.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                            <Calendar className="w-3 h-3 mt-0.5" />
                            <div>
                              <div>
                                Nhận: {fmtDate(b.pickupDate)}{" "}
                                {new Date(b.pickupDate)
                                  .toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(",", "")}
                              </div>
                              <div>
                                Trả: {fmtDate(b.returnDate)}{" "}
                                {new Date(b.returnDate)
                                  .toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(",", "")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            {b.days || 0} ngày
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <div className="font-semibold text-gray-900">
                            {fmt(b.total)}đ
                          </div>
                          <div className="text-xs text-gray-500">
                            {b.currency || "VND"}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            Tạo lúc: {fmtDateTime(b.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-center">
                          <Badge status={b.status} />
                        </td>
                        <td className="px-4 py-3 align-top text-center">
                          {renderActions(b)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/*Pagination*/}
          {paging.pages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Trang {paging.page}/{paging.pages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-xs"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Trước
                </button>
                <button
                  className="btn btn-xs"
                  disabled={page >= paging.pages}
                  onClick={() => setPage((p) => Math.min(paging.pages, p + 1))}
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
