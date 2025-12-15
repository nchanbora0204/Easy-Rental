export const DashboardHeader = ({ rangeDays, onChangeRange }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-500 mt-1">Theo dõi hiệu suất kinh doanh</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Khoảng:</span>
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {[30, 90, 180].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => onChangeRange(days)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                rangeDays === days
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {Math.round(days / 30)} tháng
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
