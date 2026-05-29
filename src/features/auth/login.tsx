import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../service/auth.service";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] =  useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await loginUser({
      email,
      password,
    });

    dispatch(login(response));

    // ROLE BASED REDIRECT
    console.log(response.user.type)
    if (['ADMIN','TUTOR'].includes(response.user.type)) {
      navigate("/tutor");
    } else if (response.user.type === "CANDIDATE") {
      navigate("/exam");
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="p-6 bg-white rounded-xl w-[300px]">

        <h2 className="text-lg font-bold mb-4">Login</h2>

        <input
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
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