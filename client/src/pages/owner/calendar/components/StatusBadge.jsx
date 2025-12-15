import React from "react";

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    ongoing: { label: "Đang thuê", color: "bg-green-100 text-green-700" },
    completed: { label: "Hoàn thành", color: "bg-gray-100 text-gray-700" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    cancelled_timeout: { label: "Hết hạn", color: "bg-gray-100 text-gray-600" },
  };

  const config = statusConfig[status] || {
    label: status || "-",
    color: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
