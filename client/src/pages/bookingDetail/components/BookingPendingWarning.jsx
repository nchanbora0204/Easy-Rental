import { AlertCircle } from "lucide-react";

export const BookingPendingWarning = () => {
  return (
    <div className="border border-amber-200 bg-amber-50 rounded-[var(--radius-lg)] p-4 flex gap-3">
      <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-900">
        <div className="font-semibold mb-1">Vui lòng hoàn tất thanh toán</div>
        <div>Đơn của bạn sẽ tự động hủy sau 24 giờ nếu chưa thanh toán.</div>
      </div>
    </div>
  );
};
