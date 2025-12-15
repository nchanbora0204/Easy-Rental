import { Check } from "lucide-react";

export const CarCreateActions = ({ loading, onSubmit }) => {
  return (
    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
      <button
        type="submit"
        disabled={loading}
        onClick={onSubmit}
        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Check size={20} />
            Thêm xe mới
          </>
        )}
      </button>

      <button
        type="button"
        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Hủy
      </button>
    </div>
  );
};
