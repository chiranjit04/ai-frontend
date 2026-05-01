import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function AdminRoute({ children }: any) {
  const user = useSelector((state: any) => state.auth.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}