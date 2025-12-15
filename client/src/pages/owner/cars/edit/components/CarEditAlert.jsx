import { AlertCircle, Check } from "lucide-react";

export const CarEditAlert = ({ error, msg }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle
          className="text-red-600 flex-shrink-0 mt-0.5"
          size={20}
        />
        <span className="text-sm text-red-700">{error}</span>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
        <span className="text-sm text-green-700">{msg}</span>
      </div>
    );
  }

  return null;
};
