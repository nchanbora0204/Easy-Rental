import { MapPin } from "lucide-react";

export const CarLocationSection = ({ location, setLocation }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-blue-600" />
        Vị trí xe
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thành phố / Tỉnh <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Hồ Chí Minh"
            value={location.city}
            onChange={(e) => setLocation({ ...location, city: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quận / Huyện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Quận 12"
            value={location.district}
            onChange={(e) =>
              setLocation({ ...location, district: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ chi tiết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="An Sương / 123 QL1A..."
            value={location.address}
            onChange={(e) =>
              setLocation({ ...location, address: e.target.value })
            }
            required
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Ví dụ: <strong>Hồ Chí Minh – Quận 12 – An Sương</strong>
      </p>
    </div>
  );
};
