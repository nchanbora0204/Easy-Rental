import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";
import { fmtVND } from "../../utils/format";
import { BookingSteps } from "../booking/components/BookingSteps";
import { PaymentHeader } from "./components/PaymentHeader";
import { PaymentSkeleton } from "./components/PaymentSkeleton";
import { PaymentError } from "./components/PaymentError";
import { PaymentSuccessNotice } from "./components/PaymentSuccessNotice";
import { PaymentExpiredNotice } from "./components/PaymentExpiredNotice";
import { PaymentTopCards } from "./components/PaymentTopCards";
import { PaymentQrCard } from "./components/PaymentQrCard";
import { PaymentManualCard } from "./components/PaymentManualCard";
import { PaymentProcessCard } from "./components/PaymentProcessCard";
import { PaymentSummaryCard } from "./components/PaymentSummaryCard";

const BANK_SHORT = import.meta.env.VITE_BANK_SHORT || "MB";
const BANK_ACC = import.meta.env.VITE_BANK_ACC || "1234567890";
const BANK_NAME = import.meta.env.VITE_BANK_NAME || "MB Bank";
const QR_BASE = import.meta.env.VITE_QR_BASE || "https://qr.sepay.vn/img";
const HOLD_AMOUNT = Number(import.meta.env.VITE_HOLD_AMOUNT || 0);
const HOLD_MINUTES = Number(import.meta.env.VITE_HOLD_MINUTES || 15);

const pad2 = (n) => String(n).padStart(2, "0");

const PaymentPage = () => {
  const { bookingId } = useParams();
  const nav = useNavigate();

  const [bk, setBk] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [copiedField, setCopiedField] = useState("");
  const [mmss, setMmss] = useState("--:--");
  const [isExpired, setIsExpired] = useState(false);

  const paid = useMemo(() => {
    const st = bk?.status;
    return st === "confirmed" || st === "ongoing" || st === "completed";
  }, [bk?.status]);

  const payNow = useMemo(() => {
    const total = Number(bk?.total || 0);
    if (!total) return 0;
    return HOLD_AMOUNT > 0 ? Math.min(HOLD_AMOUNT, total) : total;
  }, [bk?.total]);

  const remainPay = useMemo(() => {
    const total = Number(bk?.total || 0);
    return Math.max(0, total - payNow);
  }, [bk?.total, payNow]);

  const content = useMemo(() => `BOOKING_${bookingId}`, [bookingId]);

  const qrUrl = useMemo(() => {
    if (!BANK_ACC || !BANK_SHORT || !payNow) return "";
    const p = new URLSearchParams({
      acc: String(BANK_ACC),
      bank: String(BANK_SHORT),
      amount: String(payNow),
      des: content,
      template: "compact",
    });
    return `${QR_BASE}?${p.toString()}`;
  }, [payNow, content]);

  const load = useCallback(async () => {
    try {
      setErr("");
      const { data } = await api.get(`/bookings/${bookingId}`);
      setBk(data?.data || data);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Không tải được đơn");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    if (!bookingId) return;

    const iv = setInterval(() => {
      if (!paid) load();
    }, 3000);

    return () => clearInterval(iv);
  }, [bookingId, load, paid]);

  useEffect(() => {
    if (!paid) return;
    const to = setTimeout(() => nav(`/bookings/${bookingId}`), 2000);
    return () => clearTimeout(to);
  }, [paid, bookingId, nav]);

  useEffect(() => {
    if (!bk?.createdAt) {
      setMmss("--:--");
      setIsExpired(false);
      return;
    }

    const start = new Date(bk.createdAt).getTime();
    const end = start + HOLD_MINUTES * 60_000;

    const update = () => {
      const remain = Math.max(0, end - Date.now());
      const m = Math.floor(remain / 60_000);
      const s = Math.floor((remain % 60_000) / 1000);
      setMmss(`${pad2(m)}:${pad2(s)}`);
      setIsExpired(remain === 0);
    };

    update();
    const tm = setInterval(update, 1000);
    return () => clearInterval(tm);
  }, [bk?.createdAt]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch {
      /* ignore */
    }
  };

  const steps = [
    { num: 1, label: "Chọn xe", done: true },
    { num: 2, label: "Xác nhận", done: true },
    { num: 3, label: "Thanh toán", active: true, done: false },
    { num: 4, label: "Nhận xe", done: false },
  ];

  if (loading && !bk && !err) return <PaymentSkeleton />;
  if (err && !bk) return <PaymentError err={err} />;
  if (!bk) return null;

  const car = bk?.car || {};
  const title =
    `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "Xe tự lái";
  const img =
    car.images?.[0] ||
    car.image ||
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";

  const shortCode = String(bookingId || "").slice(-8).toUpperCase();

  const summary = {
    pricePerDay: Number(car.pricePerDay || 0),
    days: Number(bk.days || 1),
    baseTotal: Number(bk.baseTotal || 0),
    insuranceTotal: Number(bk.insurance?.total || 0),
    deliveryTotal: Number(bk.deliveryTotal || 0),
    discount: Number(bk.discount || 0),
    vat: Number(bk.vat || 0),
    total: Number(bk.total || 0),
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PaymentHeader shortCode={shortCode} />

      <div className="section py-8 space-y-6">
        <BookingSteps steps={steps} />

        {paid ? <PaymentSuccessNotice /> : null}
        {isExpired && !paid ? <PaymentExpiredNotice /> : null}
        {err ? (
          <div className="card bg-red-50 border-red-200">
            <div className="card-body text-danger text-sm">{err}</div>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PaymentTopCards
              mmss={mmss}
              isExpired={isExpired}
              title={title}
              img={img}
              city={car?.location?.city || "-"}
              pickupDate={bk.pickupDate}
              payNow={payNow}
            />

            <PaymentQrCard qrUrl={qrUrl} />

            <PaymentManualCard
              payNow={payNow}
              content={content}
              bankAcc={BANK_ACC}
              bankName={BANK_NAME}
              bankShort={BANK_SHORT}
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />

            <PaymentProcessCard payNow={payNow} remainPay={remainPay} />
          </div>

          <PaymentSummaryCard
            summary={summary}
            payNow={payNow}
            remainPay={remainPay}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
