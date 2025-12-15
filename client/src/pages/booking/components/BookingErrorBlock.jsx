import { AlertCircle } from "lucide-react";

export const BookingErrorBlock = ({ err, compact = false }) => {
  return (
    <div className={compact ? "" : "section py-8"}>
      <div className="card bg-red-50 border-red-200">
        <div className="card-body flex items-center gap-3 text-danger">
          <AlertCircle size={compact ? 20 : 24} />
          <span>{err}</span>
        </div>
      </div>
    </div>
  );
};
