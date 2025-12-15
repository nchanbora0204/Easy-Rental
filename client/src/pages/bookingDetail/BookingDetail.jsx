import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";
import { fmtVND, formatLocation } from "../../utils/format";

import { BookingDetailHeader } from "./components/BookingDetailHeader";
import { BookingStatusCard } from "./components/BookingStatusCard";
import { BookingMainCard } from "./components/BookingMainCard";
import { BookingActionsCard } from "./components/BookingActionsCard";
import { BookingPendingWarning } from "./components/BookingPendingWarning";
import { BookingDetailSkeleton } from "./components/BookingDetailSkeleton";
import { BookingDetailError } from "./components/BookingDetailError";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const nav = useNavigate();

  const [bk, setBk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const paid = useMemo(() => {
    const st = bk?.status;
    return !!st && ["confirmed", "ongoing", "completed"].includes(st);
  }, [bk?.status]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/bookings/${bookingId}`);
        if (!alive) return;
        setBk(data?.data || null);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || e.message || "Không tải được đơn");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [bookingId]);

  const refresh = async () => {
    const { data } = await api.get(`/bookings/${bookingId}`);
    setBk(data?.data || null);
  };

  const cancel = async () => {
    const ok = window.confirm("Hủy đơn này?");
    if (!ok) return;

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      await refresh();
    } catch (e) {
      window.alert(e?.response?.data?.message || "Hủy thất bại");
    }
  };

  if (loading) return <BookingDetailSkeleton />;
  if (err && !bk)
    return <BookingDetailError err={err} onBack={() => nav("/bookings")} />;
  if (!bk) return null;

  const carName =
    `${bk.car?.brand || ""} ${bk.car?.model || ""}`.trim() ||
    bk.car?.name ||
    "Xe tự lái";

  const loc = formatLocation(bk.car);
  const totalText = `${fmtVND(bk.total)} ₫`;

  const pickupText = bk.pickupDate
    ? new Date(bk.pickupDate).toLocaleString("vi-VN")
    : "";
  const returnText = bk.returnDate
    ? new Date(bk.returnDate).toLocaleString("vi-VN")
    : "";

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <BookingDetailHeader
        bookingId={bookingId}
        onBack={() => nav("/bookings")}
      />

      <div className="section py-8 space-y-6">
        {err ? (
          <div className="card bg-red-50 border-red-200">
            <div className="card-body text-danger text-sm">{err}</div>
          </div>
        ) : null}

        <BookingStatusCard status={bk.status} />

        <BookingMainCard
          carName={carName}
          loc={loc}
          pickupText={pickupText}
          returnText={returnText}
          totalText={totalText}
        />

        <BookingActionsCard
          paid={paid}
          status={bk.status}
          onPay={() => nav(`/pay/${bk._id}`)}
          onCancel={cancel}
          onBack={() => nav("/bookings")}
        />

        {bk.status === "pending" ? <BookingPendingWarning /> : null}
      </div>
    </div>
  );
};

export default BookingDetail;
