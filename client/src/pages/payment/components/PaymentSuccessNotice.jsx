import { BadgeCheck } from "lucide-react";

export const PaymentSuccessNotice = () => {
  return (
    <div className="card bg-success/10 border-success/20 animate-pulse">
      <div className="card-body flex items-center gap-3 text-success">
        <BadgeCheck size={22} />
        <div className="flex-1">
          <p className="font-semibold">Thanh toán thành công!</p>
          <p className="text-sm">Đang chuyển hướng đến trang chi tiết đơn hàng...</p>
        </div>
      </div>
    </div>
  );
};
