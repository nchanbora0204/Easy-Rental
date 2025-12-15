import { ArrowLeft } from "lucide-react";

export const Header = ({ onBack, bookingId, carName, isReadOnly }) => {
  return (
    <>
      <button
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] mb-4"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={16} />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold mb-2">
        {isReadOnly ? "Đánh giá của bạn" : "Viết đánh giá"}
      </h1>

      <p className="text-[var(--color-muted)] mb-4">
        Đơn thuê: <strong>#{bookingId}</strong>
        {carName ? (
          <>
            {" "}
            · Xe: <strong>{carName}</strong>
          </>
        ) : null}
      </p>
    </>
  );
};
