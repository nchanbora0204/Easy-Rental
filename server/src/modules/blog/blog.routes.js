import { Router } from "express";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
} from "./blog.controller.js";
import {
  protect,
  requireAdmin,
  protectOptional,
} from "../../middleware/auth.js";

const router = Router();

//public routes
router.get("/", protectOptional, listPosts);
router.get("/:slug", protectOptional, getPost);

// admin routes
router.post("/", protect, requireAdmin, createPost);
router.put("/:id", protect, requireAdmin, updatePost);
router.delete("/:id", protect, requireAdmin, deletePost);
router.patch("/:id/publish", protect, requireAdmin, togglePublish);

export default router;
