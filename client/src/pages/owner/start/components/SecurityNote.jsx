import { Shield } from "lucide-react";

export const SecurityNote = () => {
  return (
    <div className="mt-6 p-4 bg-primary/5 rounded-[var(--radius-lg)] flex items-start gap-3">
      <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-primary mb-1">
          Thông tin của bạn được bảo mật
        </p>
        <p className="text-[var(--color-muted)]">
          Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu của bạn theo
          tiêu chuẩn bảo mật cao nhất
        </p>
      </div>
    </div>
  );
};
