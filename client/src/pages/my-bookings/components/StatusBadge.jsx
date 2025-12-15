import { STATUS_META } from "../myBookingsConstants";

export const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || {
    label: status || "-",
    badgeClass: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${meta.badgeClass}`}>
      {meta.label}
    </span>
  );
};

export default StatusBadge;
