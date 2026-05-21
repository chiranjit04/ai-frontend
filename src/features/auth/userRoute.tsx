import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UserRoute = ({ children }: any) => {
  const user = useSelector((state: any) => state.auth.user);

  // ❌ Not logged in
  if (!user) return <Navigate to="/login" />;

  // ❌ Admin not allowed
  if (user.role === "admin") {
    return <Navigate to="/admin" />; // redirect admin away
  }

  // ✅ Only normal users allowed
  return children;
};