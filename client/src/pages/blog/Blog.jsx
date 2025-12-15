import { useEffect, useMemo, useState } from "react";

import { FadeSection } from "../../components/common/FadeSection";
import { BlogHeader } from "./components/BlogHeader";
import { BlogCategoryTabs } from "./components/BlogCategoryTabs";
import { FeaturedPost } from "./components/FeaturedPost";
import { BlogPostCard } from "./components/BlogPostCard";
import { BlogSidebar } from "./components/BlogSidebar";

import { CATEGORIES } from "./blogConstants";
import {
  filterPosts,
  getApiErrorMessage,
  pickFeatured,
  pickOthers,
  pickRecent,
} from "./blogUtils";
import { fetchBlogPosts } from "./blogService";

export const Blog = () => {
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const list = await fetchBlogPosts({ limit: 50, sort: "recent" });
        if (alive) setPosts(list);
      } catch (e) {
        if (alive) setErr(getApiErrorMessage(e, "Không tải được danh sách bài viết."));
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  const filteredPosts = useMemo(
    () => filterPosts(posts, category, q),
    [posts, category, q]
  );

  const featuredPost = useMemo(
    () => pickFeatured(filteredPosts),
    [filteredPosts]
  );

  const otherPosts = useMemo(
    () => pickOthers(filteredPosts, featuredPost),
    [filteredPosts, featuredPost]
  );

  const recentPosts = useMemo(() => pickRecent(posts, 4), [posts]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <FadeSection className="section pt-10 pb-6">
        <BlogHeader q={q} onChangeQ={setQ} />
        <BlogCategoryTabs
          categories={CATEGORIES}
          activeId={category}
          onChange={setCategory}
        />
        {err && <p className="mt-3 text-sm text-[var(--color-danger)]">{err}</p>}
      </FadeSection>

      <FadeSection className="section pb-14">
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
          {/* Left column */}
          <div className="space-y-8">
            <FeaturedPost post={featuredPost} />

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
                <BlogPostCard key={p._id} post={p} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <BlogSidebar recentPosts={recentPosts} />
        </div>
      </FadeSection>
    </div>
  );
};

export default Blog;
