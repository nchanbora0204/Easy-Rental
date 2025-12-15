import { useAuth } from "../../../contexts/AuthContext";
import { ADMIN_MENU_ITEMS } from "./adminMenu";
import { AdminSidebar } from "./components/AdminSidebar";

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar menuItems={ADMIN_MENU_ITEMS} onLogout={logout} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
