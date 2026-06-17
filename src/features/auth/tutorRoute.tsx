import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const TutorRoute = ({
  children,
}: any) => {

  const user = useSelector(
    (state: any) => state.auth.user
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.type !== "TUTOR") {
    return <Navigate to="/" />;
  }

  return children;
};