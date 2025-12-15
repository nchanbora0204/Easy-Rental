import { CheckCircle2, XCircle, Clock } from "lucide-react";

export const StatusCell = ({ status }) => {
  if (status === "completed") {
    return (
      <span className="text-success inline-flex items-center gap-1">
        <CheckCircle2 size={14} /> Hoàn tất
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className="text-danger inline-flex items-center gap-1">
        <XCircle size={14} /> Hủy
      </span>
    );
  }

  return (
    <span className="text-[var(--color-muted)] inline-flex items-center gap-1">
      <Clock size={14} /> {status}
    </span>
  );
};
