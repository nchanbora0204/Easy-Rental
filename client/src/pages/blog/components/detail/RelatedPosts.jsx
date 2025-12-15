import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../../blogConstants";
import { formatDateVI } from "../../blogUtils";

export const RelatedPosts = ({ posts }) => {
  if (!posts?.length) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link
            key={p._id}
            to={`/blog/${p.slug || p._id}`}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <p className="text-[11px] uppercase tracking-wide text-primary mb-1">
                {CATEGORY_LABELS[p.category] || "Bài viết"}
              </p>
              <p className="font-semibold text-sm mb-1 line-clamp-2">{p.title}</p>
              <p className="text-[11px] text-[var(--color-muted)] mb-2 line-clamp-2">
                {p.excerpt}
              </p>
              <p className="text-[10px] text-[var(--color-muted)]">
                {formatDateVI(p.publishedAt || p.createdAt)} · {p.readTime || 5} phút đọc
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
