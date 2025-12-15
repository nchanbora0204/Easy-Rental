import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { CATEGORY_LABELS } from "./blogConstants";
import { getApiErrorMessage } from "./blogUtils";
import { fetchBlogDetail, fetchRelatedPosts } from "./blogService";
import { FadeSection } from "../../components/common/FadeSection";
import BlogDetailSkeleton from "./components/detail/BlogDetailSkeleton";
import BlogDetailError from "./components/detail/BlogDetailError";
import BlogDetailHeader from "./components/detail/BlogDetailHeader";
import BlogDetailContent from "./components/detail/BlogDetailContent";
import BlogDetailCTA from "./components/detail/BlogDetailCTA";
import RelatedPosts from "./components/detail/RelatedPosts";

export const BlogDetail = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load detail
  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        setRelated([]);

        const item = await fetchBlogDetail(slug);

        if (!item) {
          if (alive) setErr("Bài viết không tồn tại hoặc đã bị gỡ.");
          return;
        }

        if (alive) setPost(item);
      } catch (e) {
        if (alive) setErr(getApiErrorMessage(e, "Không tải được bài viết."));
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [slug]);

  // Load related by category
  useEffect(() => {
    if (!post?._id || !post?.category) return;
    let alive = true;

    const run = async () => {
      try {
        const list = await fetchRelatedPosts({
          category: post.category,
          excludeId: post._id,
          limit: 4,
        });
        if (alive) setRelated(list);
      } catch {
        // ignore related error
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [post?._id, post?.category]);

  const categoryLabel = useMemo(() => {
    if (!post) return "";
    return CATEGORY_LABELS[post.category] || "Bài viết";
  }, [post]);

  return (
    <FadeSection>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="section pt-8 pb-14 max-w-5xl">
          {loading && !post && !err && <BlogDetailSkeleton />}

          {err && <BlogDetailError message={err} />}

          {!loading && post && (
            <>
              <BlogDetailHeader post={post} categoryLabel={categoryLabel} />
              <BlogDetailContent content={post.content} />
              <BlogDetailCTA />
              <RelatedPosts posts={related} />
            </>
          )}
        </div>
      </div>
    </FadeSection>
  );
};

export default BlogDetail;
