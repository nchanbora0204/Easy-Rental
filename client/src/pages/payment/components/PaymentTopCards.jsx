import { Calendar, MapPin, Smartphone, Timer } from "lucide-react";
import { fmtVND } from "../../../utils/format";

const dd = (s) => (s ? new Date(s) : null);

export const PaymentTopCards = ({
  mmss,
  isExpired,
  title,
  img,
  city,
  pickupDate,
  payNow,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="card-body text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer size={18} className="text-primary" />
            <span className="font-semibold">Thời gian còn lại</span>
          </div>

          <div className={`text-5xl font-bold mb-3 ${isExpired ? "text-danger" : "text-primary"}`}>
            {mmss}
          </div>

          <div className="text-sm text-[var(--color-muted)]">
            Hoàn tiền 100% nếu không thanh toán đúng hạn
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex gap-3 mb-4">
            <div className="w-20 h-20 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden">
              <img src={img} alt={title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1 line-clamp-1">{title}</h3>
              <div className="text-xs text-[var(--color-muted)] space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {city}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {dd(pickupDate)?.toLocaleDateString("vi-VN") || "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-muted)] mb-1">Thanh toán ngay</div>
            <div className="text-2xl font-bold text-primary">{fmtVND(payNow)}đ</div>
          </div>
        </div>
      </div>
    </div>
  );
};
