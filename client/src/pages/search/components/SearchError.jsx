import { AlertCircle } from "lucide-react";

export const SearchError = ({ err }) => {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="card-body flex items-center gap-3 text-danger">
        <AlertCircle size={20} />
        <span className="text-sm">{err}</span>
      </div>
    </div>
  );
};
