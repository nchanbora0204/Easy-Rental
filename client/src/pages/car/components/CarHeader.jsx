import { MapPin, Share2, Star, TrendingUp, Award, Heart } from "lucide-react";

export const CarHeader = ({
  name,
  loc,
  car,
  reviewCountHeader,
  isFavorite,
  onToggleFavorite,
}) => {
  const ratingValue =
    car?.avgRating && car.avgRating.toFixed ? car.avgRating.toFixed(1) : car?.avgRating;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          {car?.featured && (
            <span className="badge badge-warning flex items-center gap-1">
              <TrendingUp size={14} />
              Nổi bật
            </span>
          )}
        </div>

        {(loc || car?.avgRating || car?.trips || reviewCountHeader) && (
          <div className="flex flex-wrap items-center gap-4 text-[var(--color-muted)]">
            {loc && (
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" />
                {loc}
              </span>
            )}

            {(car?.avgRating || reviewCountHeader) && (
              <span className="flex items-center gap-1.5">
                <Star size={16} className="text-warning" fill="currentColor" />
                {car?.avgRating ? (
                  <span className="font-semibold text-[var(--color-fg)]">{ratingValue}</span>
                ) : null}
                <span className="text-sm">({reviewCountHeader} đánh giá)</span>
              </span>
            )}

            {car?.trips ? (
              <span className="flex items-center gap-1.5">
                <Award size={16} className="text-accent" />
                {car.trips} chuyến
              </span>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFavorite}
          className={`btn ${isFavorite ? "btn-primary" : "btn-ghost"}`}
          aria-label="Yêu thích"
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <button className="btn btn-ghost" aria-label="Chia sẻ">
          <Share2 size={18} />
          Chia sẻ
        </button>
      </div>
    </div>
  );
};
