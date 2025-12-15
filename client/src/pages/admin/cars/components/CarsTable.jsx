import { Car, UserRound, BadgeX, RotateCcw, Loader2 } from "lucide-react";
import { fmtPriceVND, isCarRemoved } from "../utils";

export const CarsTable = ({ rows, loading, onRemove, onRestore }) => {
  return (
    <div className="card">
      <div className="card-body overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-2">Xe</th>
              <th className="py-3 px-2">Chủ xe</th>
              <th className="py-3 px-2">Năm</th>
              <th className="py-3 px-2">Giá/ngày</th>
              <th className="py-3 px-2">Trạng thái</th>
              <th className="py-3 px-2 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  <Loader2 className="inline animate-spin" /> Đang tải…
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((c) => {
                const removed = isCarRemoved(c);

                return (
                  <tr key={c._id} className="border-b last:border-0">
                    <td className="py-3 px-2 flex items-center gap-2">
                      <Car size={16} /> {c.brand} {c.model}
                    </td>

                    <td className="py-3 px-2 flex items-center gap-2">
                      <UserRound size={16} /> {c.owner?.name || c.owner?.email}
                    </td>

                    <td className="py-3 px-2">{c.year}</td>

                    <td className="py-3 px-2">
                      {fmtPriceVND(c.pricePerDay)} đ
                    </td>

                    <td className="py-3 px-2">
                      {removed ? (
                        <span className="text-danger">Đã gỡ</span>
                      ) : (
                        <span className="text-success">Đang hoạt động</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right">
                      {removed ? (
                        <button
                          type="button"
                          onClick={() => onRestore(c._id)}
                          className="btn btn-outline inline-flex items-center gap-1"
                        >
                          <RotateCcw size={16} /> Khôi phục
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRemove(c._id)}
                          className="btn btn-ghost text-danger inline-flex items-center gap-1"
                        >
                          <BadgeX size={16} /> Gỡ xe
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-center text-[var(--color-muted)]"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
