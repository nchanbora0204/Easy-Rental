import { Link } from "react-router-dom";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { fmtVND, formatLocation } from "../../../utils/format";

export const CarRelated = ({ related, brand }) => {
  if (!related?.length) return null;

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Xe tương tự</h2>

        {brand ? (
          <Link
            to={`/search?brand=${encodeURIComponent(brand)}`}
            className="text-primary hover:underline flex items-center gap-1 font-medium"
          >
            Xem tất cả
            <ChevronRight size={16} />
          </Link>
        ) : null}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.slice(0, 4).map((x) => {
          const id = x._id || x.id;
          const title = `${x.brand || ""} ${x.model || ""}`.trim() || x.name || "Xe tự lái";

          const img =
            x.images?.[0] ||
            x.image ||
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";

          const price = x.pricePerDay ? `${fmtVND(x.pricePerDay)}đ/ngày` : "";
          const locationText = formatLocation(x) || x.location || x.city || "";

          return (
            <Link key={id} to={`/cars/${id}`} className="card group hover:shadow-xl transition-all">
              <div className="relative overflow-hidden rounded-t-[var(--radius-lg)]">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {x.avgRating ? (
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-success flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      {x.avgRating}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="card-body">
                <h3 className="font-semibold mb-2 line-clamp-1">{title}</h3>

                {locationText ? (
                  <div className="flex items-center gap-1 text-sm text-[var(--color-muted)] mb-2">
                    <MapPin size={14} />
                    {locationText}
                  </div>
                ) : null}

                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                  <span className="text-lg font-bold text-primary">{price}</span>
                  <ChevronRight
                    size={18}
                    className="text-[var(--color-muted)] group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
