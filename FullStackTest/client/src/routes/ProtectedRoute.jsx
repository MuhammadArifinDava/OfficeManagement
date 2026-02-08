import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Loader3D } from "../components/Loader3D";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <Loader3D loading={true} />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export { ProtectedRoute };
