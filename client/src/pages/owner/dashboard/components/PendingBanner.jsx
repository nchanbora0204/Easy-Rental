import { Bell } from "lucide-react";

export const PendingBanner = ({ pending }) => {
  if (!pending) return null;
  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
      <Bell size={18} />
      <span>
        Bạn có <strong>{pending} đơn</strong> cần xác nhận/đang diễn ra
      </span>
    </div>
  );
};
