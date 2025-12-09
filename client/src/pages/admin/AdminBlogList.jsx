import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import api from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "./AdminLayout";

const CATEGORY_LABELS = {
  travel: "Cẩm nang du lịch",
  tips: "Kinh nghiệm thuê xe",
  cars: "Đánh giá & dòng xe",
  news: "Tin tức & Ưu đãi",
  stories: "Câu chuyện khách hàng",
};

const formatDate = (str) => {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("vi-VN");
  } catch {
    return str;
  }
};

export default function AdminBlogList() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = Boolean(user && user.role === "admin");

  useEffect(() => {
    let alive = true;
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/blog", {
          params: {
            limit: 100,
            sort: "recent",
            includeUnpublished: "true",
          },
        });

        const list =
          data?.data?.items ?? data?.data ?? data?.items ?? data ?? [];

        if (alive) setPosts(list);
      } catch (e) {
        if (alive) {
          console.error("admin blog list error", e);
          setError(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được danh sách bài viết."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isAdmin]);

  const filtered = useMemo(() => {
    return (posts || []).filter((p) => {
      const cat = p.category || "tips";
      if (category !== "all" && cat !== category) return false;

      if (!q.trim()) return true;
      const search = q.toLowerCase();
      const title = (p.title || "").toLowerCase();
      const excerpt = (p.excerpt || "").toLowerCase();
      const tags = p.tags?.map((t) => (t || "").toLowerCase()) || [];

      return (
        title.includes(search) ||
        excerpt.includes(search) ||
        tags.some((t) => t.includes(search))
      );
    });
  }, [posts, category, q]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    try {
      await api.delete(`/blog/${id}`);
      setPosts((prev) => prev.filter((p) => String(p._id) !== String(id)));
    } catch (e) {
      console.error("delete blog error", e);
      alert(
        e?.response?.data?.message || e.message || "Xóa bài viết thất bại."
      );
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await api.patch(`/blog/${id}/publish`);
      const updated = data?.data;
      if (!updated) return;

      setPosts((prev) =>
        prev.map((p) =>
          String(p._id) === String(id) ? { ...p, ...updated } : p
        )
      );
    } catch (e) {
      console.error("toggle publish error", e);
      alert(
        e?.response?.data?.message ||
          e.message ||
          "Không thể thay đổi trạng thái hiển thị."
      );
    }
  };
  if (!user || user.role !== "admin") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-sm">
            Bạn không có quyền truy cập trang này (chỉ admin).
          </div>
        </div>
      </AdminLayout>
    );
  }
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
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
            onClick={() => nav("/admin/blog/new")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <Plus size={16} />
            Viết bài mới
          </button>
        </div>

        {/* Lỗi */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Bộ lọc */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm theo tiêu đề, tóm tắt, tag..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="travel">Cẩm nang du lịch</option>
              <option value="tips">Kinh nghiệm thuê xe</option>
              <option value="cars">Đánh giá & dòng xe</option>
              <option value="news">Tin tức & Ưu đãi</option>
              <option value="stories">Câu chuyện khách hàng</option>
            </select>
          </div>
        </div>

        {/* Bảng */}
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
              {!filtered.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Không có bài viết nào.
                  </td>
                </tr>
              )}

              {filtered.map((p) => (
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
                        <span className="text-[11px] text-blue-600">
                          Nổi bật
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {p.meta?.views ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(p.publishedAt || p.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        title={
                          p.isPublished
                            ? "Ẩn khỏi blog"
                            : "Bật hiển thị trên blog"
                        }
                        onClick={() => handleTogglePublish(p._id)}
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
                        onClick={() => nav(`/admin/blog/${p._id}/edit`)}
                      >
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button
                        className="p-2 rounded-lg border border-red-200 hover:bg-red-50"
                        title="Xóa bài viết"
                        onClick={() => handleDelete(p._id)}
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
      </div>
    </AdminLayout>
  );
}
