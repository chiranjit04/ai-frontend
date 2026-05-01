import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Result from "./features/exam/result";
import ChatBot from "./features/chat/chatBot";
import Exam from "./features/exam/Exam";
import Admin from "./features/system/admin";

import Login from "./features/auth/login";
import ProtectedRoute from "./features/auth/protectedRoute";
import { AdminRoute } from "./features/auth/adminRoute";
import Header from "./components/header";

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
            <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
              <Header />
              <div
                className={`pt-5 flex h-full transition-transform duration-500 ${
                  showExam ? "-translate-x-1/2" : "translate-x-0"
                }`}
                style={{ width: "200%" }}
              >
                <div className="w-1/2 h-full">
                  <Exam />
                </div>

                <div className="w-1/2 h-full">
                  <ChatBot />
                </div>
              </div>

              <div className="absolute top-1/2 left-1/1 -translate-x-1/2 -translate-y-1/2 z-50">
                <button
                  onClick={() => setShowExam(!showExam)}
                  className="w-10 h-20 flex items-center justify-center bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-full"
                >
                  {showExam ? "❮" : "❯"}
                </button>
              </div>

            </div>
          </ProtectedRoute>
        }
      />

      {/* 🔐 RESULT PAGE (protected) */}
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
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

    </Routes>
  );
}