import { Link } from "react-router-dom";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { FadeSection } from "../../../components/common/FadeSection";
import { fmtVND, formatLocation, getSegmentBadge } from "../homeUtils";

export const FeaturedCarsSection = ({
  featured,
  loading,
  error,
  onClickCar,
}) => {
  return (
    <FadeSection className="section py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Xe nổi bật</h2>
        <Link
          to="/search"
          className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
        >
          Xem thêm <ChevronRight size={16} />
        </Link>
      </div>

      {error && (
        <div className="card mb-4">
          <div className="card-body text-[var(--color-danger)] text-sm">
            {error}
          </div>
        </div>
      )}

      {loading && !featured.length && (
        <div className="text-sm text-[var(--color-muted)] mb-4">
          Đang tải danh sách xe nổi bật...
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.length ? (
          featured.map((car) => {
            const id = car._id || car.id;
            const name =
              `${car.brand || ""} ${car.model || ""}`.trim() ||
              car.name ||
              "Xe cho thuê";

            const image =
              car.images?.[0] ||
              car.image ||
              "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=500&fit=crop";

            const pricePerDay = car.pricePerDay;
            const priceText = pricePerDay
              ? `${fmtVND(pricePerDay)} ₫`
              : car.price || "";

            const loc = formatLocation(car) || car.location;
            const rating = car.avgRating ?? car.rating;
            const trips = car.tripCount ?? car.trips;

            const { label: badgeLabel, className: badgeClass } =
              getSegmentBadge(car.segment);

            const oldPrice =
              car.oldPrice != null ? `${fmtVND(car.oldPrice)} ₫` : null;

            return (
              <button
                key={id || name}
                className="card group hover:shadow-xl transition-all cursor-pointer text-left"
                onClick={() => onClickCar(id, name, car)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold shadow-sm ${badgeClass}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>
                  {rating ? (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-300">
                        <Star
                          size={14}
                          className="text-yellow-300"
                          fill="currentColor"
                        />{" "}
                        {rating}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="card-body">
                  <h3 className="font-semibold text-lg">{name}</h3>
                  {loc && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
                      <MapPin size={14} />
                      {loc}
                    </div>
                  )}
                  {(rating || trips) && (
                    <div className="flex items-center gap-3 mb-3">
                      {rating && (
                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="text-yellow-400"
                            fill="currentColor"
                          />
                          <span className="text-sm font-medium">
                            {rating}
                          </span>
                        </div>
                      )}
                      {trips ? (
                        <span className="text-[var(--color-muted)] text-sm">
                          Đã {trips} chuyến
                        </span>
                      ) : null}
                    </div>
                  )}
                  <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">{priceText}</span>
                      {oldPrice && (
                        <span className="text-sm text-[var(--color-muted)] line-through">
                          {oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="col-span-full text-center text-sm text-[var(--color-muted)]">
            Hiện chưa có xe nào đang cho thuê.
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link to="/search" className="btn btn-outline">
          Xem thêm xe đang cho thuê
        </Link>
      </div>
    </FadeSection>
  );
};
