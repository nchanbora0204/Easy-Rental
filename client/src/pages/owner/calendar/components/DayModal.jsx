import React, { useMemo } from "react";
import { Lock, Unlock, X, Car, User as UserIcon } from "lucide-react";
import StatusBadge from "./StatusBadge";

export const DayModal = ({
  selected,
  onClose,
  blockReason,
  setBlockReason,
  onToggleBlock,
  blockBusy,
}) => {
  const dateLabel = useMemo(() => {
    const d = selected?.day;
    if (!d) return "";
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selected]);

  const hasBlock = !!selected?.block;
  const hasBookings = (selected?.bookings || []).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="font-semibold text-gray-800 capitalize">
              {dateLabel}
            </h3>
            <div className="mt-1">
              {hasBlock ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                  <Lock size={14} />
                  Đã chặn
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <Unlock size={14} />
                  Đang mở
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Lý do chặn */}
          {hasBlock && selected?.block?.reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong>Lý do chặn:</strong> {selected.block.reason}
              </p>
            </div>
          )}

          {/* Bookings */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
              <span>Đơn thuê trong ngày</span>
              <span className="text-sm font-normal text-gray-500">
                {(selected?.bookings || []).length} đơn
              </span>
            </h4>

            {hasBookings ? (
              <div className="space-y-3">
                {(selected?.bookings || []).map((b) => (
                  <div
                    key={b._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Car size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-800">
                          {b?.car?.brand} {b?.car?.model}
                        </span>
                      </div>
                      <StatusBadge status={b?.status} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <UserIcon size={16} />
                        <span>
                          {b?.user?.name || b?.user?.email || "Khách"}
                        </span>
                      </div>

                      <div className="text-xs bg-gray-50 rounded p-2">
                        <div>
                          <strong>Nhận:</strong>{" "}
                          {b?.pickupDate
                            ? new Date(b.pickupDate).toLocaleString("vi-VN")
                            : "-"}
                        </div>
                        <div>
                          <strong>Trả:</strong>{" "}
                          {b?.returnDate
                            ? new Date(b.returnDate).toLocaleString("vi-VN")
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                Không có đơn thuê nào
              </div>
            )}
          </div>

          {/* Block form */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do chặn ngày (tùy chọn)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
              placeholder="Ví dụ: Bảo dưỡng xe, đi công tác..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onToggleBlock}
            disabled={blockBusy}
            className={`
              w-full py-3 rounded-lg font-medium transition-colors
              ${
                hasBlock
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } 
              text-white
              ${blockBusy ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {blockBusy
              ? "Đang xử lý..."
              : hasBlock
              ? "Mở lại ngày cho thuê"
              : "Chặn ngày này"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            {hasBlock
              ? "Mở lại để cho phép khách đặt xe vào ngày này"
              : "Chặn ngày sẽ không cho phép đơn mới, đơn cũ vẫn giữ nguyên"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DayModal;
