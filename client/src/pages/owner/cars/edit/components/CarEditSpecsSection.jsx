import { Settings, DollarSign } from "lucide-react";

export const CarEditSpecsSection = ({ f, setF }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Settings size={20} className="text-blue-600" />
        Thông số kỹ thuật
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại hộp số <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            value={f.transmission}
            onChange={(e) => setF({ ...f, transmission: e.target.value })}
          >
            <option value="automatic">Số tự động</option>
            <option value="manual">Số sàn</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign size={16} className="inline mr-1 text-gray-500" />
            Giá thuê (VNĐ/ngày) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={f.pricePerDay}
            onChange={(e) => setF({ ...f, pricePerDay: e.target.value })}
            min="0"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Nhập giá thuê mỗi ngày (không cần dấu phẩy)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu hao nhiên liệu
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ví dụ: 9L/100km"
            value={f.fuelConsumption}
            onChange={(e) => setF({ ...f, fuelConsumption: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Thông tin này sẽ hiển thị ở mục “Thông số kỹ thuật” trên trang xe.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hạng xe
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            value={f.segment}
            onChange={(e) => setF((prev) => ({ ...prev, segment: e.target.value }))}
          >
            <option value="standard">Tiêu chuẩn</option>
            <option value="premium">Cao cấp</option>
            <option value="luxury">Xe sang</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Dùng để phân loại xe trên trang chủ và tìm kiếm.
          </p>
        </div>
      </div>
    </div>
  );
};
