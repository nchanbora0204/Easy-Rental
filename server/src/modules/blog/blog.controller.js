import mongoose from "mongoose";
import BlogPost from "./blog.model.js";

//helper giúp parse tags từ string sang array
const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t || "").trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

//list bai viet
export const listPosts = async (req, res) => {
  try {
    const {
      category,
      q,
      page = 1,
      limit = 10,
      highlight,
      sort = "recent",
      includeUnpublished,
    } = req.query;

    const pageNum = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (pageNum - 1) * perPage;

    const wantUnpublished = includeUnpublished === "true";
    const isAdmin = req.user?.role === "admin";

    const filter = wantUnpublished && isAdmin ? {} : { isPublished: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (highlight === "true") {
      filter.highlight = true;
    }

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { tags: { $in: [regex] } },
      ];
    }

    let sortOpt;
    if (sort === "popular") {
      sortOpt = { "meta.views": -1, publishedAt: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOpt = { publishedAt: 1, createdAt: 1 };
    } else {
      sortOpt = { publishedAt: -1, createdAt: -1 };
    }

    const [items, total] = await Promise.all([
      BlogPost.find(filter).sort(sortOpt).skip(skip).limit(perPage).lean(),
      BlogPost.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: { items, total, page: pageNum, limit: perPage },
    });
  } catch (e) {
    console.error("listPosts error", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const isAdmin = req.user?.role === "admin";

    let post;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      post = await BlogPost.findById(slug).lean();
    } else {
      post = await BlogPost.findOne({ slug }).lean();
    }
    if (!post || (!isAdmin && !post.isPublished)) {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại hoặc đã bị gỡ.",
      });
    }

    if (post.isPublished) {
      BlogPost.updateOne(
        { _id: post._id },
        { $inc: { "meta.views": 1 } }
      ).catch(() => {});
    }

    return res.json({ success: true, data: post });
  } catch (e) {
    console.error("getPost error", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Admin tao bai viet moi
export const createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
      author,
      readTime,
      isPublished,
      highlight,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Tiêu đề và nội dung bài viết là bắt buộc.",
      });
    }

    const doc = new BlogPost({
      title: String(title).trim(),
      slug: slug ? String(slug).trim().toLowerCase() : undefined,
      excerpt: excerpt?.trim(),
      content: content?.trim(),
      thumbnail: thumbnail?.trim(),
      category: category || "tips",
      author: author?.trim() || "EasyRental",
      readTime: readTime ? Number(readTime) : undefined,
      tags: normalizeTags(tags),
      highlight: !!highlight,
    });

    if (typeof isPublished === "boolean") {
      doc.isPublished = isPublished;
      if (isPublished && !doc.publishedAt) {
        doc.publishedAt = new Date();
      }
    }

    await doc.save();

    return res.status(201).json({ success: true, data: doc });
  } catch (e) {
    console.error("createPost error", e);
    if (e?.code === 11000 && e.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: "Slug bài viết đã tồn tại, vui lòng chọn slug khác.",
      });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Admin cap nhat bai viet
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết." });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
      author,
      readTime,
      isPublished,
      highlight,
    } = req.body;

    if (title !== undefined) post.title = String(title).trim();
    if (slug !== undefined)
      post.slug = String(slug).trim().toLowerCase() || post.slug;
    if (excerpt !== undefined) post.excerpt = excerpt?.trim();
    if (content !== undefined) post.content = content?.trim();
    if (thumbnail !== undefined) post.thumbnail = thumbnail?.trim();
    if (category !== undefined) post.category = category;
    if (author !== undefined) post.author = author?.trim();
    if (readTime !== undefined) post.readTime = Number(readTime) || 5;
    if (tags !== undefined) post.tags = normalizeTags(tags);
    if (highlight !== undefined) post.highlight = !!highlight;

    if (typeof isPublished === "boolean") {
      // nếu từ false -> true mà chưa có publishedAt thì set mới
      if (!post.isPublished && isPublished && !post.publishedAt) {
        post.publishedAt = new Date();
      }
      post.isPublished = isPublished;
    }

    await post.save();

    return res.json({ success: true, data: post });
  } catch (e) {
    console.error("updatePost error", e);
    if (e?.code === 11000 && e.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: "Slug bài viết đã tồn tại, vui lòng chọn slug khác.",
      });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Admin xoa bai viet
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết." });
    }

    return res.json({ success: true, message: "Đã xóa bài viết." });
  } catch (e) {
    console.error("deletePost error", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

//Admin bật tắt bài viết nhanh
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết." });
    }

    post.isPublished = !post.isPublished;
    if (post.isPublished && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();

    return res.json({
      success: true,
      data: post,
      message: post.isPublished
        ? "Đã bật hiển thị bài viết."
        : "Đã ẩn bài viết khỏi trang blog.",
    });
  } catch (e) {
    console.error("togglePublish error", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
