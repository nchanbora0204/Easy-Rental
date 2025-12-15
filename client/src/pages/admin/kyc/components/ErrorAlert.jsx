import { X } from "lucide-react";

export const ErrorAlert = ({ err, onClose }) => {
  if (!err) return null;

  return (
    <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
        <p className="text-red-700 text-sm mt-1">{err}</p>
      </div>
      <button onClick={onClose} className="text-red-400 hover:text-red-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
