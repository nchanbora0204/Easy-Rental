export const statusBadgeClass = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export const fmtVND = (n) =>
  `${Number(n || 0).toLocaleString("vi-VN")}đ`;
