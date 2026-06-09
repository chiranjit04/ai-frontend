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
    <div className="fixed top-0 left-0 w-full h-10 bg-gradient-to-r from-[#0f172a]/90 via-[#1e293b]/90 to-[#020617]/90 backdrop-blur-md border-white/10 flex items-center justify-between px-6 z-50 shadow-lg">

  {/* LEFT SIDE (LOGO + NAME) */}
  <div className="flex items-center gap-3">

    <img
      src="/logo-img.png"
      alt="Mock Test"
      className="w-10 h-10 object-contain"
    />

    <div className="text-white font-semibold text-lg tracking-wide">
      PREP <span className="text-green-400">PILOT</span>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-4">

    {/* USER */}
    <span className="text-gray-300 text-sm">
      {user?.username}
    </span>

    {/* LOGOUT */}
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition text-sm shadow-md"
    >
      Logout
    </button>
  </div>

</div>
  );
}