import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import {
  Calendar,
  Clock,
  MapPin,
  BadgeCheck,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Info,
  AlertCircle,
  Timer,
  ChevronRight,
  Smartphone,
  Building2,
  CheckCircle2,
} from "lucide-react";

const BANK_SHORT = import.meta.env.VITE_BANK_SHORT || "MB";
const BANK_ACC = import.meta.env.VITE_BANK_ACC || "1234567890";
const BANK_NAME = import.meta.env.VITE_BANK_NAME || "MB Bank";
const QR_BASE = import.meta.env.VITE_QR_BASE || "https://qr.sepay.vn/img";
const HOLD_AMOUNT = Number(import.meta.env.VITE_HOLD_AMOUNT || 0);
const HOLD_MINUTES = Number(import.meta.env.VITE_HOLD_MINUTES || 15);

const fmtVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));
const dd = (s) => (s ? new Date(s) : null);
const pad2 = (n) => String(n).padStart(2, "0");

export default function PaymentPage() {
  const { bookingId } = useParams();
  const nav = useNavigate();

  const [bk, setBk] = useState(null);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState("");

  const paid =
    bk?.status === "confirmed" ||
    bk?.status === "ongoing" ||
    bk?.status === "completed";

  const payNow = useMemo(() => {
    if (!bk?.total) return 0;
    return HOLD_AMOUNT > 0
      ? Math.min(HOLD_AMOUNT, Number(bk.total))
      : Number(bk.total);
  }, [bk?.total]);

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

  const load = async () => {
    try {
      setErr("");
      const { data } = await api.get(`/bookings/${bookingId}`);
      setBk(data?.data || data);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Không tải được đơn");
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(iv);
  }, [bookingId]);

  useEffect(() => {
    if (tick) load();
  }, [tick]);

  useEffect(() => {
    if (paid) {
      const to = setTimeout(() => nav(`/bookings/${bookingId}`), 2000);
      return () => clearTimeout(to);
    }
  }, [paid, bookingId, nav]);

  const [mmss, setMmss] = useState("15:00");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    let tm;
    const update = () => {
      if (!bk?.createdAt) return setMmss("--:--");
      const start = new Date(bk.createdAt).getTime();
      const end = start + HOLD_MINUTES * 60_000;
      const remain = Math.max(0, end - Date.now());
      const m = Math.floor(remain / 60_000);
      const s = Math.floor((remain % 60_000) / 1000);
      setMmss(`${pad2(m)}:${pad2(s)}`);
      setIsExpired(remain === 0);
    };
    update();
    tm = setInterval(update, 1000);
    return () => clearInterval(tm);
  }, [bk?.createdAt]);

  const copy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!bk && !err) {
    return (
      <div className="section py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card animate-pulse h-48" />
            <div className="card animate-pulse h-64" />
          </div>
          <div className="card animate-pulse h-96" />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="section py-8">
        <div className="card bg-red-50 border-red-200">
          <div className="card-body flex items-center gap-3 text-danger">
            <AlertCircle size={24} />
            <span>{err}</span>
          </div>
        </div>
      </div>
    );
  }

  const car = bk?.car || {};
  const title =
    `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "Xe tự lái";
  const img =
    car.images?.[0] ||
    car.image ||
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";
  const remainPay = Math.max(0, Number(bk?.total || 0) - payNow);

  const steps = [
    { num: 1, label: "Chọn xe", done: true },
    { num: 2, label: "Xác nhận", done: true },
    { num: 3, label: "Thanh toán", active: true, done: false },
    { num: 4, label: "Nhận xe", done: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="section py-6">
          <h1 className="text-3xl font-bold mb-2">Thanh toán đặt xe</h1>
          <p className="text-[var(--color-muted)]">
            Mã đơn hàng:{" "}
            <span className="font-mono font-semibold text-[var(--color-fg)]">
              #{String(bookingId).slice(-8).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="section py-8 space-y-6">
        {/* Progress Steps */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step.done
                          ? "bg-success text-white"
                          : step.active
                          ? "bg-primary text-white ring-4 ring-primary/20"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.done ? <Check size={20} /> : step.num}
                    </div>
                    <span
                      className={`text-sm font-medium text-center ${
                        step.active
                          ? "text-primary"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        step.done ? "bg-success" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {paid && (
          <div className="card bg-success/10 border-success/20 animate-pulse">
            <div className="card-body flex items-center gap-3 text-success">
              <BadgeCheck size={24} />
              <div className="flex-1">
                <p className="font-semibold">Thanh toán thành công!</p>
                <p className="text-sm">
                  Đang chuyển hướng đến trang chi tiết đơn hàng...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expired Warning */}
        {isExpired && !paid && (
          <div className="card bg-warning/10 border-warning/20">
            <div className="card-body flex items-center gap-3 text-warning">
              <AlertCircle size={24} />
              <div>
                <p className="font-semibold">Hết thời gian giữ chỗ</p>
                <p className="text-sm">Vui lòng đặt lại hoặc liên hệ hỗ trợ</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown & Booking Info */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Countdown Card */}
              <div className="card bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="card-body text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Timer size={20} className="text-primary" />
                    <span className="font-semibold">Thời gian còn lại</span>
                  </div>
                  <div
                    className={`text-5xl font-bold mb-3 ${
                      isExpired ? "text-danger" : "text-primary"
                    }`}
                  >
                    {mmss}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">
                    Hoàn tiền 100% nếu không thanh toán đúng hạn
                  </div>
                </div>
              </div>

              {/* Car Info Card */}
              <div className="card">
                <div className="card-body">
                  <div className="flex gap-3 mb-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden">
                      <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {title}
                      </h3>
                      <div className="text-xs text-[var(--color-muted)] space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {car?.location?.city || "-"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {dd(bk.pickupDate)?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-border)]">
                    <div className="text-sm text-[var(--color-muted)] mb-1">
                      Thanh toán ngay
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {fmtVND(payNow)}đ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Payment */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <QrCode size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      Quét mã QR để thanh toán
                    </h2>
                    <p className="text-sm text-[var(--color-muted)]">
                      Cách nhanh nhất - Tự động xác nhận
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    {qrUrl ? (
                      <>
                        <div className="relative">
                          <img
                            src={qrUrl}
                            alt="VietQR"
                            className="w-64 h-64 object-contain border-2 border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-lg"
                          />
                          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Smartphone size={24} className="text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-[var(--color-muted)] mt-4 text-center">
                          Mở app ngân hàng và quét mã QR
                        </p>
                      </>
                    ) : (
                      <div className="w-64 h-64 bg-[var(--color-surface)] rounded-[var(--radius-xl)] flex items-center justify-center">
                        <p className="text-[var(--color-muted)] text-sm text-center px-4">
                          Thiếu cấu hình ngân hàng
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">
                          1
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Mở app Ngân hàng</p>
                        <p className="text-sm text-[var(--color-muted)]">
                          Sử dụng bất kỳ app ngân hàng nào
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">
                          2
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Quét mã QR</p>
                        <p className="text-sm text-[var(--color-muted)]">
                          Tìm tính năng "Chuyển khoản QR"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">
                          3
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Xác nhận thanh toán</p>
                        <p className="text-sm text-[var(--color-muted)]">
                          Hệ thống tự động xác nhận trong vài giây
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-accent/10 rounded-[var(--radius-md)] flex items-start gap-2">
                      <Info
                        size={16}
                        className="text-accent flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-[var(--color-fg)]">
                        Nội dung chuyển khoản đã được tự động điền sẵn trong mã
                        QR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Transfer */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Building2 size={20} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      Chuyển khoản thủ công
                    </h2>
                    <p className="text-sm text-[var(--color-muted)]">
                      Nhập thông tin bên dưới vào app ngân hàng
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <CopyField
                    label="Số tiền"
                    value={`${fmtVND(payNow)} đ`}
                    copyValue={payNow}
                    icon={<CreditCard size={16} />}
                    copied={copied === "amount"}
                    onCopy={() => copy(payNow, "amount")}
                  />
                  <CopyField
                    label="Nội dung"
                    value={content}
                    copyValue={content}
                    icon={<Info size={16} />}
                    copied={copied === "content"}
                    onCopy={() => copy(content, "content")}
                    highlight
                  />
                  <CopyField
                    label="Số tài khoản"
                    value={BANK_ACC}
                    copyValue={BANK_ACC}
                    icon={<CreditCard size={16} />}
                    copied={copied === "account"}
                    onCopy={() => copy(BANK_ACC, "account")}
                  />
                  <CopyField
                    label="Ngân hàng"
                    value={`${BANK_NAME} (${BANK_SHORT})`}
                    copyValue={BANK_SHORT}
                    icon={<Building2 size={16} />}
                    copied={copied === "bank"}
                    onCopy={() => copy(BANK_SHORT, "bank")}
                  />
                </div>

                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-[var(--radius-md)] flex items-start gap-2">
                  <AlertCircle
                    size={16}
                    className="text-warning flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-[var(--color-fg)]">
                    <strong>Lưu ý:</strong> Nhập đúng nội dung chuyển khoản để
                    hệ thống tự động xác nhận
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Steps */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-semibold mb-3">Quy trình thanh toán</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-success mt-0.5" />
                    <span>
                      Thanh toán <strong>giữ chỗ</strong>: {fmtVND(payNow)}đ
                    </span>
                  </div>
                  {HOLD_AMOUNT > 0 && remainPay > 0 && (
                    <div className="flex items-start gap-2">
                      <Clock
                        size={16}
                        className="text-[var(--color-muted)] mt-0.5"
                      />
                      <span>
                        Thanh toán khi nhận xe:{" "}
                        <strong>{fmtVND(remainPay)}đ</strong>
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary mt-0.5" />
                    <span>Hệ thống tự động xác nhận trong vài giây</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary mt-0.5" />
                    <span>Nhận thông báo qua email và SMS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="card shadow-lg">
              <div className="card-body space-y-4">
                <h2 className="font-semibold text-lg border-b border-[var(--color-border)] pb-3">
                  Chi tiết thanh toán
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">
                      Đơn giá thuê
                    </span>
                    <span className="font-medium">
                      {fmtVND(car.pricePerDay)}đ/ngày
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">
                      Số ngày thuê
                    </span>
                    <span className="font-medium">{bk.days || 1} ngày</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">
                      Tiền thuê xe
                    </span>
                    <span className="font-medium">
                      {fmtVND(bk.baseTotal || 0)}đ
                    </span>
                  </div>

                  {bk.insurance?.total > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">
                        Bảo hiểm
                      </span>
                      <span className="font-medium">
                        {fmtVND(bk.insurance.total)}đ
                      </span>
                    </div>
                  )}

                  {bk.deliveryTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">
                        Phí giao & nhận xe
                      </span>
                      <span className="font-medium">
                        {fmtVND(bk.deliveryTotal)}đ
                      </span>
                    </div>
                  )}

                  {bk.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-success">Giảm giá</span>
                      <span className="font-medium text-success">
                        -{fmtVND(bk.discount)}đ
                      </span>
                    </div>
                  )}

                  {bk.vat > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">
                        Thuế VAT (10%)
                      </span>
                      <span className="font-medium">{fmtVND(bk.vat)}đ</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--color-border)] pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">
                      {fmtVND(bk.total)}đ
                    </span>
                  </div>

                  <div className="p-3 bg-primary/5 rounded-[var(--radius-md)] space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Thanh toán ngay</span>
                      <span className="font-bold text-primary">
                        {fmtVND(payNow)}đ
                      </span>
                    </div>
                    {remainPay > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-muted)]">
                          Thanh toán khi nhận xe
                        </span>
                        <span className="font-medium">
                          {fmtVND(remainPay)}đ
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-start gap-2 text-xs text-[var(--color-muted)]">
                  <Info size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    Hệ thống tự động xác nhận đơn ngay khi nhận được thanh toán
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  copyValue,
  icon,
  copied,
  onCopy,
  highlight,
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-[var(--radius-md)] transition-all ${
        highlight
          ? "bg-warning/10 border border-warning/20"
          : "bg-[var(--color-bg)]"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-[var(--color-muted)] flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[var(--color-muted)] mb-0.5">
            {label}
          </div>
          <div
            className={`font-mono font-medium ${
              highlight ? "text-warning" : ""
            } truncate`}
          >
            {value}
          </div>
        </div>
      </div>
      <button
        onClick={onCopy}
        className={`btn ${
          copied ? "btn-success" : "btn-ghost"
        } px-3 py-1.5 flex-shrink-0`}
      >
        {copied ? (
          <>
            <Check size={16} />
            <span className="hidden sm:inline">Đã copy</span>
          </>
        ) : (
          <>
            <Copy size={16} />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
