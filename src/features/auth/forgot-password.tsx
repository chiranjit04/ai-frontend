import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../../service/user.service";

export default function ForgotPassword() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const handleSubmit =
    async () => {

      try {

        const result =
          await forgotPassword(
            email
          );

        navigate(
          `/reset-password?token=${result.token}`
        );

      } catch (err) {

        console.error(err);
      }
    };

  return (
    <div className="h-screen bg-gradient-to-r from-[#90E29D] to-[#2a487a] flex items-center justify-center bg-slate-900">

      <div className="p-6 bg-white rounded-xl w-[320px]">

        <h2 className="text-lg font-bold mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded"
        >
          Continue
        </button>

      </div>

    </div>
  );
}