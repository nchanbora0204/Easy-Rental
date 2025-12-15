export const BlogFormFields = ({
  form,
  onChangeField,
  categoryOptions,
  loading,
}) => {
  return (
    <>
      {loading && <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>}

      {/* Tiêu đề + slug */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề *
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={onChangeField("title")}
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
            onChange={onChangeField("slug")}
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
            onChange={onChangeField("category")}
          >
            {categoryOptions.map((opt) => (
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
            onChange={onChangeField("readTime")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tác giả (tùy chọn)
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.author}
            onChange={onChangeField("author")}
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
          onChange={onChangeField("thumbnail")}
          placeholder="https://..."
        />
        <p className="text-[11px] text-gray-400 mt-1">
          Có thể dùng link ảnh từ CDN/Cloudinary. Nếu để trống sẽ dùng ảnh mặc
          định.
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
          onChange={onChangeField("excerpt")}
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
          onChange={onChangeField("content")}
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
            onChange={onChangeField("tagsInput")}
            placeholder="Đà Lạt, Xe 7 chỗ, Kinh nghiệm thuê xe..."
          />
        </div>
        <div className="space-y-2 mt-1">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={onChangeField("isPublished")}
            />
            <span>Hiển thị trên trang blog (publish)</span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.highlight}
              onChange={onChangeField("highlight")}
            />
            <span>Đánh dấu là bài viết nổi bật</span>
          </label>
        </div>
      </div>
    </>
  );
};
