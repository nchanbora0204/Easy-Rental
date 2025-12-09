import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  User,
  Car,
  ArrowRight,
} from "lucide-react";
import api from "../lib/axios";

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

const SUPPORT_PHONE = "0916549515";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/blog/${slug}`);
        const item = data?.data ?? data;
        if (!item) {
          if (alive) {
            setErr("Bài viết không tồn tại hoặc đã bị gỡ.");
          }
          return;
        }
        if (alive) setPost(item);
      } catch (e) {
        if (alive) {
          console.error("load blog detail error", e);
          setErr(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được bài viết."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  // load bài cùng category để gợi ý
  useEffect(() => {
    if (!post) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/blog", {
          params: { category: post.category, limit: 4 },
        });
        const list =
          data?.data?.items ?? data?.data ?? data?.items ?? data ?? [];
        const filtered = list
          .filter((p) => String(p._id) !== String(post._id))
          .slice(0, 3);
        if (alive) setRelated(filtered);
      } catch (e) {
        console.error("load related posts error", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [post]);

  const categoryLabel = post
    ? CATEGORY_LABELS[post.category] || "Bài viết"
    : "";

  const renderContent = (text) => {
    if (!text) return null;
    // đơn giản: chia đoạn theo 1 dòng trống
    return text
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block, idx) => (
        <p
          key={idx}
          className="text-sm md:text-base text-[var(--color-fg)] leading-relaxed mb-3"
        >
          {block}
        </p>
      ));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="section pt-8 pb-14 max-w-5xl">
        <div className="mb-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-primary"
          >
            <ArrowLeft size={16} />
            Quay lại blog
          </Link>
        </div>

        {loading && !post && !err && (
          <div className="card animate-pulse">
            <div className="h-56 bg-[var(--color-surface)] rounded-t-[var(--radius-lg)]" />
            <div className="card-body">
              <div className="h-5 w-32 bg-[var(--color-surface)] rounded mb-3" />
              <div className="h-7 w-3/4 bg-[var(--color-surface)] rounded mb-3" />
              <div className="h-3 w-1/2 bg-[var(--color-surface)] rounded mb-6" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-[var(--color-surface)] rounded" />
                <div className="h-3 w-5/6 bg-[var(--color-surface)] rounded" />
                <div className="h-3 w-4/6 bg-[var(--color-surface)] rounded" />
              </div>
            </div>
          </div>
        )}

        {err && (
          <div className="card">
            <div className="card-body text-center">
              <p className="text-[var(--color-danger)] mb-3">{err}</p>
              <Link to="/blog" className="btn btn-primary text-sm">
                Quay lại danh sách blog
              </Link>
            </div>
          </div>
        )}

        {!loading && post && (
          <>
            <article className="card overflow-hidden">
              {post.thumbnail && (
                <div className="relative h-56 md:h-72">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge bg-primary text-white border-none">
                      {categoryLabel}
                    </span>
                  </div>
                </div>
              )}
              <div className="card-body">
                {!post.thumbnail && (
                  <span className="badge bg-primary/10 text-primary mb-3">
                    {categoryLabel}
                  </span>
                )}

                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] mb-5">
                  <span className="inline-flex items-center gap-1">
                    <User size={12} /> {post.author || "Bonboncar"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />{" "}
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {post.readTime || 5} phút đọc
                  </span>
                </div>

                <div className="border-t border-[var(--color-border)] pt-4 mt-2">
                  {renderContent(post.content)}
                </div>

                {post.tags?.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-surface)] text-[10px] text-[var(--color-muted)]"
                      >
                        <Tag size={11} /> {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>

            {/* CTA đặt xe dưới bài viết */}
            <div className="mt-8 card bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/70 text-[10px] font-medium text-primary mb-2">
                    <Car size={12} /> Gắn trải nghiệm vào chuyến đi thật
                  </div>
                  <h2 className="font-semibold text-lg mb-1">
                    Sẵn sàng áp dụng những gì bạn vừa đọc?
                  </h2>
                  <p className="text-sm text-[var(--color-muted)] max-w-xl">
                    Chọn chiếc xe phù hợp và bắt đầu hành trình của bạn với
                    Bonboncar. Đặt xe nhanh, bảo hiểm đầy đủ, hỗ trợ 24/7.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <Link to="/search" className="btn btn-primary text-sm">
                    Tìm xe ngay <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost text-sm"
                    onClick={() =>
                      (window.location.href = `tel:${SUPPORT_PHONE}`)
                    }
                  >
                    Gọi tư vấn {SUPPORT_PHONE}
                  </button>
                </div>
              </div>
            </div>

            {/* Bài viết liên quan */}
            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">
                  Bài viết liên quan
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {related.map((p) => (
                    <Link
                      key={p._id}
                      to={`/blog/${p.slug || p._id}`}
                      className="card hover:shadow-lg transition-shadow"
                    >
                      <div className="card-body">
                        <p className="text-[11px] uppercase tracking-wide text-primary mb-1">
                          {CATEGORY_LABELS[p.category] || "Bài viết"}
                        </p>
                        <p className="font-semibold text-sm mb-1 line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-[var(--color-muted)] mb-2 line-clamp-2">
                          {p.excerpt}
                        </p>
                        <p className="text-[10px] text-[var(--color-muted)]">
                          {formatDate(p.publishedAt || p.createdAt)} ·{" "}
                          {p.readTime || 5} phút đọc
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
