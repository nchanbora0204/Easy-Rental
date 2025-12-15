import { STATUS_BADGE_MAP } from "../ownerBookings.constants";

export const StatusBadge = ({ status }) => {
  const conf = STATUS_BADGE_MAP[status] || { className: "badge", label: status };
  return <span className={conf.className}>{conf.label}</span>;
};
