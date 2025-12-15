import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import { getPendingKyc, approveKyc, rejectKyc } from "./api";
import { normalizeList } from "./utils";
import { PAGE_SIZE } from "./constants";

import { KycHeader } from "./components/KycHeader";
import { ErrorAlert } from "./components/ErrorAlert";
import { EmptyState } from "./components/EmptyState";
import { Pagination } from "./components/Pagination";
import { KycCard } from "./components/KycCard";
import { ImagePreviewModal } from "./components/ImagePreviewModal";

const AdminKyc = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectReasonMap, setRejectReasonMap] = useState({});
  const [err, setErr] = useState(null);

  const [page, setPage] = useState(1);

  const fetchKyc = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);

      const res = await getPendingKyc();
      const list = normalizeList(res);

      setRows(list);
      setPage(1);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Lấy danh sách thất bại");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKyc();
  }, [fetchKyc]);

  const onApprove = useCallback(
    async (userId) => {
      try {
        setBusyId(userId);
        setErr(null);
        await approveKyc(userId);
        await fetchKyc();
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Duyệt thất bại");
      } finally {
        setBusyId(null);
      }
    },
    [fetchKyc]
  );

  const onReject = useCallback(
    async (userId) => {
      const reason = (rejectReasonMap[userId] || "").trim();
      if (!reason) {
        setErr("Vui lòng nhập lý do từ chối trước khi gửi.");
        return;
      }

      try {
        setBusyId(userId);
        setErr(null);
        await rejectKyc(userId, reason);

        setRejectReasonMap((m) => {
          const nxt = { ...m };
          delete nxt[userId];
          return nxt;
        });

        await fetchKyc();
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Từ chối thất bại");
      } finally {
        setBusyId(null);
      }
    },
    [rejectReasonMap, fetchKyc]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
    [rows.length]
  );
  const currentRows = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return rows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [rows, page]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <KycHeader />

          <ErrorAlert err={err} onClose={() => setErr(null)} />

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          ) : rows.length === 0 ? (
            <EmptyState onRefresh={fetchKyc} />
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
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />

              {/* Cards */}
              {currentRows.map((u) => (
                <KycCard
                  key={u._id}
                  u={u}
                  busy={busyId === u._id}
                  rejectReason={rejectReasonMap[u._id] || ""}
                  onChangeRejectReason={(val) =>
                    setRejectReasonMap((m) => ({ ...m, [u._id]: val }))
                  }
                  onApprove={() => onApprove(u._id)}
                  onReject={() => onReject(u._id)}
                  onRefresh={fetchKyc}
                  onOpenImage={(url) => setSelectedImage(url)}
                />
              ))}
            </div>
          )}

          <ImagePreviewModal
            selectedImage={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminKyc;
