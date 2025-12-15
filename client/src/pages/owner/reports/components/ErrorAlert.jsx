import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-sm text-red-700">
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
};
