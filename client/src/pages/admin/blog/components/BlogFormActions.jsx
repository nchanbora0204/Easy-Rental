import { Save } from "lucide-react";

export const BlogFormActions = ({ saving, isEdit, onCancel }) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
        onClick={onCancel}
        disabled={saving}
      >
        Hủy
      </button>
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
        disabled={saving}
      >
        <Save size={16} />
        {saving ? "Đang lưu..." : isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
      </button>
    </div>
  );
};
