import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import api from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "./AdminLayout";

const CATEGORY_OPTIONS = [
  { value: "travel", label: "Cẩm nang du lịch" },
  { value: "tips", label: "Kinh nghiệm thuê xe" },
  { value: "cars", label: "Đánh giá & dòng xe" },
  { value: "news", label: "Tin tức & Ưu đãi" },
  { value: "stories", label: "Câu chuyện khách hàng" },
];

export default function AdminBlogForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const nav = useNavigate();

  const isEdit = Boolean(id);
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    category: "tips",
    author: "",
    readTime: 5,
    tagsInput: "",
    isPublished: true,
    highlight: false,
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit || !isAdmin) {
      setLoading(false);
      return;
    }
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/blog/${id}`, {
          params: { includeUnpublished: "true" },
        });
        const p = data?.data ?? data;
        if (!p) {
          if (alive) {
            setError("Không tìm thấy bài viết.");
          }
          return;
        }

        if (alive) {
          setForm({
            title: p.title || "",
            slug: p.slug || "",
            excerpt: p.excerpt || "",
            content: p.content || "",
            thumbnail: p.thumbnail || "",
            category: p.category || "tips",
            author: p.author || "",
            readTime: p.readTime || 5,
            tagsInput: (p.tags || []).join(", "),
            isPublished: !!p.isPublished,
            highlight: !!p.highlight,
          });
        }
      } catch (e) {
        if (alive) {
          console.error("load blog detail error", e);
          setError(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được dữ liệu bài viết."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, isEdit, isAdmin]);

  const pageTitle = useMemo(
    () => (isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"),
    [isEdit]
  );

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt,
        content: form.content,
        thumbnail: form.thumbnail,
        category: form.category,
        author: form.author || undefined,
        readTime: form.readTime ? Number(form.readTime) : undefined,
        tags: form.tagsInput,
        isPublished: form.isPublished,
        highlight: form.highlight,
      };

      if (isEdit) {
        await api.put(`/blog/${id}`, payload);
      } else {
        await api.post("/blog", payload);
      }

      nav("/admin/blog");
    } catch (e) {
      console.error("save blog error", e);
      setError(
        e?.response?.data?.message ||
          e.message ||
          "Lưu bài viết thất bại. Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
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
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 p-6 space-y-6"
        >
          {loading && (
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
          )}

          {/* Tiêu đề + slug */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.title}
                onChange={handleChange("title")}
                placeholder="Ví dụ: 5 cung đường gần Sài Gòn lý tưởng cuối tuần"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (tùy chọn)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.slug}
                onChange={handleChange("slug")}
                placeholder="se-duoc-tu-dong-tao-neu-de-trong"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Nếu để trống, hệ thống sẽ tự tạo slug từ tiêu đề (không dấu).
              </p>
            </div>
          </div>

          {/* Category, readTime, author */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={handleChange("category")}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian đọc (phút)
              </label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.readTime}
                onChange={handleChange("readTime")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tác giả (tùy chọn)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.author}
                onChange={handleChange("author")}
                placeholder="EasyRental Team"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL hình đại diện (thumbnail)
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.thumbnail}
              onChange={handleChange("thumbnail")}
              placeholder="https://..."
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Có thể dùng link ảnh từ CDN/Cloudinary. Nếu để trống sẽ dùng ảnh
              mặc định.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tóm tắt (excerpt)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.excerpt}
              onChange={handleChange("excerpt")}
              placeholder="Tóm tắt 1–3 câu để hiển thị ở danh sách bài viết."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung bài viết *
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.content}
              onChange={handleChange("content")}
              placeholder={
                "Bạn có thể chia đoạn bằng 1 dòng trống.\n\nVí dụ:\nĐoạn 1...\n\nĐoạn 2..."
              }
              required
            />
          </div>

          {/* Tags + checkboxes */}
          <div className="grid md:grid-cols-[2fr_1fr] gap-4 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (cách nhau bởi dấu phẩy)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.tagsInput}
                onChange={handleChange("tagsInput")}
                placeholder="Đà Lạt, Xe 7 chỗ, Kinh nghiệm thuê xe..."
              />
            </div>
            <div className="space-y-2 mt-1">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={handleChange("isPublished")}
                />
                <span>Hiển thị trên trang blog (publish)</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.highlight}
                  onChange={handleChange("highlight")}
                />
                <span>Đánh dấu là bài viết nổi bật</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => nav("/admin/blog")}
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
              {saving
                ? "Đang lưu..."
                : isEdit
                ? "Cập nhật bài viết"
                : "Tạo bài viết"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
