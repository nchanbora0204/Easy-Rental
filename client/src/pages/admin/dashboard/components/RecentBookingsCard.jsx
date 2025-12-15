import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { statusBadgeClass } from "../utils";

export const RecentBookingsCard = ({ bookings }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-gray-600" size={20} />
          <h2 className="font-semibold text-gray-800">Đơn hàng gần đây</h2>
        </div>
        <Link
          to="/admin/bookings"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="p-6">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-800">
                    {booking.car?.brand} {booking.car?.model}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${statusBadgeClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {booking.user?.name || booking.user?.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(booking.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
