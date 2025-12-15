import api from "../../lib/axios";

export const fetchMyBookings = async () => {
  const { data } = await api.get("/bookings/me");
  return data?.data || [];
};

export const cancelBooking = async (id) => {
  await api.patch(`/bookings/${id}/cancel`);
};

export const createReviewForBooking = async ({ booking, rating, comment }) => {
  // gửi “dư thừa” cả bookingId/booking/car để tương thích nhiều backend
  const bookingId = booking?._id;
  const car = booking?.car?._id || booking?.car;

  const payload = {
    bookingId,
    booking: bookingId,
    car,
    rating,
    comment,
  };

  await api.post("/reviews", payload);
};
