import { Router } from "express";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
} from "./blog.controller.js";
import { protect, requireAdmin } from "../../middleware/auth.js";

const router = Router();

//public routes
router.get("/", listPosts);

router.get("/:slug", getPost);

//admin routes

router.post("/", createPost, requireAdmin, protect);

router.put("/:id", updatePost, requireAdmin, protect);

router.delete("/:id", deletePost, requireAdmin, protect);

router.patch("/:id/publish", togglePublish, requireAdmin, protect);

export default router;
