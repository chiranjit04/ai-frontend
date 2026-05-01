import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-10 bg-white/10 backdrop-blur-md border-white/20 flex items-center justify-between px-6 z-50">

      {/* LOGO */}
      <div className="text-white font-semibold text-lg">
        Mock Exam System
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* USER */}
        <span className="text-white text-sm">
          {user?.username}
        </span>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}