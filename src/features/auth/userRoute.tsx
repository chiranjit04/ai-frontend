import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UserRoute = ({ children }: any) => {

  const user = useSelector(
    (state: any) => state.auth.user
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.type === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  if (user.type === "TUTOR") {
    return <Navigate to="/tutor" />;
  }

  return children;
};