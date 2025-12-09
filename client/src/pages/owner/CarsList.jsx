import { useEffect, useState } from "react";
import api from "../../lib/axios";
import OwnerLayout from "./OwnerLayout";
import {
  Car,
  Search,
  RotateCcw,
  BadgeX,
  Power,
  PowerOff,
  Loader2,
  Coins,
  Pencil,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ENDPOINTS = {
  list: "/cars/owner",
  toggle: (id) => `/cars/${id}/toggle`,
  remove: (id) => `/cars/${id}`,
  restore: (id) => `/cars/${id}/restore`,
};

const StatusBadge = ({ removed, isAvailable }) => {
  if (removed)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Đã gỡ
      </span>
    );
  if (isAvailable)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Đang cho thuê
      </span>
    );
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      Tạm ngừng
    </span>
  );
};

export default function OwnerCars() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    try {
      const { data } = await api.get(ENDPOINTS.list, {
        params: { q, status, page, limit },
      });
      const { items = [], total = 0 } = data?.data || {};
      setRows(items);
      setTotal(total);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, status]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const doToggle = async (id) => {
    try {
      await api.patch(ENDPOINTS.toggle(id));
      setRows((s) =>
        s.map((r) => (r._id === id ? { ...r, isAvailable: !r.isAvailable } : r))
      );
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const act = async (id, kind) => {
    try {
      if (kind === "remove") {
        await api.delete(ENDPOINTS.remove(id));
        setRows((s) =>
          s.map((r) =>
            r._id === id ? { ...r, removed: true, isAvailable: false } : r
          )
        );
      } else {
        await api.patch(ENDPOINTS.restore(id));
        setRows((s) =>
          s.map((r) =>
            r._id === id ? { ...r, removed: false, isAvailable: true } : r
          )
        );
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const pageCount = Math.ceil(total / limit) || 1;

  return (
    <OwnerLayout>
      <div className="section py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Quản lý xe của tôi
            </h1>
            <p className="text-gray-500 text-sm">
              Quản lý danh sách xe cho thuê của bạn
            </p>
          </div>
          <Link
            to="/owner/cars/new"
            className="btn btn-primary inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus size={18} /> Thêm xe mới
          </Link>
        </div>

        {/* Error Message */}
        {msg && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {msg}
          </div>
        )}

        {/* Search & Filter */}
        <form onSubmit={onSearch} className="card mb-6 shadow-sm">
          <div className="card-body">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="input w-full pl-10"
                  placeholder="Tìm theo tên xe hoặc biển số..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <select
                className="select min-w-[160px]"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang cho thuê</option>
                <option value="unavailable">Tạm ngừng</option>
                <option value="removed">Đã gỡ</option>
              </select>
              <button className="btn btn-primary whitespace-nowrap">
                Tìm kiếm
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thông tin xe
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Biển số
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Năm
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giá/ngày
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thống kê
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="py-4 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <Loader2
                        className="inline animate-spin text-blue-600 mb-2"
                        size={32}
                      />
                      <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Car size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {c.brand} {c.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {c.licensePlate || "-"}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {c.year || "-"}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {(c.pricePerDay || 0).toLocaleString()} đ
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Coins size={16} className="text-amber-500" />
                          <span className="text-gray-700">
                            {c.stats?.orders || 0} đơn /{" "}
                            {(c.stats?.revenue || 0).toLocaleString()} đ
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge
                          removed={c.removed}
                          isAvailable={c.isAvailable}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {!c.removed && (
                            <>
                              <Link
                                to={`/owner/cars/${c._id}/edit`}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Pencil size={16} className="text-gray-600" />
                              </Link>
                              <button
                                onClick={() => doToggle(c._id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={c.isAvailable ? "Tạm ngừng" : "Mở lại"}
                              >
                                {c.isAvailable ? (
                                  <PowerOff
                                    size={16}
                                    className="text-gray-600"
                                  />
                                ) : (
                                  <Power size={16} className="text-green-600" />
                                )}
                              </button>
                            </>
                          )}
                          {c.removed ? (
                            <button
                              onClick={() => act(c._id, "restore")}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              title="Khôi phục"
                            >
                              <RotateCcw size={16} className="text-green-600" />
                            </button>
                          ) : (
                            <button
                              onClick={() => act(c._id, "remove")}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Gỡ xe"
                            >
                              <BadgeX size={16} className="text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <Car size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">
                        Chưa có xe nào
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Thêm xe đầu tiên để bắt đầu cho thuê
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-medium">{(page - 1) * limit + 1}</span> -{" "}
                <span className="font-medium">
                  {Math.min(page * limit, total)}
                </span>{" "}
                trong tổng số <span className="font-medium">{total}</span> xe
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="btn btn-ghost inline-flex items-center gap-1 disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Trước
                </button>
                <span className="text-sm text-gray-600 px-3">
                  Trang {page} / {pageCount}
                </span>
                <button
                  disabled={page >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn btn-ghost inline-flex items-center gap-1 disabled:opacity-40"
                >
                  Sau <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
