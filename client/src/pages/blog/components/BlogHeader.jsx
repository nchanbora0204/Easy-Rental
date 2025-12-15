import { Search } from "lucide-react";

export const BlogHeader = ({ q, onChangeQ }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">
          BLOG EasyRental
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Cẩm nang thuê xe & du lịch
        </h1>
        <p className="text-sm md:text-base text-[var(--color-muted)] max-w-2xl">
          Kinh nghiệm thuê xe, gợi ý hành trình, đánh giá xe và những ưu đãi mới
          nhất – tất cả đều ở đây.
        </p>
      </div>

      <div className="w-full md:w-80">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            className="input pl-9 text-sm"
            placeholder="Tìm bài viết, ví dụ: Đà Lạt, KIA Carnival..."
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
