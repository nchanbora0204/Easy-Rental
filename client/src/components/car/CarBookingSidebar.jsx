import {
  Calendar,
  Clock,
  Shield,
  BadgePercent,
  Check,
  X,
  Info,
} from "lucide-react";
import { fmtVND } from "../../utils/format";

export default function CarBookingSidebar(props) {
  const {
    car,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    setPickup,
    setPickupTime,
    setReturnD,
    setReturnTime,
    canCheck,
    checking,
    checkAvailable,
    available,
    insuranceOptions,
    insKey,
    setInsKey,
    doorToDoor,
    setDoorToDoor,
    doorFee,
    coupon,
    setCoupon,
    applyCoupon,
    couponOff,
    base,
    d,
    baseTotal,
    insTotal,
    deliveryTotal,
    discount,
    vat,
    grand,
    deposit,
    onBook,
  } = props;

  return (
    <div className="lg:sticky lg:top-20 h-fit">
      <div className="card shadow-lg">
        <div className="card-body space-y-4">
          <div className="flex items-baseline gap-2 pb-4 border-b border-[var(--color-border)]">
            <div className="text-3xl font-bold text-primary">
              {fmtVND(car.pricePerDay)}đ
            </div>
            <div className="text-[var(--color-muted)]">/ngày</div>
          </div>

          {/* Date/Time Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <DateInput
                label="Ngày nhận"
                icon={<Calendar size={16} className="text-primary" />}
                value={pickupDate}
                onChange={setPickup}
              />
              <DateInput
                label="Giờ nhận"
                icon={<Clock size={16} className="text-primary" />}
                type="time"
                value={pickupTime}
                onChange={setPickupTime}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DateInput
                label="Ngày trả"
                icon={<Calendar size={16} className="text-primary" />}
                value={returnDate}
                onChange={setReturnD}
              />
              <DateInput
                label="Giờ trả"
                icon={<Clock size={16} className="text-primary" />}
                type="time"
                value={returnTime}
                onChange={setReturnTime}
              />
            </div>
          </div>

          <button
            className="btn btn-outline w-full"
            disabled={!canCheck || checking}
            onClick={checkAvailable}
          >
            {checking ? "Đang kiểm tra..." : "Kiểm tra khả dụng"}
          </button>

          {available !== null && (
            <div
              className={`p-3 rounded-[var(--radius-md)] flex items-center gap-2 ${
                available
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {available ? <Check size={18} /> : <X size={18} />}
              <span className="text-sm font-medium">
                {available ? "Xe còn trống" : "Xe đã được đặt"}
              </span>
            </div>
          )}

          {/* Insurance */}
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Bảo hiểm chuyến đi
            </div>
            <div className="space-y-2">
              {insuranceOptions.map((opt) => (
                <label
                  key={opt.key}
                  className={`flex items-start gap-3 p-3 border rounded-[var(--radius-md)] cursor-pointer transition-all ${
                    insKey === opt.key
                      ? "border-primary bg-primary/5"
                      : "border-[var(--color-border)] hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="ins"
                    className="mt-1"
                    checked={insKey === opt.key}
                    onChange={() => setInsKey(opt.key)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-sm font-semibold text-primary">
                        {opt.daily ? `${fmtVND(opt.daily)}đ/ngày` : "Miễn phí"}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      {opt.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Door-to-door */}
          <label
            className={`flex items-center justify-between p-3 border rounded-[var(--radius-md)] cursor-pointer transition-all ${
              doorToDoor
                ? "border-primary bg-primary/5"
                : "border-[var(--color-border)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={doorToDoor}
                onChange={(e) => setDoorToDoor(e.target.checked)}
              />
              <div>
                <div className="font-medium">Giao & nhận xe tận nơi</div>
                <div className="text-xs text-[var(--color-muted)]">
                  Tiết kiệm thời gian
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold text-primary">
              {fmtVND(doorFee)}đ/lượt
            </div>
          </label>

          {/* Coupon */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <BadgePercent size={18} className="text-primary" />
              Mã giảm giá
            </label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Nhập mã"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="btn btn-primary" onClick={applyCoupon}>
                Áp dụng
              </button>
            </div>
            {couponOff > 0 && (
              <div className="text-sm text-success flex items-center gap-1">
                <Check size={14} />
                Giảm {fmtVND(couponOff)}đ
              </div>
            )}
          </div>

          {/* Breakdown */}
          <PriceBreakdown
            base={base}
            d={d}
            baseTotal={baseTotal}
            insTotal={insTotal}
            deliveryTotal={deliveryTotal}
            discount={discount}
            vat={vat}
            grand={grand}
            deposit={deposit}
          />

          <button
            className="btn btn-primary w-full text-lg py-3"
            disabled={available === false || !d}
            onClick={onBook}
          >
            Thuê xe ngay
          </button>

          <div className="text-xs text-[var(--color-muted)] flex items-start gap-2">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              Đặt xe thành công sẽ giữ chỗ tạm thời trong 15 phút để thực hiện
              thanh toán.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInput({ label, icon, value, onChange, type = "date" }) {
  return (
    <div>
      <label className="label flex items-center gap-2 font-medium mb-2">
        {icon}
        {label}
      </label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PriceBreakdown({
  base,
  d,
  baseTotal,
  insTotal,
  deliveryTotal,
  discount,
  vat,
  grand,
  deposit,
}) {
  return (
    <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
      <Row label="Đơn giá thuê xe" value={`${fmtVND(base)}đ x ${d} ngày`} />
      <Row label="Tổng tiền thuê" value={`${fmtVND(baseTotal)}đ`} />
      {insTotal > 0 && <Row label="Bảo hiểm" value={`${fmtVND(insTotal)}đ`} />}
      {deliveryTotal > 0 && (
        <Row label="Phí giao nhận" value={`${fmtVND(deliveryTotal)}đ`} />
      )}
      {discount > 0 && (
        <Row label="Giảm giá" value={`-${fmtVND(discount)}đ`} highlight />
      )}
      <Row label="Thuế VAT (10%)" value={`${fmtVND(vat)}đ`} />

      <div className="pt-3 border-t border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary">
            {fmtVND(grand)}đ
          </span>
        </div>
        <Row
          label="Tiền cọc (hoàn sau chuyến)"
          value={`${fmtVND(deposit)}đ`}
          muted
        />
      </div>
    </div>
  );
}

function Row({ label, value, highlight, muted }) {
  return (
    <div className="flex justify-between text-sm">
      <span
        className={
          highlight
            ? "text-success"
            : muted
            ? "text-[var(--color-muted)]"
            : "text-[var(--color-muted)]"
        }
      >
        {label}
      </span>
      <span className={`font-medium ${highlight ? "text-success" : ""}`}>
        {value}
      </span>
    </div>
  );
}
