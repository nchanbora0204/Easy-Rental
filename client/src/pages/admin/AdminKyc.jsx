import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { ImageIcon, Check, X, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

function pickFirst(...vals) {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    return v;
  }
  return null;
}

export default function AdminKyc() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectReasonMap, setRejectReasonMap] = useState({});
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetch = async () => {
    try {
      setLoading(true);
      setErr(null);

      const res = await api.get("/admin/kyc/pending", {
        params: { status: "pending" },
      });

      const data = res?.data?.data ?? res?.data ?? [];
      let list = data;
      if (!Array.isArray(list) && typeof list === "object") {
        if (Array.isArray(list.items)) list = list.items;
        else if (Array.isArray(list.rows)) list = list.rows;
        else if (Array.isArray(list.docs)) list = list.docs;
        else list = [];
      }
      setRows(list || []);
      setPage(1);
    } catch (e) {
      setErr(
        e.response?.data?.message || e.message || "Lấy danh sách thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (userId) => {
    try {
      setBusyId(userId);
      setErr(null);
      await api.post(`/admin/kyc/${userId}/approve`);
      await fetch();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Duyệt thất bại");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (userId) => {
    const reason = (rejectReasonMap[userId] || "").trim();
    if (!reason) {
      setErr("Vui lòng nhập lý do từ chối trước khi gửi.");
      return;
    }
    try {
      setBusyId(userId);
      setErr(null);
      await api.post(`/admin/kyc/${userId}/reject`, { reason });
      setRejectReasonMap((m) => {
        const nxt = { ...m };
        delete nxt[userId];
        return nxt;
      });
      await fetch();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Từ chối thất bại");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      </div>
    );
  }
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const currentRows = rows.slice(startIndex, startIndex + pageSize);
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý hồ sơ KYC/KYA
            </h1>
            <p className="text-gray-600 mt-1">
              Duyệt và xác thực thông tin tài xế
            </p>
          </div>

          {/* Error Alert */}
          {err && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
                <p className="text-red-700 text-sm mt-1">{err}</p>
              </div>
              <button
                onClick={() => setErr(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {rows.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có hồ sơ chờ duyệt
              </h3>
              <p className="text-gray-500">
                Tất cả hồ sơ đã được xử lý hoặc chưa có hồ sơ mới.
              </p>
              <button
                onClick={() => fetch()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Làm mới
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-blue-900 font-medium">
                  Có <span className="font-bold">{rows.length}</span> hồ sơ đang
                  chờ duyệt
                </p>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Trang trước
                </button>
                <span>
                  Trang <strong>{page}</strong> / {totalPages}
                </span>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Trang sau →
                </button>
              </div>

              {/* KYC Cards - Option 1: Two Column Layout */}
              {currentRows.map((u) => {
                const profile = u.kycProfile || u.profile || u;

                const docUrls = [
                  {
                    key: "idFrontUrl",
                    label: "CCCD - Mặt trước",
                    url: profile?.idFrontUrl || null,
                  },
                  {
                    key: "idBackUrl",
                    label: "CCCD - Mặt sau",
                    url: profile?.idBackUrl || null,
                  },
                  {
                    key: "selfieWithIdUrl",
                    label: "Ảnh selfie",
                    url: profile?.selfieWithIdUrl || null,
                  },
                  {
                    key: "vehicleRegistrationUrl",
                    label: "Cà-vẹt xe",
                    url: profile?.vehicleRegistrationUrl || null,
                  },
                  {
                    key: "vehicleInsuranceUrl",
                    label: "Bảo hiểm xe",
                    url: profile?.vehicleInsuranceUrl || null,
                  },
                ];

                const phone = pickFirst(
                  profile?.phone,
                  u?.phone,
                  profile?.mobile,
                  u?.mobile,
                  u?.contactPhone
                );
                const address = pickFirst(
                  profile?.address,
                  u?.address,
                  u?.location?.address,
                  profile?.location?.address
                );
                const city = pickFirst(
                  profile?.city,
                  profile?.cityName,
                  u?.city,
                  u?.location?.city,
                  profile?.location?.city
                );

                return (
                  <div
                    key={u._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {pickFirst(profile?.fullName, u?.name, u?.email) ||
                              "Chưa có tên"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {u?.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 font-mono bg-white/50 inline-block px-2 py-0.5 rounded">
                            ID: {u._id}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                            ⏳ Chờ duyệt
                          </span>
                          {u?.createdAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                      {/* LEFT COLUMN - User Information */}
                      <div className="space-y-6">
                        {/* Personal Info Section */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-600 rounded"></div>
                            Thông tin cá nhân
                          </h4>
                          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                                Họ và tên:
                              </span>
                              <span className="text-sm text-gray-900 font-semibold">
                                {profile?.fullName || "—"}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                                Số điện thoại:
                              </span>
                              <span className="text-sm text-gray-900 font-semibold">
                                {phone || "—"}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                                Email:
                              </span>
                              <span className="text-sm text-gray-900 break-all">
                                {u?.email || "—"}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                                Địa chỉ:
                              </span>
                              <span className="text-sm text-gray-900">
                                {address || "—"}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 flex-shrink-0 font-medium">
                                Thành phố:
                              </span>
                              <span className="text-sm text-gray-900 font-semibold">
                                {city || "—"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Note Section */}
                        {profile?.note && (
                          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <p className="text-xs font-semibold text-amber-900 uppercase mb-1">
                              Ghi chú từ tài xế
                            </p>
                            <p className="text-sm text-amber-900">
                              {profile.note}
                            </p>
                          </div>
                        )}

                        {/* Reject Reason Input */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <div className="w-1 h-4 bg-red-600 rounded"></div>
                            Lý do từ chối
                          </h4>
                          <textarea
                            placeholder="Nhập lý do từ chối nếu bạn quyết định không duyệt hồ sơ này..."
                            value={rejectReasonMap[u._id] || ""}
                            onChange={(e) =>
                              setRejectReasonMap((m) => ({
                                ...m,
                                [u._id]: e.target.value,
                              }))
                            }
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                            rows={4}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            * Bắt buộc nhập khi từ chối hồ sơ
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => approve(u._id)}
                            disabled={busyId === u._id}
                          >
                            {busyId === u._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Check className="w-5 h-5" />
                            )}
                            Phê duyệt hồ sơ
                          </button>

                          <button
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => reject(u._id)}
                            disabled={busyId === u._id}
                          >
                            {busyId === u._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                            Từ chối hồ sơ
                          </button>

                          <button
                            className="w-full px-5 py-2.5 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => fetch()}
                            disabled={busyId === u._id}
                          >
                            🔄 Làm mới
                          </button>
                        </div>
                      </div>

                      {/* RIGHT COLUMN - Documents Gallery */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                          <div className="w-1 h-4 bg-purple-600 rounded"></div>
                          Tài liệu đính kèm
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {docUrls.map((d) => (
                            <div key={d.key} className="group">
                              <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                {d.label}
                              </div>
                              {d.url ? (
                                <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                                  <img
                                    src={d.url}
                                    alt={d.label}
                                    className="w-full h-40 object-cover cursor-pointer"
                                    onClick={() => setSelectedImage(d.url)}
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-40 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                  <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                                  <span className="text-xs text-gray-500 font-medium">
                                    Chưa tải lên
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Image Preview Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-6xl w-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={selectedImage}
                  alt="preview"
                  className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
