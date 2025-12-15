import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { OwnerSidebar } from "./components/OwnerSidebar";

export const OwnerLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <OwnerSidebar pathname={pathname} user={user} onLogout={logout} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default OwnerLayout;



