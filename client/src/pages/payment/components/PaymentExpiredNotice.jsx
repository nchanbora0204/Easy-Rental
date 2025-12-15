import { AlertCircle } from "lucide-react";

export const PaymentExpiredNotice = () => {
  return (
    <div className="card bg-warning/10 border-warning/20">
      <div className="card-body flex items-center gap-3 text-warning">
        <AlertCircle size={22} />
        <div>
          <p className="font-semibold">Hết thời gian giữ chỗ</p>
          <p className="text-sm">Vui lòng đặt lại hoặc liên hệ hỗ trợ</p>
        </div>
      </div>
    </div>
  );
};
