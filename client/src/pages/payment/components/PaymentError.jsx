import { AlertCircle } from "lucide-react";

export const PaymentError = ({ err }) => {
  return (
    <div className="section py-8">
      <div className="card bg-red-50 border-red-200">
        <div className="card-body flex items-center gap-3 text-danger">
          <AlertCircle size={22} />
          <span>{err}</span>
        </div>
      </div>
    </div>
  );
};
