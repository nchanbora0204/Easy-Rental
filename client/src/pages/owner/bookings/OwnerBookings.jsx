import { useCallback, useEffect, useRef, useState } from "react";
import OwnerLayout from "../layout/OwnerLayout"; 
import { Loader2 } from "lucide-react";

import { DEFAULT_LIMIT, CONFIRM_TEXT } from "./ownerBookings.constants";
import { fetchOwnerBookings, exportOwnerBookings, updateBookingStatus } from "./ownerBookings.service";

import { BookingsHeader } from "./components/BookingsHeader";
import { BookingsFilters } from "./components/BookingFilters";
import { BookingsTable } from "./components/BookingsTable";
import { PaginationArrows } from "./components/PaginationArrows";

export const OwnerBookings = () => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const searchRef = useRef(null);

  const [page, setPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const [paging, setPaging] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [actionKey, setActionKey] = useState(null);

  const load = useCallback(
    async ({ keepPage } = { keepPage: true }) => {
      setLoading(true);
      setMsg("");
      try {
        const curPage = keepPage ? page : 1;
        const res = await fetchOwnerBookings({ q, status, page: curPage, limit });
        setRows(res.items);
        setPaging(res.paging);
        if (!keepPage) setPage(1);
      } catch (e) {
        setMsg(e?.response?.data?.message || e?.message || "Lỗi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    },
    [q, status, page, limit]
  );

  useEffect(() => {
    load({ keepPage: true });
  }, []); // eslint-disable-line

  useEffect(() => {
    load({ keepPage: true });
  }, [page, status]); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load({ keepPage: false });
  };

  const handleReset = () => {
    setQ("");
    setStatus("all");
    setPage(1);
    load({ keepPage: false });
    if (searchRef.current) searchRef.current.focus();
  };

  const handleExport = async () => {
    setMsg("");
    try {
      const blobData = await exportOwnerBookings({ q, status });
      const blob = new Blob([blobData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Danh sach don thue-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setMsg(e?.response?.data?.message || e?.message || "Không xuất được file Excel");
    }
  };

  const handleChangeStatus = async (bookingId, newStatus) => {
    const confirmText = CONFIRM_TEXT[newStatus];
    if (confirmText && !window.confirm(confirmText)) return;

    const key = `${bookingId}:${newStatus}`;
    setActionKey(key);
    setMsg("");
    try {
      const updated = await updateBookingStatus({ bookingId, status: newStatus });
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
      setMsg(e?.response?.data?.message || e?.message || "Không cập nhật được trạng thái");
    } finally {
      setActionKey(null);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <BookingsHeader onReset={handleReset} onExport={handleExport} />

        <BookingsFilters
          q={q}
          status={status}
          searchRef={searchRef}
          onChangeQ={setQ}
          onChangeStatus={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onSubmit={handleSearch}
        />

        <BookingsTable
          rows={rows}
          loading={loading}
          msg={msg}
          paging={paging}
          actionKey={actionKey}
          onChangeStatus={handleChangeStatus}
        />

        <PaginationArrows
          page={paging.page}
          pages={paging.pages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(paging.pages, p + 1))}
        />
      </div>
    </OwnerLayout>
  );
};

export default OwnerBookings;
