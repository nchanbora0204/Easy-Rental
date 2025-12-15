import { Calendar, DollarSign, MapPin, Star } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDateVI, formatVND } from "../myBookingsUtils";

export const BookingCard = ({ booking, onView, onPay, onCancel, onReview }) => {
  const canPay = booking?.status === "pending";
  const canReview = booking?.status === "completed" && !booking?.review;
  const hasReview = Boolean(booking?.review);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              {booking?.car?.brand} {booking?.car?.model}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {booking?.car?.location?.city || "Không rõ"}
              </span>
            </div>
          </div>
          <StatusBadge status={booking?.status} />
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-700 mb-4 pb-4 border-b">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {formatDateVI(booking?.pickupDate)} -{" "}
            {formatDateVI(booking?.returnDate)}
          </span>
          <span className="flex items-center gap-1 font-semibold text-blue-600">
            <DollarSign size={16} />
            {formatVND(booking?.total)} đ
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => onView?.(booking)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Chi tiết
          </button>

          {canPay && (
            <>
              <button
                type="button"
                onClick={() => onPay?.(booking)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thanh toán
              </button>
              <button
                type="button"
                onClick={() => onCancel?.(booking)}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Hủy đơn
              </button>
            </>
          )}

          {canReview && (
            <button
              type="button"
              onClick={() => onReview?.(booking)}
              className="px-4 py-2 text-sm bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 flex items-center gap-1"
            >
              <Star size={16} />
              Đánh giá
            </button>
          )}

          {hasReview && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
              <Star size={14} fill="currentColor" />
              Đã đánh giá
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
