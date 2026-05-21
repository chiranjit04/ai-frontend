import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {

    //  const allowedUsers = JSON.parse(
    //    localStorage.getItem("allowedUsers") || "[]",
    //  );

    //  if (!allowedUsers.includes(username)) {
    //    alert("You are not allowed to take this exam ❌");
    //    return;
    //  }
    // 🔐 simple demo auth
    if (username === "admin" && password === "admin123") {
      dispatch(login({ username, role: "admin" }));
      navigate("/admin");
    } else {
      dispatch(login({ username, role: "user" }));
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="p-6 bg-white rounded-xl w-[300px]">

        <h2 className="text-lg font-bold mb-4">Login</h2>

        <input
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}