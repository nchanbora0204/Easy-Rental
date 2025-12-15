export const formatDate = (str) => {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("vi-VN");
  } catch {
    return str;
  }
};

export const normalizeBlogList = (data) => {
  return data?.data?.items ?? data?.data ?? data?.items ?? data ?? [];
};

export const filterPosts = (posts, category, q) => {
  return (posts || []).filter((p) => {
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
};

export const mapPostToForm = (p) => ({
  title: p.title || "",
  slug: p.slug || "",
  excerpt: p.excerpt || "",
  content: p.content || "",
  thumbnail: p.thumbnail || "",
  category: p.category || "tips",
  author: p.author || "",
  readTime: p.readTime || 5,
  tagsInput: (p.tags || []).join(", "),
  isPublished: !!p.isPublished,
  highlight: !!p.highlight,
});

export const buildBlogPayload = (form) => ({
  title: form.title,
  slug: form.slug || undefined,
  excerpt: form.excerpt,
  content: form.content,
  thumbnail: form.thumbnail,
  category: form.category,
  author: form.author || undefined,
  readTime: form.readTime ? Number(form.readTime) : undefined,

  tags: form.tagsInput,

  isPublished: form.isPublished,
  highlight: form.highlight,
});
