import AdminLayout from "../../layout/AdminLayout";

export const AdminBlogGuard = ({ user, children }) => {
  if (!user || user.role !== "admin") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-sm">
            Bạn không có quyền truy cập trang này (chỉ admin).
          </div>
        </div>
      </AdminLayout>
    );
  }
  return children;
};
