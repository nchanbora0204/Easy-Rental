import { Calendar, Eye, Loader2 } from "lucide-react";
import { fmtDate, fmtVND } from "../utils";
import { StatusCell } from "./StatusCell";

export const BookingsTable = ({ rows, loading, onView }) => {
  return (
    <div className="card">
      <div className="card-body overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-2">Mã đơn</th>
              <th className="py-3 px-2">Xe</th>
              <th className="py-3 px-2">Người thuê</th>
              <th className="py-3 px-2">Chủ xe</th>
              <th className="py-3 px-2">Đón → Trả</th>
              <th className="py-3 px-2">Tổng tiền</th>
              <th className="py-3 px-2">Trạng thái</th>
              <th className="py-3 px-2 text-right">Xem</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-6 text-center">
                  <Loader2 className="inline animate-spin" /> Đang tải…
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="py-3 px-2">{b._id}</td>
                  <td className="py-3 px-2">
                    {b.car?.brand} {b.car?.model}
                  </td>
                  <td className="py-3 px-2">{b.user?.name || b.user?.email}</td>
                  <td className="py-3 px-2">
                    {b.owner?.name || b.owner?.email}
                  </td>
                  <td className="py-3 px-2 text-xs flex items-center gap-2">
                    <Calendar size={14} /> {fmtDate(b.pickupDate)} →{" "}
                    {fmtDate(b.returnDate)}
                  </td>
                  <td className="py-3 px-2">{fmtVND(b.total)} đ</td>
                  <td className="py-3 px-2">
                    <StatusCell status={b.status} />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      type="button"
                      className="btn btn-outline inline-flex items-center gap-1"
                      onClick={() => onView(b._id)}
                    >
                      <Eye size={16} /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
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
