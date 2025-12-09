import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Tag,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Car,
  MessageCircle,
} from "lucide-react";
import api from "../lib/axios";

const SUPPORT_PHONE = "0916549515";
const ZALO_LINK = "https://zalo.me/0916549515";

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "travel", label: "Cẩm nang du lịch" },
  { id: "tips", label: "Kinh nghiệm thuê xe" },
  { id: "cars", label: "Đánh giá & dòng xe" },
  { id: "news", label: "Tin tức & Ưu đãi" },
  { id: "stories", label: "Câu chuyện khách hàng" },
];

const CATEGORY_LABELS = CATEGORIES.reduce((acc, c) => {
  if (c.id !== "all") acc[c.id] = c.label;
  return acc;
}, {});

const formatDate = (str) => {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("vi-VN");
  } catch {
    return str;
  }
};

/* ========== fade-in khi cuộn ========== */
function useFadeInOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FadeSection({ className = "", children }) {
  const [ref, visible] = useFadeInOnScroll();
  return (
    <section
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      {children}
    </section>
  );
}

export default function Blog() {
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get("/blog", {
          params: { limit: 50, sort: "recent" },
        });

        const list =
          data?.data?.items ?? data?.data ?? data?.items ?? data ?? [];

        if (alive) setPosts(list);
      } catch (e) {
        if (alive) {
          console.error("load blog list error", e);
          setErr(
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
  }, []);

  const filteredPosts = useMemo(() => {
    const list = posts || [];
    return list.filter((p) => {
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

  const featuredPost =
    filteredPosts.find((p) => p.highlight) || filteredPosts[0] || null;

  const otherPosts = featuredPost
    ? filteredPosts.filter((p) => String(p._id) !== String(featuredPost._id))
    : filteredPosts;

  const recentPosts = useMemo(() => {
    const list = posts || [];
    return [...list]
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt || 0) -
          new Date(a.publishedAt || a.createdAt || 0)
      )
      .slice(0, 4);
  }, [posts]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header của blog */}
      <FadeSection className="section pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">
              BLOG EasyRental
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Cẩm nang thuê xe & du lịch
            </h1>
            <p className="text-sm md:text-base text-[var(--color-muted)] max-w-2xl">
              Kinh nghiệm thuê xe, gợi ý hành trình, đánh giá xe và những ưu đãi
              mới nhất – tất cả đều ở đây.
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
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs category */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-[var(--color-surface)]/70 text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-fg)]"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {err && (
          <p className="mt-3 text-sm text-[var(--color-danger)]">{err}</p>
        )}
      </FadeSection>

      <FadeSection className="section pb-14">
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
          {/* Cột trái: featured + list */}
          <div className="space-y-8">
            {/* Featured */}
            {featuredPost && (
              <article className="card overflow-hidden">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="relative h-56 md:h-full">
                    <img
                      src={
                        featuredPost.thumbnail ||
                        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop"
                      }
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2 items-center">
                      <span className="badge bg-primary text-white border-none">
                        {CATEGORY_LABELS[featuredPost.category] || "Bài viết"}
                      </span>
                    </div>
                  </div>
                  <div className="card-body flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-primary font-medium mb-1">
                        Bài viết nổi bật
                      </p>
                      <h2 className="text-xl md:text-2xl font-semibold mb-2">
                        {featuredPost.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] mb-3">
                        <span className="inline-flex items-center gap-1">
                          <User size={12} />{" "}
                          {featuredPost.author || "Bonboncar"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {formatDate(
                            featuredPost.publishedAt || featuredPost.createdAt
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {featuredPost.readTime || 5} phút
                          đọc
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)] mb-4">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags?.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-surface)] text-[10px] text-[var(--color-muted)]"
                          >
                            <Tag size={11} /> {t}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${featuredPost.slug || featuredPost._id}`}
                        className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                      >
                        Đọc chi tiết <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* List các bài còn lại */}
            <div className="space-y-4">
              {loading && !filteredPosts.length && (
                <p className="text-sm text-[var(--color-muted)]">
                  Đang tải danh sách bài viết...
                </p>
              )}

              {!loading && !filteredPosts.length && (
                <p className="text-sm text-[var(--color-muted)]">
                  Không tìm thấy bài viết phù hợp với bộ lọc hiện tại.
                </p>
              )}

              {otherPosts.map((p) => (
                <article
                  key={p._id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="card-body flex gap-4">
                    <div className="hidden sm:block w-40 h-28 rounded-[var(--radius-md)] overflow-hidden shrink-0">
                      <img
                        src={
                          p.thumbnail ||
                          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop"
                        }
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] uppercase tracking-wide text-primary">
                          {CATEGORY_LABELS[p.category] || "Bài viết"}
                        </span>
                        <span className="text-[var(--color-muted)] text-[10px]">
                          • {formatDate(p.publishedAt || p.createdAt)} •{" "}
                          {p.readTime || 5} phút đọc
                        </span>
                      </div>
                      <Link
                        to={`/blog/${p.slug || p._id}`}
                        className="block font-semibold text-sm md:text-base mb-1 hover:text-primary line-clamp-2"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs md:text-sm text-[var(--color-muted)] line-clamp-2 mb-2">
                        {p.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-[10px] md:text-xs text-[var(--color-muted)]">
                        <div className="flex flex-wrap gap-2">
                          {p.tags?.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-surface)]/70"
                            >
                              <Tag size={10} /> {t}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/blog/${p.slug || p._id}`}
                          className="inline-flex items-center gap-1 text-primary font-medium"
                        >
                          Đọc bài <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Cột phải: sidebar */}
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
                  Chọn xe phù hợp, đặt online trong vài phút. Nhận xe nhanh tại
                  các điểm gần bạn.
                </p>
                <Link to="/search" className="btn btn-primary w-full mb-2">
                  Tìm xe ngay
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost w-full text-sm"
                  onClick={() =>
                    (window.location.href = `tel:${SUPPORT_PHONE}`)
                  }
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
                  {recentPosts.map((p) => (
                    <Link
                      key={p._id}
                      to={`/blog/${p.slug || p._id}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-16 h-12 rounded-md overflow-hidden bg-[var(--color-surface)] shrink-0">
                        <img
                          src={
                            p.thumbnail ||
                            "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=600&fit=crop"
                          }
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 group-hover:text-primary">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-[var(--color-muted)] mt-1">
                          {formatDate(p.publishedAt || p.createdAt)} ·{" "}
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
                  Nếu bạn có câu hỏi về việc thuê xe, hành trình hoặc dòng xe
                  phù hợp, hãy nhắn tin cho đội ngũ Bonboncar.
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
                    Hoặc để lại bình luận ở cuối mỗi bài viết (sau này khi bạn
                    bật tính năng comment).
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </FadeSection>
    </div>
  );
}
