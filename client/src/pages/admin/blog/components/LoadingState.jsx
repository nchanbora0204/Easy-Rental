import AdminLayout from "../../layout/AdminLayout";

export const LoadingState = () => (
  <AdminLayout>
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Đang tải...</div>
    </div>
  </AdminLayout>
);
