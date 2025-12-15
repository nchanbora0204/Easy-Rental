import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";

import { fetchBookings, fetchBookingDetail } from "./api";
import { normalizeDetail } from "./utils";

import { BookingsHeader } from "./components/BookingsHeader";
import { ErrorMessage } from "./components/ErrorMessage";
import { BookingsFilters } from "./components/BookingsFilters";
import { BookingsTable } from "./components/BookingsTable";
import { BookingsPagination } from "./components/BookingsPagination";
import { BookingDetailModal } from "./components/BookingDetailModal";

const AdminBookings = () => {
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

  const load = useCallback(
    async ({ keepPage = true } = {}) => {
      setLoading(true);
      setMsg("");
      try {
        const nextPage = keepPage ? page : 1;

        const { items, total: t } = await fetchBookings({
          status,
          from,
          to,
          q,
          page: nextPage,
          limit,
        });

        setRows(items);
        setTotal(t);
        if (!keepPage) setPage(1);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    },
    [status, from, to, q, page, limit]
  );

  useEffect(() => {
    load({ keepPage: true });
  }, [load, page, status]);

  const onSearch = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      load({ keepPage: false });
    },
    [load]
  );

  const onView = useCallback(async (id) => {
    try {
      setMsg("");
      const payload = await fetchBookingDetail(id);
      setDetail(normalizeDetail(payload));
      setOpen(true);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }, []);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    // giữ lại detail cũng được, nhưng clear để sạch state
    setDetail(null);
  }, []);

  return (
    <AdminLayout>
      <div className="section py-6">
        <BookingsHeader />
        <ErrorMessage msg={msg} />

        <BookingsFilters
          q={q}
          status={status}
          from={from}
          to={to}
          onChangeQ={setQ}
          onChangeStatus={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onChangeFrom={setFrom}
          onChangeTo={setTo}
          onSubmit={onSearch}
        />

        <div className="card">
          <BookingsTable rows={rows} loading={loading} onView={onView} />
          <BookingsPagination
            page={page}
            total={total}
            limit={limit}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>

        <BookingDetailModal
          open={open}
          detail={detail}
          onClose={onCloseModal}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
