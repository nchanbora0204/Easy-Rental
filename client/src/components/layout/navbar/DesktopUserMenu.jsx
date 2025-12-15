import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  User,
  ChevronDown,
} from "lucide-react";
import UserAvatar from "./ui/UserAvatar";
import { ROLE_DASHBOARD } from "./utils/constants";
import { cn } from "./utils/cn";

const DesktopUserMenu = ({
  user,
  userDropdown,
  onToggleUserDropdown,
  onCloseUserDropdown,
  userRef,
  onOpenProfile,
  onLogout,
}) => {
  const roleDashboard = user?.role ? ROLE_DASHBOARD[user.role] : null;

  return (
    <>
      {roleDashboard && (
        <NavLink
          to={roleDashboard.to}
          className={({ isActive }) =>
            cn(
              "hidden lg:flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors",
              isActive ? "bg-accent/10 text-accent" : "hover:bg-gray-50"
            )
          }
        >
          <LayoutDashboard size={18} />
          {roleDashboard.label}
        </NavLink>
      )}

      <div className="relative" ref={userRef}>
        <button
          onClick={onToggleUserDropdown}
          className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] hover:bg-gray-50 transition-colors"
          aria-haspopup="menu"
          aria-expanded={userDropdown}
        >
          <UserAvatar user={user} />
          <span className="font-medium max-w-[160px] truncate">
            {user?.name || user?.email}
          </span>
          <ChevronDown size={16} />
        </button>

        {userDropdown && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-[var(--radius-md)] shadow-lg border border-[var(--color-border)] overflow-hidden">
            <button
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
              onClick={onOpenProfile}
            >
              <User size={16} />
              Tài khoản
            </button>

            <NavLink
              to="/register-car/pending"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
              onClick={onCloseUserDropdown}
            >
              <FileCheck size={16} />
              Trạng thái KYC
            </NavLink>

            <NavLink
              to="/bookings"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
              onClick={onCloseUserDropdown}
            >
              <ClipboardList size={16} />
              Đơn thuê của tôi
            </NavLink>

            {roleDashboard && <div className="h-px bg-[var(--color-border)] my-1" />}

            {roleDashboard && (
              <NavLink
                to={roleDashboard.to}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                onClick={onCloseUserDropdown}
              >
                <LayoutDashboard size={16} />
                {user.role === "admin" ? "Admin" : roleDashboard.label}
                <ChevronRight size={14} className="ml-auto opacity-60" />
              </NavLink>
            )}

            <div className="h-px bg-[var(--color-border)] my-1" />
            <button
              onClick={onLogout}
              className="w-full px-4 py-3 text-left hover:bg-red-50 text-danger flex items-center gap-2"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DesktopUserMenu;
