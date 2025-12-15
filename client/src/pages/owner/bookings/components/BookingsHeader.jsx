import { RefreshCcw, Download } from "lucide-react";

export const BookingsHeader = ({ onReset, onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-1">
          Xem và xử lý các đơn thuê xe của bạn
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
          <RefreshCcw className="w-4 h-4 mr-1" />
          Làm mới
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-1" />
          Xuất Excel
        </button>
      </div>
    </div>
  );
};
