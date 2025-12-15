import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Tag, User } from "lucide-react";
import { formatDateVI } from "../blogUtils";
import { CATEGORY_LABELS, FALLBACK_FEATURED_THUMB } from "../blogConstants";

export const FeaturedPost = ({ post }) => {
  if (!post) return null;

  return (
    <article className="card overflow-hidden">
      <div className="grid md:grid-cols-2 h-full">
        <div className="relative h-56 md:h-full">
          <img
            src={post.thumbnail || FALLBACK_FEATURED_THUMB}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2 items-center">
            <span className="badge bg-primary text-white border-none">
              {CATEGORY_LABELS[post.category] || "Bài viết"}
            </span>
          </div>
        </div>

        <div className="card-body flex flex-col justify-between">
          <div>
            <p className="text-xs text-primary font-medium mb-1">
              Bài viết nổi bật
            </p>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {post.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] mb-3">
              <span className="inline-flex items-center gap-1">
                <User size={12} />
                {post.author || "Bonboncar"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} />
                {formatDateVI(post.publishedAt || post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {post.readTime || 5} phút đọc
              </span>
            </div>

            <p className="text-sm text-[var(--color-muted)] mb-4">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-surface)] text-[10px] text-[var(--color-muted)]"
                >
                  <Tag size={11} /> {t}
                </span>
              ))}
            </div>

            <Link
              to={`/blog/${post.slug || post._id}`}
              className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline whitespace-nowrap"
            >
              Đọc chi tiết <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
