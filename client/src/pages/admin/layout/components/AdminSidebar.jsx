import { AdminHeader } from "./AdminHeader";
import { AdminNavItem } from "./AdminNavItem";
import { AdminLogoutButton } from "./AdminLogoutButton";

export const AdminSidebar = ({ menuItems, onLogout }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <AdminHeader />

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <AdminNavItem key={item.to} {...item} />
        ))}
      </nav>

      <AdminLogoutButton onLogout={onLogout} />
    </aside>
  );
};
