import api from "../../lib/axios";

export const fetchBlogPosts = async ({
  limit = 50,
  sort = "recent",
  category,
} = {}) => {
  const { data } = await api.get("/blog", {
    params: { limit, sort, category },
  });
  const list = data?.data?.items ?? data?.data ?? data?.items ?? data ?? [];
  return Array.isArray(list) ? list : [];
};

export const fetchBlogDetail = async (slug) => {
  const { data } = await api.get(`/blog/${slug}`);
  return data?.data ?? data ?? null;
};

export const fetchRelatedPosts = async ({
  category,
  excludeId,
  limit = 4,
} = {}) => {
  if (!category) return [];
  const list = await fetchBlogPosts({ category, limit });
  return (list || [])
    .filter((p) => String(p?._id) !== String(excludeId))
    .slice(0, 3);
};
