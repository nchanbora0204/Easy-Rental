import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Shield,
  FileText,
  Info,
  ChevronRight,
  AlertCircle,
  Check,
} from "lucide-react";
import api from "../lib/axios";

const fmtVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));
const daysBetween = (s, e) => {
  if (!s || !e) return 0;
  const ds = new Date(s),
    de = new Date(e);
  const ms = de - ds;
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
};

const INSURANCE_OPTIONS = [
  { key: "none", label: "Không mua bảo hiểm", daily: 0 },
  { key: "basic", label: "Bảo hiểm cơ bản", daily: 50000 },
  { key: "plus", label: "Bảo hiểm toàn diện", daily: 120000 },
];

const DOOR_FEE = 70000;

export default function BookCar() {
  const { carId } = useParams();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const location = useLocation();

  const pricingFromState = location.state?.pricing || {};

  const [pickupDate, setPickup] = useState(sp.get("pickup") || "");
  const [pickupTime, setPickupTime] = useState(sp.get("pickupTime") || "");
  const [returnDate, setReturnD] = useState(sp.get("return") || "");
  const [returnTime, setReturnTime] = useState(sp.get("returnTime") || "");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [wantInvoice, setWantInvoice] = useState(false);
  const [payOption, setPayOption] = useState("deposit");
  const [creating, setCreating] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/cars/${carId}`);
        const c = data?.data || data;
        if (alive) setCar(c);
      } catch (e) {
        if (alive)
          setErr(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được thông tin xe"
          );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [carId]);

  const days = useMemo(
    () => daysBetween(pickupDate, returnDate),
    [pickupDate, returnDate]
  );
  const pricePerDay = Number(car?.pricePerDay || 0);

  const insKey = sp.get("insKey") || pricingFromState.insuranceKey || "none";

  const doorSelected =
    sp.get("door") === "1" || Boolean(pricingFromState.doorToDoor);

  const insuranceDaily =
    INSURANCE_OPTIONS.find((x) => x.key === insKey)?.daily || 0;
  const insuranceTotal = days * insuranceDaily;

  const baseTotal = days * pricePerDay;
  const deliveryTotal = doorSelected ? DOOR_FEE * 2 : 0;

  const discount = Number(pricingFromState.discount || 0);
  const rentTotal = baseTotal + insuranceTotal + deliveryTotal;
  const vat = Math.round((rentTotal - discount) * 0.1);
  const subtotal = Math.max(0, rentTotal - discount + vat);

  const deposit = Number(car?.deposit || 500000);
  const payOnPickup = Math.max(0, subtotal - deposit);

  const canSubmit =
    car &&
    days > 0 &&
    pickupDate &&
    returnDate &&
    fullName &&
    phone &&
    agreeTerms;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setCreating(true);
    try {
      const payload = {
        car: carId,
        pickupDate: new Date(pickupDate).toISOString(),
        returnDate: new Date(returnDate).toISOString(),
        customerInfo: {
          fullName,
          phone,
          email,
        },
        notes,
        paymentOption: payOption,
        wantInvoice,
        extras: {
          insuranceKey: insKey,
          insuranceDaily,
          insuranceTotal,
          doorToDoor: doorSelected,
          doorFee: DOOR_FEE,
          deliveryTotal,
        },
        pricing: {
          days,
          basePrice: pricePerDay,
          baseTotal,
          discount,
          vat,
        },
      };

      const { data } = await api.post("/bookings", payload);

      const booking = data?.data;
      if (!booking?._id) throw new Error("Tạo booking thất bại");
      nav(`/pay/${booking._id}`);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          (e?.response?.data?.errors &&
            e.response.data.errors.map((x) => x.msg).join(", ")) ||
          e.message ||
          "Không tạo được đơn"
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="section py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card animate-pulse h-40" />
            <div className="card animate-pulse h-96" />
          </div>
          <div className="card animate-pulse h-[500px]" />
        </div>
      </div>
    );
  }

  if (err && !car) {
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

  if (!car) return null;

  const name =
    `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "Xe tự lái";
  const image =
    car.images?.[0] ||
    car.image ||
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";
  const loc = (() => {
    const L = car?.location;
    if (!L) return "";
    if (typeof L === "string") return L;
    const { address, ward, district, city, province, state } = L;
    return [address, ward, district, city || province || state]
      .filter(Boolean)
      .join(", ");
  })();

  const steps = [
    { num: 1, label: "Tìm & chọn xe", active: false, done: true },
    { num: 2, label: "Xác nhận đơn hàng", active: true, done: false },
    { num: 3, label: "Thanh toán", active: false, done: false },
    { num: 4, label: "Nhận xe", active: false, done: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="section py-6">
          <h1 className="text-3xl font-bold mb-2">Xác nhận đặt xe</h1>
          <p className="text-[var(--color-muted)]">
            Vui lòng kiểm tra thông tin và hoàn tất đặt xe
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

        {/* Error Display */}
        {err && (
          <div className="card bg-red-50 border-red-200">
            <div className="card-body flex items-center gap-3 text-danger">
              <AlertCircle size={20} />
              <span>{err}</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Info Summary */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-primary" />
                  Thông tin xe
                </h2>
                <div className="flex gap-4">
                  <div className="w-32 h-24 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{name}</h3>
                    <div className="space-y-1 text-sm text-[var(--color-muted)]">
                      {loc && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {loc}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {pickupDate || "__/__/____"} {pickupTime || "00:00"} →{" "}
                        {returnDate || "__/__/____"} {returnTime || "00:00"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {days} ngày thuê
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info Form */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Thông tin người thuê
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label flex items-center gap-2 mb-2">
                      <User size={16} />
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      className="input"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label flex items-center gap-2 mb-2">
                        <Phone size={16} />
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                        className="input"
                        placeholder="0912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="label flex items-center gap-2 mb-2">
                        <Mail size={16} />
                        Email (tùy chọn)
                      </label>
                      <input
                        type="email"
                        className="input"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label flex items-center gap-2 mb-2">
                      <FileText size={16} />
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      className="textarea"
                      rows="3"
                      placeholder="Thêm ghi chú cho chủ xe..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-[var(--radius-lg)] cursor-pointer transition-all ${
                      payOption === "deposit"
                        ? "border-primary bg-primary/5"
                        : "border-[var(--color-border)] hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      className="mt-1"
                      checked={payOption === "deposit"}
                      onChange={() => setPayOption("deposit")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">
                          Thanh toán đặt cọc
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {fmtVND(deposit)}đ
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">
                        Giữ chỗ ngay, hoàn lại 100% nếu xe không khả dụng. Số
                        tiền còn lại thanh toán khi nhận xe.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-[var(--radius-lg)] cursor-pointer transition-all ${
                      payOption === "full"
                        ? "border-primary bg-primary/5"
                        : "border-[var(--color-border)] hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      className="mt-1"
                      checked={payOption === "full"}
                      onChange={() => setPayOption("full")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">
                          Thanh toán toàn bộ
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {fmtVND(subtotal)}đ
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">
                        Thanh toán 100% ngay. Nhận xe dễ dàng hơn, không cần
                        thanh toán thêm.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-[var(--radius-lg)] cursor-pointer transition-all ${
                      payOption === "later"
                        ? "border-primary bg-primary/5"
                        : "border-[var(--color-border)] hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      className="mt-1"
                      checked={payOption === "later"}
                      onChange={() => setPayOption("later")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">
                          Thanh toán khi nhận xe
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {fmtVND(subtotal)}đ
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">
                        Không thanh toán online. Thanh toán trực tiếp cho chủ xe
                        khi nhận xe.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Invoice Option */}
                <div className="mt-4 p-4 bg-[var(--color-bg)] rounded-[var(--radius-md)]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantInvoice}
                      onChange={(e) => setWantInvoice(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium">Xuất hóa đơn VAT</span>
                      <p className="text-sm text-[var(--color-muted)] mt-1">
                        Yêu cầu xuất hóa đơn đỏ cho doanh nghiệp
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <div className="text-sm">
                    <p>
                      Tôi đã đọc và đồng ý với{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Điều khoản sử dụng
                      </Link>
                      ,{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Chính sách bảo mật
                      </Link>{" "}
                      và{" "}
                      <Link
                        to="/cancellation"
                        className="text-primary hover:underline"
                      >
                        Chính sách hủy chuyến
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price Summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="card shadow-lg">
              <div className="card-body space-y-4">
                <h2 className="font-semibold text-lg border-b border-[var(--color-border)] pb-3">
                  Chi tiết thanh toán
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">
                      Đơn giá thuê xe
                    </span>
                    <span className="font-medium">
                      {fmtVND(pricePerDay)}đ/ngày
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">
                      Số ngày thuê
                    </span>
                    <span className="font-medium">{days} ngày</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">
                      Tiền thuê xe
                    </span>
                    <span className="font-semibold">{fmtVND(baseTotal)}đ</span>
                  </div>

                  {insuranceTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-muted)]">
                        Bảo hiểm chuyến đi
                      </span>
                      <span className="font-medium">
                        {fmtVND(insuranceTotal)}đ
                      </span>
                    </div>
                  )}

                  {deliveryTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-muted)]">
                        Phí giao & nhận xe
                      </span>
                      <span className="font-medium">
                        {fmtVND(deliveryTotal)}đ
                      </span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Giảm giá</span>
                      <span className="font-medium text-success">
                        -{fmtVND(discount)}đ
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">
                      Thuế VAT (10%)
                    </span>
                    <span className="font-medium">{fmtVND(vat)}đ</span>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-3">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">
                      {fmtVND(subtotal)}đ
                    </span>
                  </div>

                  {payOption === "deposit" && (
                    <div className="bg-primary/5 border border-primary/20 rounded-[var(--radius-md)] p-3 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Thanh toán ngay</span>
                        <span className="font-bold text-primary">
                          {fmtVND(deposit)}đ
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-muted)]">
                          Thanh toán khi nhận xe
                        </span>
                        <span className="font-medium">
                          {fmtVND(payOnPickup)}đ
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary w-full text-lg py-3"
                  disabled={!canSubmit || creating}
                  onClick={handleCreate}
                >
                  {creating ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      Xác nhận đặt xe
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>

                {!canSubmit && (
                  <div className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
                    <Info size={14} className="mt-0.5 flex-shrink-0" />
                    <span>
                      {!fullName || !phone
                        ? "Vui lòng điền đầy đủ thông tin"
                        : !agreeTerms
                        ? "Vui lòng đồng ý với điều khoản"
                        : "Vui lòng chọn ngày nhận/trả hợp lệ"}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)] text-sm text-[var(--color-muted)]">
                  <Shield size={16} className="text-primary flex-shrink-0" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
