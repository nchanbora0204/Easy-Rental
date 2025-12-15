import { Star } from "lucide-react";

export const RatingStars = ({
  rating,
  hoverRating,
  onHover,
  onLeave,
  onSelect,
  disabled,
}) => {
  return (
    <div>
      <label className="label mb-2">Đánh giá chung</label>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, idx) => {
          const v = idx + 1;
          const active = (hoverRating || rating) >= v;

          return (
            <button
              key={v}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(v)}
              onMouseEnter={() => onHover(v)}
              onMouseLeave={onLeave}
              className="p-1"
            >
              <Star
                size={32}
                className={active ? "text-yellow-400" : "text-gray-300"}
                fill={active ? "currentColor" : "none"}
              />
            </button>
          );
        })}

        <span className="text-sm text-[var(--color-muted)] ml-2">
          {rating}/5
        </span>
      </div>
    </div>
  );
};
