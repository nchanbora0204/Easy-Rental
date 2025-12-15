import { Plus } from "lucide-react";

export const BlogHeader = ({ onNew }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý bài viết Blog
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Tạo, chỉnh sửa và quản lý nội dung blog hiển thị cho khách hàng.
        </p>
      </div>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
      >
        <Plus size={16} />
        Viết bài mới
      </button>
    </div>
  );
};
