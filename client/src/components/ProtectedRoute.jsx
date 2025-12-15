import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({
  children,
  roles = null,
  requireKycApproved = false,
}) => {
  const { user, loading } = useAuth();
  const { pathname, search } = useLocation();

  const next = useMemo(
    () => encodeURIComponent(`${pathname}${search}`),
    [pathname, search]
  );

  const isAuthed = Boolean(user);
  const hasRole = !roles || roles.includes(user?.role);
  const needsKyc = requireKycApproved && user?.role === "owner";
  const kycOk = user?.kycStatus === "approved";

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to={`/?auth=login&next=${next}`} replace />;
  }

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  if (needsKyc && !kycOk) {
    return <Navigate to="/register-car/pending" replace />;
  }


  return typeof children === "function" ? children({ user }) : children;
};

export default ProtectedRoute;
