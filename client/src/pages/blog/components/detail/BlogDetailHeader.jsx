import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { formatDateVI } from "../../blogUtils";
import { CATEGORY_LABELS, FALLBACK_DETAIL_THUMB } from "../../blogConstants";

export const BlogDetailHeader = ({ post, categoryLabel }) => {
  return (
    <>
      <div className="mb-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-primary"
        >
          <ArrowLeft size={16} />
          Quay lại blog
        </Link>
      </div>

      <article className="card overflow-hidden">
        <div className="relative h-56 md:h-72">
          <img
            src={post?.thumbnail || FALLBACK_DETAIL_THUMB}
            alt={post?.title || "Blog"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="badge bg-primary text-white border-none">
              {categoryLabel}
            </span>
          </div>
        </div>

        <div className="card-body">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{post?.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] mb-5">
            <span className="inline-flex items-center gap-1">
              <User size={12} /> {post?.author || "Bonboncar"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />{" "}
              {formatDateVI(post?.publishedAt || post?.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {post?.readTime || 5} phút đọc
            </span>
          </div>

          {post?.tags?.length ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-surface)] text-[10px] text-[var(--color-muted)]"
                >
                  <Tag size={11} /> {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="border-t border-[var(--color-border)] pt-4 mt-2" />
        </div>
      </article>
    </>
  );
};

export default BlogDetailHeader;
