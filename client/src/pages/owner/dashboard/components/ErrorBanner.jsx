import { AlertCircle } from "lucide-react";

export const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
};
