import { Calendar, DollarSign, MapPin, Car } from "lucide-react";

export const BookingMainCard = ({ carName, loc, pickupText, returnText, totalText }) => {
  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-[var(--color-primary-600)] text-white">
        <div className="p-6 flex items-center gap-3">
          <Car size={28} />
          <div>
            <h2 className="text-xl font-bold">{carName}</h2>
            <p className="text-white/80 text-sm">{loc || "Không rõ địa điểm"}</p>
          </div>
        </div>
      </div>

      <div className="card-body space-y-3">
        <InfoRow
          icon={<Calendar size={18} className="text-primary mt-0.5" />}
          label="Thời gian thuê"
          value={
            pickupText && returnText
              ? (
                <>
                  {pickupText}
                  <span className="mx-2 opacity-50">→</span>
                  {returnText}
                </>
              )
              : "Đang cập nhật"
          }
        />

        {loc ? (
          <InfoRow
            icon={<MapPin size={18} className="text-primary mt-0.5" />}
            label="Địa điểm"
            value={loc}
          />
        ) : null}

        <div className="p-4 rounded-[var(--radius-lg)] bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <DollarSign size={18} className="text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[var(--color-muted)] mb-1">
                Tổng chi phí
              </div>
              <div className="text-2xl font-bold text-primary">{totalText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] hover:bg-[var(--color-surface)]/70 transition-colors">
      {icon}
      <div className="flex-1">
        <div className="text-sm text-[var(--color-muted)] mb-1">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
};
