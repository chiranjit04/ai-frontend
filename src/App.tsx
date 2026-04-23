import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  text: string;
  fileName?: string;
  file?: File;
};

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async (): Promise<void> => {
    if (!input.trim() && !file) return;

    const formData = new FormData();
    formData.append("message", input);

    if (file) {
      formData.append("file", file);
    }
    setInput("");
    setFileName("");
    const inputText = structuredClone(input);
    const tempFile = structuredClone(file);
    const userMsg: Message = {
      role: "user",
      text: inputText,
      fileName: fileName,
      file: tempFile,
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setFile(null);
      const botMsg: Message = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error: unknown) {
      const errorMsg: Message = {
        role: "bot",
        text: `❌ Error fetching response ${error}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
    setInput("");
    setFile(null);
  };

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-[#2a487a] text-white font-sans">
      {/* Main Container */}
      <div className="relative w-[1300px] h-[700px] rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl flex overflow-hidden">
        {/* LEFT SIDEBAR (NEW UI ONLY) */}

        <div
          className={`border-r flex flex-col border border-[#4b8a9d] rounded-[inherit] pr-5 p-2.5 m-2.5
  transition-all duration-300 overflow-hidden ${
    showSidebar ? "w-72 opacity-100" : "w-0 opacity-0 m-0 p-0 border-0"
  }`}
        >
          <div className="text-2xl font-semibold mb-4">Threads</div>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-3 py-2 rounded-xl bg-white/10 border border-white/10 outline-none text-sm"
          />

          <div className="space-y-3 overflow-y-auto">
            {filteredMessages.map((msg, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  {msg.role === "user" ? "U" : "B"}
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {msg.role === "user" ? "You" : "Bot"}
                  </p>
                  <p className="text-xs text-gray-300 truncate max-w-[150px]">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
            showSidebar ? "left-[314px]" : "left-[-0.4rem]"
          }`}
        >
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-4 h-16 flex items-center justify-center rounded-full 
    bg-white/10 backdrop-blur-md border border-white/20 
    hover:bg-white/20 transition"
          >
            <span
              className={`text-white text-lg transition-transform duration-300 ${
                showSidebar ? "rotate-180" : "rotate-0"
              }`}
            >
              ❯
            </span>
          </button>
        </div>
        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col border border-[#4b8a9d] rounded-[inherit] p-2.5 m-2.5">
          {/* HEADER */}
          <div className="px-6 border-b border-white/10  flex items-center justify-center">
            <div className="items-center text-2xl font-semibold">Chat</div>
          </div>

          {/* CHAT BOX (UNCHANGED LOGIC) */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-6 py-4 flex justify-center"
          >
            <div className="w-full max-w-3xl">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`mb-3 px-4 py-2 w-fit max-w-[75%] leading-relaxed break-words backdrop-blur-md border border-white/10 ${
                      msg.role === "user"
                        ? "bg-white/20 text-end rounded-t-2xl rounded-bl-2xl rounded-br-none"
                        : "bg-white/10 text-start rounded-t-2xl rounded-bl-none rounded-br-2xl"
                    }`}
                  >
                    <div className="prose prose-sm text-white">
                      <ReactMarkdown>{`${msg.text}`}</ReactMarkdown>

                      {msg.file && (
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-2 py-1 w-fit mt-2">
                          <div className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded">
                            {msg.file?.type?.includes("pdf") ? `📑` : "📄"}
                          </div>

                          <div className="leading-tight">
                            <p className="text-xs font-medium truncate max-w-[150px]">
                              {msg.fileName}
                            </p>
                            <p className="text-[10px] text-gray-300">
                              {msg.file?.type?.includes("pdf") ? "PDF" : "FILE"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                  {/* Dots Animation */}
                  <DogEmoji size={100} />
                  <div className="flex gap-1">
                    
                    <span className="w-2 h-2 bg-blue-400/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-blue-400/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-blue-400/70 rounded-full animate-bounce" />
                    
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* INPUT SECTION (UNCHANGED LOGIC) */}
          <div className="p-4 border-t border-white/10 flex flex-col items-center gap-2">
            {/* FILE PREVIEW */}
            {file && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-2 py-1">
                <div className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded">
                  {file.type.includes("pdf") ? "📑" : "📄"}
                </div>

                <div className="leading-tight">
                  <p className="text-xs font-medium truncate max-w-[150px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-300">
                    {file.type.includes("pdf") ? "📑" : "📄"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setFileName("");
                  }}
                  className="text-gray-300 hover:text-white text-xs ml-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* INPUT */}
            <div className="w-full max-w-2xl relative">
              <label className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                      setFile(selected);
                      setFileName(selected.name);
                    }
                  }}
                />
                📎
              </label>

              <input
                className="w-full p-3 pl-10 pr-12 rounded-3xl bg-white/10 border border-white/10 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleSend();
                }}
              />

              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import dog from "./assets/dog-icon.png";
export const DogEmoji = ({ size = 100 }: { size?: number }) => (
  <img
    src={dog}
    alt="dog"
    width={size}
    height={size}
    className="inline-block align-middle select-none pointer-events-none"
    draggable={false}
  />
);
