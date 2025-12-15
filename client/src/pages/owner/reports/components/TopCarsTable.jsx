import { fmtVND } from "../ownerReports.utils";

export const TopCarsTable = ({ show, topCars }) => {
  if (!show) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">Top xe theo doanh thu</h2>
          <p className="text-xs text-gray-500 mt-1">
            Dựa trên tổng doanh thu các đơn đã thanh toán
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Xe</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Số đơn</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Doanh thu</th>
            </tr>
          </thead>

          <tbody>
            {topCars.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}

            {topCars.map((c, idx) => (
              <tr
                key={c.carId || `${c.brand}-${c.model}-${idx}`}
                className="border-t"
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">
                  {c.brand} {c.model}{" "}
                  {c.year ? <span className="text-gray-400">({c.year})</span> : null}
                </td>
                <td className="px-4 py-3">{c.orders ?? c.count ?? 0}</td>
                <td className="px-4 py-3 font-semibold">
                  {fmtVND(c.revenue || 0)}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
