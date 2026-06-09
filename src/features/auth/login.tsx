import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { loginUser } from "../../service/auth.service";
import HeroSlider from "../../components/heroSlide";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] =  useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    if (['ADMIN','TUTOR'].includes(response.user.type)) {
      navigate("/tutor");
    } else if (response.user.type === "CANDIDATE") {
      navigate("/");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || "Login failed");
    } else {
      setError("Login failed");
    }
    console.error(err);
  }
};

  return (
    <div className="h-screen overflow-hidden bg-[#e8f3ea] flex items-center justify-center p-2 lg:p-4">
      <div className="w-full max-w-4xl h-[95vh] bg-white rounded-[30px] overflow-hidden shadow-[0_0_80px_rgba(163,201,170,0.45)]">
        <div className="grid h-full lg:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex bg-[#90E29D] flex-col items-center justify-center px-10 relative">
            <img
              src="/bg-img-trans.png"
              alt="Exam Illustration"
              className="w-[65%] max-w-[380px] object-contain"
            />

            <h2 className="mt-6 text-3xl xl:text-4xl font-bold text-slate-800">
             <span className="font-medium text-slate-800">
                    Prep
                  </span>{" "}
                  <span className="text-[#7ca27f]">Pilot</span>
            </h2>

            <HeroSlider />
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#fafafa] flex items-center justify-center overflow-y-auto">
            <div className="w-full max-w-md px-6 xl:px-8 py-6">
              {/* MOBILE HEADER */}
              <div className="lg:hidden text-center mb-4">
                <div className="text-5xl mb-2">🎓</div>

                <h1 className="text-3xl font-bold text-slate-800">
                  Prep Pilot
                </h1>

                <p className="text-gray-500 text-sm mt-2">
                  School & College Examination System
                </p>
              </div>

              {/* LOGO */}
              <div className="text-center mb-8 mt-8">
                <h1 className="text-[38px] xl:text-[48px] font-light tracking-wide">
                  <span className="font-medium text-slate-800">
                    Prep
                  </span>{" "}
                  <span className="text-[#7ca27f]">Pilot</span>
                </h1>

                <p className="text-gray-500 mt-2">
                  Student Examination Portal
                </p>
              </div>

              {/* EMAIL */}
              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-2">
                  Username or Email
                </label>

                <input
                  type="text"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleLogin()
                  }
                  className="w-full h-14 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleLogin()
                    }
                    className="w-full h-14 px-4 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex justify-between items-center mb-5">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() =>
                      setRememberMe(!rememberMe)
                    }
                  />

                  Remember Me
                </label>

                <button
                  type="button"
                  className="text-[#6b8f70] text-sm hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* LOGIN */}
              <button
                onClick={handleLogin}
                className="w-full h-14 bg-[#1f2d3b] hover:bg-[#17212c] text-white font-semibold rounded-lg transition duration-300"
              >
                Sign In
              </button>

              {/* DIVIDER */}
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-300"></div>

                <span className="px-4 text-gray-400 text-sm">
                  OR
                </span>

                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* GOOGLE */}
              {/* <button
                type="button"
                className="w-full h-14 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6"
                />

                <span className="text-gray-700">
                  Sign in with Google
                </span>
              </button> */}

              {/* REGISTER */}
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  New to the platform?
                  <button
                    type="button"
                    className="ml-1 text-[#6b8f70] font-medium hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* FOOTER */}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}