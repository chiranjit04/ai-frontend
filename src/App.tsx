import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Result from "./features/exam/result";
import ChatBot from "./features/chat/chatBot";
import Exam from "./features/exam/Exam";

import Login from "./features/auth/login";
import ProtectedRoute from "./features/auth/protectedRoute";
import { AdminRoute } from "./features/auth/adminRoute";
import Header from "./components/header";
import { UserRoute } from "./features/auth/userRoute";
import Tutor from "./features/system/tutor";
import NoExam from "./features/exam/no-exam";
import ForgotPassword from "./features/auth/forgot-password";
import ResetPassword from "./features/auth/reset-password";
import Admin from "./features/system/admin";
import { TutorRoute } from "./features/auth/tutorRoute";

export default function App() {
  const [showExam, setShowExam] = useState(false);

  return (
    <Routes>
      {/* 🔐 LOGIN (public) */}
      <Route path="/login" element={<Login />} />

      {/* 🔐 MAIN APP (protected for all users) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UserRoute>
              <div className="pt-10 relative w-full min-h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                <Header />
                <div
                  className={`flex h-full transition-transform translate-x-0 duration-500`}
                  style={{ width: "200%" }}
                >
                  <div className="w-1/2 h-full">
                    <Exam />
                  </div>
                </div>
              </div>
            </UserRoute>
          </ProtectedRoute>
        }
      />

      <Route path="/no-exam" element={<NoExam />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔐 RESULT PAGE (protected) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />

      {/* 🔐 ADMIN ONLY */}
      <Route
        path="/tutor"
        element={
         <TutorRoute>
            {showExam ? <ChatBot /> : <Tutor />}

            <div className="fixed top-1/2 left-1/1 -translate-x-1/2 -translate-y-1/2 z-50">
              <button
                onClick={() => setShowExam(!showExam)}
                className="w-10 h-20 flex items-center justify-center bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-full"
              >
                {showExam ? "❮" : "❯"}
              </button>
            </div>
          </TutorRoute>
        }
      />
    </Routes>
  );
}