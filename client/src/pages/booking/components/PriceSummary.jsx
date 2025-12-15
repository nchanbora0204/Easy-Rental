import { ChevronRight, Info, Shield } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const PriceSummary = ({
  pricePerDay,
  days,
  baseTotal,
  insuranceTotal,
  deliveryTotal,
  discount,
  vat,
  subtotal,
  payOption,
  deposit,
  payOnPickup,
  canSubmit,
  creating,
  onSubmit,
  hint,
}) => {
  return (
    <div className="lg:sticky lg:top-20 h-fit">
      <div className="card shadow-lg">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-lg border-b border-[var(--color-border)] pb-3">
            Chi tiết thanh toán
          </h2>

          <div className="space-y-3">
            <Row
              label="Đơn giá thuê xe"
              value={`${fmtVND(pricePerDay)}đ/ngày`}
            />
            <Row label="Số ngày thuê" value={`${days} ngày`} />
            <Row label="Tiền thuê xe" value={`${fmtVND(baseTotal)}đ`} bold />

            {insuranceTotal > 0 ? (
              <Row
                label="Bảo hiểm chuyến đi"
                value={`${fmtVND(insuranceTotal)}đ`}
              />
            ) : null}

            {deliveryTotal > 0 ? (
              <Row
                label="Phí giao & nhận xe"
                value={`${fmtVND(deliveryTotal)}đ`}
              />
            ) : null}

            {discount > 0 ? (
              <Row label="Giảm giá" value={`-${fmtVND(discount)}đ`} success />
            ) : null}

            <Row label="Thuế VAT (10%)" value={`${fmtVND(vat)}đ`} />
          </div>

          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">
                {fmtVND(subtotal)}đ
              </span>
            </div>

            {payOption === "deposit" ? (
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
                  <span className="font-medium">{fmtVND(payOnPickup)}đ</span>
                </div>
              </div>
            ) : null}
          </div>

          <button
            className="btn btn-primary w-full text-lg py-3"
            disabled={!canSubmit || creating}
            onClick={onSubmit}
          >
            {creating ? (
              "Đang xử lý..."
            ) : (
              <>
                Xác nhận đặt xe <ChevronRight size={20} />
              </>
            )}
          </button>

          {!canSubmit ? (
            <div className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
              <Info size={14} className="mt-0.5 flex-shrink-0" />
              <span>{hint}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)] text-sm text-[var(--color-muted)]">
            <Shield size={16} className="text-primary flex-shrink-0" />
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, bold = false, success = false }) => {
  const labelCls = success ? "text-success" : "text-[var(--color-muted)]";
  const valueCls = `${bold ? "font-semibold" : "font-medium"} ${
    success ? "text-success" : ""
  }`;

  return (
    <div className="flex justify-between text-sm">
      <span className={labelCls}>{label}</span>
      <span className={valueCls}>{value}</span>
    </div>
  );
};
