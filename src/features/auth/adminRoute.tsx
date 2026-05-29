import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

export const AdminRoute = ({
  children,
}: any) => {
  const user = useSelector(
    (state: any) => state.auth.user
  );

  // NOT LOGGED IN

  if (!user) {
    return <Navigate to="/login" />;
  }

  // NOT ADMIN

  if (user.type !== "ADMIN" && user.type !== "TUTOR") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};