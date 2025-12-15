import { Link } from "react-router-dom";
import { RatingStars } from "./RatingStars";

export const ReviewForm = ({
  isReadOnly,
  rating,
  hoverRating,
  comment,
  submitting,
  onRatingSelect,
  onRatingHover,
  onRatingLeave,
  onCommentChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <RatingStars
        rating={rating}
        hoverRating={hoverRating}
        onHover={isReadOnly ? () => {} : onRatingHover}
        onLeave={isReadOnly ? () => {} : onRatingLeave}
        onSelect={isReadOnly ? () => {} : onRatingSelect}
        disabled={isReadOnly}
      />

      <div>
        <label className="label mb-2">Nhận xét chi tiết</label>
        <textarea
          className="input min-h-[120px] resize-none"
          placeholder="Chia sẻ trải nghiệm của bạn: chất lượng xe, thái độ chủ xe, quá trình nhận/trả xe..."
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={isReadOnly}
        />
      </div>

      {!isReadOnly ? (
        <div className="flex items-center justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Link to="/my-bookings" className="btn btn-primary">
            Quay lại đơn của tôi
          </Link>
        </div>
      )}
    </form>
  );
};
