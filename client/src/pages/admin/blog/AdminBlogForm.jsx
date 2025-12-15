import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";

import { BLOG_CATEGORY_OPTIONS } from "./constants";
import { buildBlogPayload, mapPostToForm } from "./utils";
import { createBlogPost, fetchAdminBlogDetail, updateBlogPost } from "./api";

import { AdminBlogGuard } from "./components/AdminBlogGuard";
import { BlogFormHeader } from "./components/BlogFormHeader";
import { BlogFormFields } from "./components/BlogFormFields";
import { BlogFormActions } from "./components/BlogFormActions";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  category: "tips",
  author: "",
  readTime: 5,
  tagsInput: "",
  isPublished: true,
  highlight: false,
};

const AdminBlogForm = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const nav = useNavigate();

  const isEdit = Boolean(id);
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const pageTitle = useMemo(
    () => (isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"),
    [isEdit]
  );

  useEffect(() => {
    if (!isEdit || !isAdmin) {
      setLoading(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await fetchAdminBlogDetail(id);
        const p = data?.data ?? data;

        if (!p) {
          if (alive) setError("Không tìm thấy bài viết.");
          return;
        }

        if (alive) setForm(mapPostToForm(p));
      } catch (e) {
        if (alive) {
          console.error("load blog detail error", e);
          setError(
            e?.response?.data?.message ||
              e.message ||
              "Không tải được dữ liệu bài viết."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, isEdit, isAdmin]);

  const onChangeField = useCallback(
    (field) => (e) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      try {
        const payload = buildBlogPayload(form);

        if (isEdit) {
          await updateBlogPost(id, payload);
        } else {
          await createBlogPost(payload);
        }

        nav("/admin/blog");
      } catch (e2) {
        console.error("save blog error", e2);
        setError(
          e2?.response?.data?.message ||
            e2.message ||
            "Lưu bài viết thất bại. Vui lòng thử lại."
        );
      } finally {
        setSaving(false);
      }
    },
    [form, id, isEdit, nav]
  );

  return (
    <AdminBlogGuard user={user}>
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <BlogFormHeader pageTitle={pageTitle} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-6"
          >
            <BlogFormFields
              form={form}
              onChangeField={onChangeField}
              categoryOptions={BLOG_CATEGORY_OPTIONS}
              loading={loading}
            />

            <BlogFormActions
              saving={saving}
              isEdit={isEdit}
              onCancel={() => nav("/admin/blog")}
            />
          </form>
        </div>
      </AdminLayout>
    </AdminBlogGuard>
  );
};

export default AdminBlogForm;
