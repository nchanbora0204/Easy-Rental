import { LogOut } from "lucide-react";

export const AdminLogoutButton = ({ onLogout }) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
      >
        <LogOut size={20} />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};
