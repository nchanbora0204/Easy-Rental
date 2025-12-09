import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Car,
  ClipboardList,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const menu = [
  { label: "Tổng quan", path: "/owner/dashboard", icon: LayoutDashboard },
  { label: "Lịch xe", path: "/owner/calendar", icon: Calendar },
  { label: "Quản lý xe", path: "/owner/cars", icon: Car },
  { label: "Đơn hàng", path: "/owner/bookings", icon: ClipboardList },
  { label: "Báo cáo", path: "/owner/reports", icon: BarChart3 },
];

export default function OwnerLayout({ children }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Car className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">CarRental</h1>
              <p className="text-xs text-gray-500">Chủ xe</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {user.name || "Chủ xe"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
