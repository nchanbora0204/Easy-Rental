import { Link } from "react-router-dom";
import { MapPin, Users, Gauge, Star, TrendingUp } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const CarGridCard = ({ car }) => {
  const id = car?._id || car?.id;
  const name = `${car?.brand || ""} ${car?.model || ""}`.trim() || "Xe tự lái";
  const image =
    car?.images?.[0] ||
    car?.image ||
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";
  const city = car?.location?.city || car?.city || "";
  const district = car?.location?.district || "";
  const seats = car?.seatingCapacity || car?.seats || "";
  const transmission =
    car?.transmission === "automatic"
      ? "Tự động"
      : car?.transmission
      ? "Số sàn"
      : "";

  return (
    <Link
      to={`/cars/${id}`}
      state={{ car }}
      className="card group hover:shadow-xl transition-all"
    >
      <div className="relative overflow-hidden rounded-t-[var(--radius-lg)]">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {car?.featured ? (
          <div className="absolute top-3 left-3">
            <span className="badge badge-warning flex items-center gap-1">
              <TrendingUp size={12} />
              Nổi bật
            </span>
          </div>
        ) : null}

        {car?.avgRating ? (
          <div className="absolute top-3 right-3">
            <span className="badge badge-success flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              {car.avgRating}
            </span>
          </div>
        ) : null}
      </div>

      <div className="card-body">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>

        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-3">
          <MapPin size={14} />
          {city}
          {district ? ` • ${district}` : ""}
        </div>

        <div className="flex items-center gap-3 text-sm text-[var(--color-muted)] mb-3">
          {seats ? (
            <span className="flex items-center gap-1">
              <Users size={14} />
              {seats} chỗ
            </span>
          ) : null}

          {seats && transmission ? <span>•</span> : null}

          {transmission ? (
            <span className="flex items-center gap-1">
              <Gauge size={14} />
              {transmission}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <div>
            <span className="text-xl font-bold text-primary">
              {fmtVND(car?.pricePerDay)}đ
            </span>
            <span className="text-sm text-[var(--color-muted)]">/ngày</span>
          </div>

          <span className="btn btn-primary pointer-events-none">Thuê ngay</span>
        </div>
      </div>
    </Link>
  );
};
