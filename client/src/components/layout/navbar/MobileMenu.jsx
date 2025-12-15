import { MapPin, LayoutDashboard, User, FileCheck, ClipboardList, LogOut } from "lucide-react";
import { CITIES, BASE_LINKS, ROLE_DASHBOARD } from "./utils/constants";
import MenuLink from "./ui/MenuLink";
import UserAvatar from "./ui/UserAvatar";

const MobileMenu = ({ user, onClose, onOpenAuth, onOpenProfile, onLogout }) => {
  const roleDashboard = user?.role ? ROLE_DASHBOARD[user.role] : null;

  return (
    <div className="md:hidden border-t border-[var(--color-border)] bg-white">
      <div className="px-4 py-3 space-y-1">
        {BASE_LINKS.map((l) => (
          <MenuLink key={l.to} to={l.to} onClick={onClose}>
            {l.label}
          </MenuLink>
        ))}

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 text-[var(--color-muted)] text-sm mb-2">
            <MapPin size={16} />
            Địa điểm
          </div>
          <select className="select w-full text-sm" onChange={onClose}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="h-px bg-[var(--color-border)] my-3" />

        {!user ? (
          <div className="space-y-2">
            <button
              onClick={() => onOpenAuth("login")}
              className="block w-full px-4 py-3 text-center rounded-[var(--radius-md)] font-medium bg-accent text-white"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => onOpenAuth("register")}
              className="block w-full px-4 py-3 text-center rounded-[var(--radius-md)] font-medium border border-accent text-accent"
            >
              Đăng ký
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-3">
              <UserAvatar user={user} size="w-10 h-10" iconSize={20} />
              <div className="min-w-0">
                <p className="font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-sm text-[var(--color-muted)] truncate">{user?.email}</p>
              </div>
            </div>

            {roleDashboard && (
              <MenuLink
                to={roleDashboard.to}
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                {user.role === "admin" ? "Admin Dashboard" : roleDashboard.label}
              </MenuLink>
            )}

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-[var(--radius-md)] font-medium hover:bg-gray-50 transition-colors"
            >
              <User size={18} />
              Tài khoản
            </button>

            <MenuLink
              to="/register-car/pending"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <FileCheck size={18} />
              Trạng thái KYC
            </MenuLink>

            <MenuLink
              to="/bookings"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <ClipboardList size={18} />
              Đơn thuê của tôi
            </MenuLink>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-[var(--radius-md)] font-medium text-danger hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
