export const StatusBadge = ({ removed, isAvailable }) => {
  if (removed)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Đã gỡ
      </span>
    );

  if (isAvailable)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Đang cho thuê
      </span>
    );

  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      Tạm ngừng
    </span>
  );
};
