import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { CATEGORY_LABELS, FALLBACK_CARD_THUMB } from "../blogConstants";
import { formatDateVI } from "../blogUtils";

export const BlogPostCard = ({ post }) => {
  return (
    <article className="card hover:shadow-lg transition-shadow">
      <div className="card-body flex gap-4">
        <div className="hidden sm:block w-40 h-28 rounded-[var(--radius-md)] overflow-hidden shrink-0">
          <img
            src={post.thumbnail || FALLBACK_CARD_THUMB}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wide text-primary">
              {CATEGORY_LABELS[post.category] || "Bài viết"}
            </span>
            <span className="text-[var(--color-muted)] text-[10px]">
              • {formatDateVI(post.publishedAt || post.createdAt)} •{" "}
              {post.readTime || 5} phút đọc
            </span>
          </div>

          <Link
            to={`/blog/${post.slug || post._id}`}
            className="block font-semibold text-sm md:text-base mb-1 hover:text-primary line-clamp-2"
          >
            {post.title}
          </Link>

          <p className="text-xs md:text-sm text-[var(--color-muted)] line-clamp-2 mb-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-[10px] md:text-xs text-[var(--color-muted)]">
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).slice(0, 3).map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-surface)]/70"
                >
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>

            <Link
              to={`/blog/${post.slug || post._id}`}
              className="inline-flex items-center gap-1 text-primary font-medium whitespace-nowrap"
            >
              Đọc bài <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
