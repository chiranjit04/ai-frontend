import { useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  resetPassword,
} from "../../service/user.service";

export default function ResetPassword() {

  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    );

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const handleSubmit =
    async () => {

      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;
      }

      try {

        await resetPassword(
          token || "",
          password
        );

        navigate(
          "/login"
        );

      } catch (err) {

        console.error(err);
      }
    };

  return (
    <div className="h-screen bg-gradient-to-r from-[#90E29D] to-[#2a487a] flex items-center justify-center bg-slate-900">

      <div className="p-6 bg-white rounded-xl w-[320px]">

        <h2 className="text-lg font-bold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Reset Password
        </button>

      </div>

    </div>
  );
}