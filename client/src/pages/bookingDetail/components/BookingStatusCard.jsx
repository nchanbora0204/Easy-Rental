import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

const STATUS_UI = {
  pending: {
    label: "Chờ thanh toán",
    icon: AlertCircle,
    className: "bg-amber-50 border-amber-200 text-amber-700",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: CheckCircle,
    className: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  ongoing: {
    label: "Đang thuê",
    icon: Clock,
    className: "bg-sky-50 border-sky-200 text-sky-700",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle,
    className: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    className: "bg-gray-50 border-gray-200 text-gray-700",
  },
};

export const BookingStatusCard = ({ status }) => {
  const ui = STATUS_UI[status] || STATUS_UI.pending;
  const Icon = ui.icon;

  return (
    <div className={`border rounded-[var(--radius-lg)] p-4 flex items-center gap-3 ${ui.className}`}>
      <Icon size={22} />
      <div>
        <div className="text-xs opacity-80">Trạng thái</div>
        <div className="font-semibold">{ui.label}</div>
      </div>
    </div>
  );
};
