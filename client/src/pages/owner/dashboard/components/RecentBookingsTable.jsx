import { Calendar } from "lucide-react";
import { STATUS_MAP } from "../dashboardUtils";

export const RecentBookingsTable = ({ bookings = [] }) => {
  const list = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-gray-600" size={20} />
        <h2 className="font-semibold text-gray-800">Đơn gần đây</h2>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chưa có đơn nào</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2 px-3 text-gray-600">Mã đơn</th>
                <th className="py-2 px-3 text-gray-600">Khách</th>
                <th className="py-2 px-3 text-gray-600">Xe</th>
                <th className="py-2 px-3 text-gray-600">Thời gian</th>
                <th className="py-2 px-3 text-gray-600">Tổng tiền</th>
                <th className="py-2 px-3 text-gray-600">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-3 text-xs text-gray-500">
                    {b.code || b._id?.slice(-6)}
                  </td>
                  <td className="py-3 px-3 text-gray-700">
                    {b.user?.name || b.user?.email}
                  </td>
                  <td className="py-3 px-3 text-gray-700">
                    {b.car?.brand} {b.car?.model}
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-500">
                    {new Date(b.pickupDate).toLocaleDateString()} -{" "}
                    {new Date(b.returnDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-gray-700">
                    {Number(b.total || 0).toLocaleString()}đ
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        STATUS_MAP[b.status]?.color || "bg-gray-100"
                      }`}
                    >
                      {STATUS_MAP[b.status]?.label || b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
