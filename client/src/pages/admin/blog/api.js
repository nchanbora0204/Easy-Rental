import api from "../../../lib/axios";
import { BLOG_LIST_DEFAULT_PARAMS } from "./constants";

export const fetchAdminBlogList = async () => {
  return api.get("/blog", { params: BLOG_LIST_DEFAULT_PARAMS });
};

export const fetchAdminBlogDetail = async (id) => {
  return api.get(`/blog/${id}`, { params: { includeUnpublished: "true" } });
};

export const createBlogPost = async (payload) => {
  return api.post("/blog", payload);
};

export const updateBlogPost = async (id, payload) => {
  return api.put(`/blog/${id}`, payload);
};

export const deleteBlogPost = async (id) => {
  return api.delete(`/blog/${id}`);
};

export const togglePublishBlogPost = async (id) => {
  return api.patch(`/blog/${id}/publish`);
};
