import { fmtDateTime, fmtVND } from "../utils";

export const BookingDetailModal = ({ open, detail, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-[16px] shadow-xl overflow-hidden">
          <div className="px-5 py-3 border-b font-semibold">Chi tiết đơn hàng</div>

          <div className="p-5 space-y-3 text-sm">
            <div>
              <b>Mã đơn:</b> {detail?._id}
            </div>
            <div>
              <b>Xe:</b> {detail?.car?.brand} {detail?.car?.model} •{" "}
              {detail?.car?.year}
            </div>
            <div>
              <b>Người thuê:</b> {detail?.user?.name || detail?.user?.email}
            </div>
            <div>
              <b>Chủ xe:</b> {detail?.owner?.name || detail?.owner?.email}
            </div>
            <div>
              <b>Ngày:</b> {fmtDateTime(detail?.pickupDate)} →{" "}
              {fmtDateTime(detail?.returnDate)}
            </div>
            <div>
              <b>Trạng thái:</b> {detail?.status}
            </div>
            <div>
              <b>Tổng tiền:</b> {fmtVND(detail?.total)} đ
            </div>

            {detail?.payment && (
              <div className="mt-2 p-3 rounded border bg-[var(--color-bg)]">
                <div className="font-medium mb-1">Thanh toán</div>
                <div>Trạng thái: {detail.payment.status}</div>
                <div>Mã: {detail.payment._id}</div>
                <div>Phương thức: {detail.payment.method}</div>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t text-right">
            <button className="btn btn-primary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
