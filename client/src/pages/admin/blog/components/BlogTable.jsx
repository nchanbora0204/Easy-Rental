import { Link } from "react-router-dom";
import { Edit, Eye, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { CATEGORY_LABELS } from "../constants";
import { formatDate } from "../utils";

export const BlogTable = ({
  rows,
  onTogglePublish,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">
              Tiêu đề
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Lượt xem
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ngày
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {!rows.length && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Không có bài viết nào.
              </td>
            </tr>
          )}

          {rows.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 line-clamp-2">
                    {p.title}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {p.slug}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-700">
                {CATEGORY_LABELS[p.category] || "—"}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      p.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.isPublished ? "Đang hiển thị" : "Đã ẩn"}
                  </span>
                  {p.highlight && (
                    <span className="text-[11px] text-blue-600">Nổi bật</span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3 text-gray-700">{p.meta?.views ?? 0}</td>

              <td className="px-4 py-3 text-gray-700">
                {formatDate(p.publishedAt || p.createdAt)}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    title={
                      p.isPublished ? "Ẩn khỏi blog" : "Bật hiển thị trên blog"
                    }
                    onClick={() => onTogglePublish(p._id)}
                  >
                    {p.isPublished ? (
                      <ToggleRight size={18} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={18} className="text-gray-400" />
                    )}
                  </button>

                  <Link
                    to={`/blog/${p.slug || p._id}`}
                    target="_blank"
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    title="Xem trên trang blog"
                  >
                    <Eye size={16} className="text-gray-600" />
                  </Link>

                  <button
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(p._id)}
                  >
                    <Edit size={16} className="text-blue-600" />
                  </button>

                  <button
                    className="p-2 rounded-lg border border-red-200 hover:bg-red-50"
                    title="Xóa bài viết"
                    onClick={() => onDelete(p._id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
