import { Car } from "lucide-react";

export const TopCarsCard = ({ topCars = [] }) => {
  const list = Array.isArray(topCars) ? topCars : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Car className="text-gray-600" size={20} />
        <h2 className="font-semibold text-gray-800">Top xe</h2>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chưa có dữ liệu</div>
      ) : (
        <div className="space-y-3">
          {list.slice(0, 5).map((c, idx) => (
            <div key={c.carId || idx} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {c.brand} {c.model}
                </p>
                <p className="text-xs text-gray-500">
                  {c.orders} đơn · {Number(c.revenue || 0).toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
