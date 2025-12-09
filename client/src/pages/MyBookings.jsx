import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { Star, Calendar, MapPin, DollarSign, X } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-gray-100 text-gray-700",
    confirmed: "bg-green-100 text-green-700",
    ongoing: "bg-yellow-100 text-yellow-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const labels = {
    pending: "Chờ thanh toán",
    confirmed: "Đã xác nhận",
    ongoing: "Đang thuê",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status] || status}
    </span>
  );
};

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await api.post("/reviews", {
        bookingId: booking._id,
        rating,
        comment,
      });
      onSuccess();
    } catch (e) {
      alert(e?.response?.data?.message || "Không gửi được đánh giá");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Đánh giá chuyến đi</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {booking?.car?.brand} {booking?.car?.model}
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={n <= rating ? "text-yellow-400" : "text-gray-300"}
                fill={n <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="Chia sẻ trải nghiệm của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const nav = useNavigate();

  const loadBookings = async () => {
    try {
      const { data } = await api.get("/bookings/me");
      setList(data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch (e) {
      alert(e?.response?.data?.message || "Không thể hủy đơn");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Đơn thuê</h1>

        {list.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500">Bạn chưa có đơn thuê xe nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {booking.car?.brand} {booking.car?.model}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {booking.car?.location?.city || "Không rõ"}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-700 mb-4 pb-4 border-b">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(booking.pickupDate).toLocaleDateString()} -{" "}
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <DollarSign size={16} />
                      {Number(booking.total).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => nav(`/bookings/${booking._id}`)}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Chi tiết
                    </button>

                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => nav(`/pay/${booking._id}`)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Thanh toán
                        </button>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}

                    {booking.status === "completed" && !booking.review && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-4 py-2 text-sm bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 flex items-center gap-1"
                      >
                        <Star size={16} />
                        Đánh giá
                      </button>
                    )}

                    {booking.review && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
                        <Star size={14} fill="currentColor" />
                        Đã đánh giá
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBooking && (
          <ReviewModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onSuccess={() => {
              loadBookings();
              setSelectedBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
