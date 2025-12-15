import { useState } from "react";
import { Star, X } from "lucide-react";
import { createReviewForBooking } from "../myBookingsService";
import { getApiErrorMessage } from "../myBookingsUtils";

export const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await createReviewForBooking({ booking, rating, comment });
      onSuccess?.();
    } catch (e) {
      alert(getApiErrorMessage(e, "Không gửi được đánh giá"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Đánh giá chuyến đi</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
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
              type="button"
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
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
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

export default ReviewModal;
