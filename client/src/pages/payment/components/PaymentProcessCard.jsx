import { CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const PaymentProcessCard = ({ payNow, remainPay }) => {
  return (
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

          {remainPay > 0 ? (
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-[var(--color-muted)] mt-0.5" />
              <span>
                Thanh toán khi nhận xe: <strong>{fmtVND(remainPay)}đ</strong>
              </span>
            </div>
          ) : null}

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
  );
};
