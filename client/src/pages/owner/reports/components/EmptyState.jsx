export const EmptyState = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
      Chưa có dữ liệu để thống kê. Hãy chờ khách đặt xe nhé!
    </div>
  );
};
