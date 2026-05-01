import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="flex gap-8">

        {/* Chat Card */}
        <div
          onClick={() => navigate("/chat")}
          className="w-64 h-40 flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">💬</div>
          <div className="text-lg font-semibold">Chat</div>
        </div>

        {/* Exam Card */}
        <div
          onClick={() => navigate("/exam")}
          className="w-64 h-40 flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:scale-105 transition"
        >
          <div className="text-3xl mb-2">📝</div>
          <div className="text-lg font-semibold">Exam</div>
        </div>

      </div>
    </div>
  );
}