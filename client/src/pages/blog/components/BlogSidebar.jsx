import { Link } from "react-router-dom";
import { Car, MessageCircle } from "lucide-react";
import {
  FALLBACK_RECENT_THUMB,
  SUPPORT_PHONE,
  ZALO_LINK,
} from "../blogConstants";
import { formatDateVI } from "../blogUtils";

export const BlogSidebar = ({ recentPosts }) => {
  return (
    <aside className="space-y-6">
      {/* CTA đặt xe */}
      <div className="card bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="card-body">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 text-[10px] font-medium text-primary mb-3">
            <Car size={12} /> Đặt xe ngay
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Sẵn sàng cho chuyến đi tiếp theo?
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            Chọn xe phù hợp, đặt online trong vài phút. Nhận xe nhanh tại các
            điểm gần bạn.
          </p>

          <Link to="/search" className="btn btn-primary w-full mb-2">
            Tìm xe ngay
          </Link>

          <button
            type="button"
            className="btn btn-ghost w-full text-sm"
            onClick={() => (window.location.href = `tel:${SUPPORT_PHONE}`)}
          >
            Gọi tư vấn {SUPPORT_PHONE}
          </button>
        </div>
      </div>

      {/* Bài viết mới */}
      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold mb-3 text-sm md:text-base">
            Bài viết mới nhất
          </h3>
          <div className="space-y-3">
            {(recentPosts || []).map((p) => (
              <Link
                key={p._id}
                to={`/blog/${p.slug || p._id}`}
                className="flex gap-3 group"
              >
                <div className="w-16 h-12 rounded-md overflow-hidden bg-[var(--color-surface)] shrink-0">
                  <img
                    src={p.thumbnail || FALLBACK_RECENT_THUMB}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-2 group-hover:text-primary">
                    {p.title}
                  </p>
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">
                    {formatDateVI(p.publishedAt || p.createdAt)} ·{" "}
                    {p.readTime || 5} phút đọc
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Box hỗ trợ & chat */}
      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold mb-2 text-sm md:text-base">
            Cần thêm tư vấn?
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-3">
            Nếu bạn có câu hỏi về việc thuê xe, hành trình hoặc dòng xe phù hợp,
            hãy nhắn tin cho đội ngũ Bonboncar.
          </p>

          <div className="flex flex-col gap-2">
            <a
              href={ZALO_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline w-full text-sm"
            >
              <MessageCircle size={16} />
              Chat Zalo với chúng tôi
            </a>

            <p className="text-[11px] text-[var(--color-muted)]">
              Hoặc để lại bình luận ở cuối mỗi bài viết (sau này khi bạn bật tính
              năng comment).
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
