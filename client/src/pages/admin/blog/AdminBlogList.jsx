import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";

import {
  fetchAdminBlogList,
  deleteBlogPost,
  togglePublishBlogPost,
} from "./api";
import { filterPosts, normalizeBlogList } from "./utils";

import { AdminBlogGuard } from "./components/AdminBlogGuard";
import { BlogHeader } from "./components/BlogHeader";
import { BlogFilters } from "./components/BlogFilters";
import { BlogTable } from "./components/BlogTable";
import { LoadingState } from "./components/LoadingState";
import { ErrorBanner } from "./components/ErrorBanner";

const AdminBlogList = () => {
  const { user } = useAuth();
  const nav = useNavigate();

  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = Boolean(user && user.role === "admin");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetchAdminBlogList();
      const list = normalizeBlogList(res?.data);

      setPosts(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("admin blog list error", e);
      setError(
        e?.response?.data?.message ||
          e.message ||
          "Không tải được danh sách bài viết."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    if (!isAdmin) {
      setLoading(false);
      return () => {};
    }

    (async () => {
      if (!alive) return;
      await load();
    })();

    return () => {
      alive = false;
    };
  }, [isAdmin, load]);

  const filtered = useMemo(
    () => filterPosts(posts, category, q),
    [posts, category, q]
  );

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => String(p._id) !== String(id)));
    } catch (e) {
      console.error("delete blog error", e);
      alert(
        e?.response?.data?.message || e.message || "Xóa bài viết thất bại."
      );
    }
  }, []);

  const handleTogglePublish = useCallback(async (id) => {
    try {
      const { data } = await togglePublishBlogPost(id);
      const updated = data?.data;
      if (!updated) return;

      setPosts((prev) =>
        prev.map((p) =>
          String(p._id) === String(id) ? { ...p, ...updated } : p
        )
      );
    } catch (e) {
      console.error("toggle publish error", e);
      alert(
        e?.response?.data?.message ||
          e.message ||
          "Không thể thay đổi trạng thái hiển thị."
      );
    }
  }, []);

  if (!isAdmin) {
    return (
      <AdminBlogGuard user={user}>
        <AdminLayout />
      </AdminBlogGuard>
    );
  }

  if (loading) return <LoadingState />;

  return (
    <AdminBlogGuard user={user}>
      <AdminLayout>
        <div className="space-y-6">
          <BlogHeader onNew={() => nav("/admin/blog/new")} />

          <ErrorBanner error={error} />

          <BlogFilters
            q={q}
            setQ={setQ}
            category={category}
            setCategory={setCategory}
          />

          <BlogTable
            rows={filtered}
            onTogglePublish={handleTogglePublish}
            onEdit={(id) => nav(`/admin/blog/${id}/edit`)}
            onDelete={handleDelete}
          />
        </div>
      </AdminLayout>
    </AdminBlogGuard>
  );
};

export default AdminBlogList;
