import { Link } from "react-router-dom";
import {
  Car,
  RotateCcw,
  BadgeX,
  Power,
  PowerOff,
  Loader2,
  Coins,
  Pencil,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export const CarsTable = ({ rows, loading, onToggle, onRemove, onRestore }) => {
  return (
    <div className="card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thông tin xe
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Biển số
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Năm
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Giá/ngày
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thống kê
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-4 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <Loader2
                    className="inline animate-spin text-blue-600 mb-2"
                    size={32}
                  />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Car size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {c.brand} {c.model}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-gray-700">
                    {c.licensePlate || "-"}
                  </td>

                  <td className="py-4 px-4 text-gray-700">{c.year || "-"}</td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      {(c.pricePerDay || 0).toLocaleString()} đ
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Coins size={16} className="text-amber-500" />
                      <span className="text-gray-700">
                        {c.stats?.orders || 0} đơn /{" "}
                        {(c.stats?.revenue || 0).toLocaleString()} đ
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <StatusBadge removed={c.removed} isAvailable={c.isAvailable} />
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {!c.removed && (
                        <>
                          <Link
                            to={`/owner/cars/${c._id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} className="text-gray-600" />
                          </Link>

                          <button
                            onClick={() => onToggle(c._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={c.isAvailable ? "Tạm ngừng" : "Mở lại"}
                          >
                            {c.isAvailable ? (
                              <PowerOff size={16} className="text-gray-600" />
                            ) : (
                              <Power size={16} className="text-green-600" />
                            )}
                          </button>
                        </>
                      )}

                      {c.removed ? (
                        <button
                          onClick={() => onRestore(c._id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Khôi phục"
                        >
                          <RotateCcw size={16} className="text-green-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onRemove(c._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Gỡ xe"
                        >
                          <BadgeX size={16} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <Car size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Chưa có xe nào</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Thêm xe đầu tiên để bắt đầu cho thuê
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
