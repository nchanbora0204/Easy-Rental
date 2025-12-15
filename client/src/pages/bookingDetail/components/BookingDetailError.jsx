import { XCircle } from "lucide-react";

export const BookingDetailError = ({ err, onBack }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="section py-10">
        <div className="card bg-red-50 border-red-200">
          <div className="card-body text-center">
            <XCircle className="mx-auto text-danger mb-3" size={46} />
            <p className="text-danger font-medium">{err}</p>
            <button type="button" onClick={onBack} className="btn btn-primary mt-4">
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
