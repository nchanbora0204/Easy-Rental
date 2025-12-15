import { Wallet, ListChecks, Activity, CarFront } from "lucide-react";
import { fmtVND } from "../ownerReports.utils";

export const SummaryCards = ({
  show,
  totalRevenue,
  totalBookings,
  bookingsByStatus,
  completionRate,
  utilization,
}) => {
  if (!show) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Wallet className="text-blue-600" size={20} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Tổng doanh thu</div>
          <div className="text-lg font-bold text-gray-900">
            {fmtVND(totalRevenue)}đ
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
          <ListChecks className="text-green-600" size={20} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Tổng số đơn</div>
          <div className="text-lg font-bold text-gray-900">{totalBookings}</div>
          <div className="text-xs text-gray-500 mt-1">
            Hoàn thành: {bookingsByStatus.completed || 0} • Hủy:{" "}
            {(bookingsByStatus.cancelled || 0) +
              (bookingsByStatus.cancelled_timeout || 0)}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-xs text-gray-500 mb-1">Tỉ lệ hoàn thành</div>
        <div className="text-lg font-bold text-gray-900">{completionRate}%</div>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="text-[10px] text-gray-500 mt-2">
          Dựa trên tất cả trạng thái đơn trong khoảng thời gian lọc
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} className="text-purple-600" />
          <span className="text-xs text-gray-500">Mức độ sử dụng xe</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {utilization.utilization ?? 0}%
        </div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <CarFront size={12} />
          Ngày được thuê: {utilization.bookedDays ?? 0} /{" "}
          {utilization.capacityDays ?? 0}
        </div>
      </div>
    </div>
  );
};
