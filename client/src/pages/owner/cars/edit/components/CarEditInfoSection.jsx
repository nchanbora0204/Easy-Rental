import { Car, Calendar, Users } from "lucide-react";

export const CarEditInfoSection = ({ f, setF }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Car size={20} className="text-blue-600" />
        Thông tin xe
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hãng xe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={f.brand}
            onChange={(e) => setF({ ...f, brand: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mẫu xe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={f.model}
            onChange={(e) => setF({ ...f, model: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-1 text-gray-500" />
            Năm sản xuất <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={f.year}
            onChange={(e) => setF({ ...f, year: e.target.value })}
            min="1990"
            max="2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users size={16} className="inline mr-1 text-gray-500" />
            Số chỗ ngồi <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={f.seatingCapacity}
            onChange={(e) => setF({ ...f, seatingCapacity: e.target.value })}
            min="2"
            max="16"
            required
          />
        </div>
      </div>
    </div>
  );
};
