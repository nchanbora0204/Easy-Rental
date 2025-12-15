import { Info } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const PaymentSummaryCard = ({ summary, payNow, remainPay }) => {
  return (
    <div className="lg:sticky lg:top-20 h-fit">
      <div className="card shadow-lg">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-lg border-b border-[var(--color-border)] pb-3">
            Chi tiết thanh toán
          </h2>

          <div className="space-y-3 text-sm">
            <Row label="Đơn giá thuê" value={`${fmtVND(summary.pricePerDay)}đ/ngày`} />
            <Row label="Số ngày thuê" value={`${summary.days} ngày`} />
            <Row label="Tiền thuê xe" value={`${fmtVND(summary.baseTotal)}đ`} />

            {summary.insuranceTotal > 0 ? (
              <Row label="Bảo hiểm" value={`${fmtVND(summary.insuranceTotal)}đ`} />
            ) : null}

            {summary.deliveryTotal > 0 ? (
              <Row label="Phí giao & nhận xe" value={`${fmtVND(summary.deliveryTotal)}đ`} />
            ) : null}

            {summary.discount > 0 ? (
              <Row label="Giảm giá" value={`-${fmtVND(summary.discount)}đ`} success />
            ) : null}

            {summary.vat > 0 ? (
              <Row label="Thuế VAT (10%)" value={`${fmtVND(summary.vat)}đ`} />
            ) : null}
          </div>

          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-lg">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">
                {fmtVND(summary.total)}đ
              </span>
            </div>

            <div className="p-3 bg-primary/5 rounded-[var(--radius-md)] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Thanh toán ngay</span>
                <span className="font-bold text-primary">{fmtVND(payNow)}đ</span>
              </div>

              {remainPay > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Thanh toán khi nhận xe</span>
                  <span className="font-medium">{fmtVND(remainPay)}đ</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)] flex items-start gap-2 text-xs text-[var(--color-muted)]">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>Hệ thống tự động xác nhận đơn ngay khi nhận được thanh toán</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, success = false }) => {
  return (
    <div className="flex justify-between">
      <span className={success ? "text-success" : "text-[var(--color-muted)]"}>
        {label}
      </span>
      <span className={`font-medium ${success ? "text-success" : ""}`}>{value}</span>
    </div>
  );
};
