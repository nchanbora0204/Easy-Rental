import { Loader2, AlertCircle } from "lucide-react";
import { BookingRow } from "./BookingRow";

export const BookingsTable = ({ rows, loading, msg, paging, actionKey, onChangeStatus }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Tổng cộng{" "}
          <span className="font-semibold text-gray-800">{paging.total}</span> đơn
        </div>
        <div className="text-xs text-gray-400">
          Trang {paging.page}/{paging.pages || 1}
        </div>
      </div>

      {msg && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Xe</th>
              <th className="px-4 py-2 text-left">Khách hàng</th>
              <th className="px-4 py-2 text-left">Thời gian</th>
              <th className="px-4 py-2 text-right">Tổng tiền</th>
              <th className="px-4 py-2 text-center">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Chưa có đơn nào
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <BookingRow
                  key={b._id}
                  booking={b}
                  actionKey={actionKey}
                  onChangeStatus={onChangeStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
