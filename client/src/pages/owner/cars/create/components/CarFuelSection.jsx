export const CarFuelSection = ({ f, setF }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tiêu thụ nhiên liệu (L/100km)
      </label>
      <input
        type="text"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Ví dụ: 9L/100km"
        value={f.fuelConsumption}
        onChange={(e) => setF({ ...f, fuelConsumption: e.target.value })}
      />
      <p className="text-xs text-gray-500 mt-1">
        Bạn có thể để trống nếu không chắc thông số.
      </p>
    </div>
  );
};
