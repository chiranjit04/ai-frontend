import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const user = useSelector((state: any) => state.auth.user);

  if (!user) return <Navigate to="/login" />;

  return children;
}

export function AdminRoute({ children }: any) {
  const user = useSelector((state: any) => state.auth.user);

  if (!user || user.type !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
}