import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, trim: true },
    content: {
      type: String,
      required: true,
      trim: true, 
    },
    thumbnail: { type: String, trim: true },

    
    category: {
      type: String,
      enum: ["travel", "tips", "cars", "news", "stories"],
      default: "tips",
    },

    tags: [{ type: String, trim: true }],
    author: { type: String, default: "EasyRental" },
    readTime: { type: Number, default: 5 }, 

    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date },

    highlight: { type: Boolean, default: false },  

    meta: {
      views: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);


blogPostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = this.publishedAt || new Date();
  }
  next();
});

blogPostSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
