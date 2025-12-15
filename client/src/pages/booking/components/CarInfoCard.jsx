import { Calendar, CheckCircle2, Clock, MapPin } from "lucide-react";

export const CarInfoCard = ({
  name,
  image,
  loc,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  days,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-primary" />
          Thông tin xe
        </h2>

        <div className="flex gap-4">
          <div className="w-32 h-24 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{name}</h3>

            <div className="space-y-1 text-sm text-[var(--color-muted)]">
              {loc ? (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {loc}
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {pickupDate || "__/__/____"} {pickupTime || "00:00"} →{" "}
                {returnDate || "__/__/____"} {returnTime || "00:00"}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                {days} ngày thuê
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
