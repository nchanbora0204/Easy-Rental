import { Check } from "lucide-react";

export const EmptyState = ({ onRefresh }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Check className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Không có hồ sơ chờ duyệt
    </h3>
    <p className="text-gray-500">
      Tất cả hồ sơ đã được xử lý hoặc chưa có hồ sơ mới.
    </p>
    <button
      onClick={onRefresh}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Làm mới
    </button>
  </div>
);
