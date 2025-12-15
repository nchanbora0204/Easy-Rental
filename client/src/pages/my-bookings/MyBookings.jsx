import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchMyBookings, cancelBooking } from "./myBookingsService";
import { getApiErrorMessage } from "./myBookingsUtils";

import MyBookingsSkeleton from "./components/MyBookingsSkeleton";
import EmptyState from "./components/EmptyState";
import BookingCard from "./components/BookingCard";
import ReviewModal from "./components/ReviewModal";

export const MyBookings = () => {
  const nav = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadBookings = useCallback(async () => {
    try {
      setErr("");
      const items = await fetchMyBookings();
      setList(items);
    } catch (e) {
      setErr(getApiErrorMessage(e, "Không tải được danh sách đơn."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = async (booking) => {
    const id = booking?._id;
    if (!id) return;

    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (e) {
      alert(getApiErrorMessage(e, "Không thể hủy đơn"));
    }
  };

  if (loading) return <MyBookingsSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Đơn thuê</h1>

        {err && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
            {err}
          </div>
        )}

        {list.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {list.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onView={(b) => nav(`/bookings/${b._id}`)}
                onPay={(b) => nav(`/pay/${b._id}`)}
                onCancel={handleCancel}
                onReview={(b) => setSelectedBooking(b)}
              />
            ))}
          </div>
        )}

        {selectedBooking && (
          <ReviewModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onSuccess={async () => {
              await loadBookings();
              setSelectedBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyBookings;
