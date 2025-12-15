export const getApiErrorMessage = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || "Có lỗi xảy ra";

export const formatDateVI = (str) => {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("vi-VN");
  } catch {
    return String(str);
  }
};

export const normalizePosts = (posts) => (Array.isArray(posts) ? posts : []);

export const filterPosts = (posts, category, q) => {
  const list = normalizePosts(posts);
  const keyword = (q || "").trim().toLowerCase();

  return list.filter((p) => {
    const cat = p?.category || "tips";
    if (category !== "all" && cat !== category) return false;

    if (!keyword) return true;

    const title = (p?.title || "").toLowerCase();
    const excerpt = (p?.excerpt || "").toLowerCase();
    const tags = (p?.tags || []).map((t) => String(t || "").toLowerCase());

    return (
      title.includes(keyword) ||
      excerpt.includes(keyword) ||
      tags.some((t) => t.includes(keyword))
    );
  });
};

export const pickFeatured = (filteredPosts) =>
  filteredPosts.find((p) => p?.highlight) || filteredPosts[0] || null;

export const pickOthers = (filteredPosts, featured) => {
  if (!featured) return filteredPosts;
  return filteredPosts.filter((p) => String(p?._id) !== String(featured?._id));
};

export const pickRecent = (posts, n = 4) => {
  const list = normalizePosts(posts);
  return [...list]
    .sort(
      (a, b) =>
        new Date(b?.publishedAt || b?.createdAt || 0) -
        new Date(a?.publishedAt || a?.createdAt || 0)
    )
    .slice(0, n);
};
