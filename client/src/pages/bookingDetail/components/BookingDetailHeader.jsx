import { ArrowLeft } from "lucide-react";

export const BookingDetailHeader = ({ bookingId, onBack }) => {
  const shortId = bookingId?.slice?.(-6)?.toUpperCase?.() || "";

  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="section py-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] mb-3"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <h1 className="text-3xl font-bold">
          Chi tiết đơn #{shortId}
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          Theo dõi trạng thái và thông tin đơn thuê xe
        </p>
      </div>
    </div>
  );
};
