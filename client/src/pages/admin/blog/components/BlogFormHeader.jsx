import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const BlogFormHeader = ({ pageTitle }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            to="/admin/blog"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft size={14} />
            Quay lại danh sách
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Điền nội dung bài viết để hiển thị trên trang blog.
        </p>
      </div>
    </div>
  );
};
