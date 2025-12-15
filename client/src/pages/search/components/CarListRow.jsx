import { Link } from "react-router-dom";
import { MapPin, Users, Gauge, Star } from "lucide-react";
import { fmtVND } from "../../../utils/format";

export const CarListRow = ({ car }) => {
  const id = car?._id || car?.id;
  const name = `${car?.brand || ""} ${car?.model || ""}`.trim() || "Xe tự lái";
  const image =
    car?.images?.[0] ||
    car?.image ||
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800";
  const city = car?.location?.city || car?.city || "";
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
      className="card hover:shadow-xl transition-all"
    >
      <div className="card-body">
        <div className="flex gap-4">
          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)]">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between mb-2 gap-3">
                <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>

                {car?.avgRating ? (
                  <span className="badge badge-success flex items-center gap-1 flex-shrink-0">
                    <Star size={12} fill="currentColor" />
                    {car.avgRating}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)] mb-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {city}
                </span>
                {seats ? (
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {seats} chỗ
                  </span>
                ) : null}
                {transmission ? (
                  <span className="flex items-center gap-1">
                    <Gauge size={14} />
                    {transmission}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {fmtVND(car?.pricePerDay)}đ
                </span>
                <span className="text-sm text-[var(--color-muted)]">/ngày</span>
              </div>
              <span className="btn btn-primary pointer-events-none">
                Thuê ngay
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
