import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { addUserMessage, sendMessage } from "../../features/chat/chatSlice";

import dog from "../../assets/dog-icon.png";

export default function ChatBot() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state: RootState) => state.chat);

  const [input, setInput] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!input.trim() && !file) return;

    const formData = new FormData();
    formData.append("message", input);

    if (file) {
      formData.append("file", file);
    }

    dispatch(
      addUserMessage({
        role: "user",
        text: input,
        fileName,
        file,
      }),
    );

    dispatch(sendMessage(formData) as any);

    setInput("");
    setFile(null);
    setFileName("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = messages?.filter((msg) =>
    msg?.text?.toLowerCase().includes(search.toLowerCase()),
  );

  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-[#2a487a] text-white font-sans">
      <div className="relative w-[1300px] h-[700px] rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`border-r flex flex-col border border-[#4b8a9d] rounded-[inherit] pr-5 p-2.5 m-2.5 transition-all duration-300 overflow-hidden ${
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
                onClick={() => {
                  messageRefs.current[i]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
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

        {/* Toggle Button */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
            showSidebar ? "left-[314px]" : "left-[-0.4rem]"
          }`}
        >
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-4 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
          >
            <span
              className={`text-white text-lg transition-transform duration-300 ${showSidebar ? "rotate-180" : ""}`}
            >
              ❯
            </span>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col border border-[#4b8a9d] rounded-[inherit] p-2.5 m-2.5">
          <div className="px-6 border-b border-white/10 flex items-center justify-center">
            <div className="text-2xl font-semibold">Chat</div>
          </div>

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-6 py-4 flex justify-center"
          >
            <div className="w-full max-w-3xl">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  ref={(el) => (messageRefs.current[i] = el)}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`mb-3 px-4 py-2 w-fit max-w-[75%] backdrop-blur-md border border-white/10 ${
                      msg.role === "user"
                        ? "bg-white/20 text-end rounded-t-2xl rounded-bl-2xl rounded-br-none"
                        : "bg-white/10 text-start rounded-t-2xl rounded-bl-none rounded-br-2xl"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    {msg.file && (
                      <div className="mt-2 flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-2 py-1 w-fit">
                        <div className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded text-xs">
                          {msg.file?.type?.includes("pdf") ? "📑" : "📄"}
                        </div>

                        <div className="text-xs">{msg.fileName}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 mt-2">
                  <img src={dog} className="w-10" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-white/10 flex flex-col items-center gap-2">
            {file && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-2 py-1 mb-2">
                <div className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded">
                  {file.type.includes("pdf") ? "📑" : "📄"}
                </div>

                <div className="leading-tight">
                  <p className="text-xs font-medium truncate max-w-[150px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-300">
                    {file.type.includes("pdf") ? "PDF" : "FILE"}
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

            <div className="w-full max-w-2xl relative">
              {/* FILE ICON */}
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

              {/* INPUT */}
              <input
                className="w-full p-3 pl-10 pr-12 rounded-3xl bg-white/10 border border-white/10 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask something..."
              />

              {/* SEND BUTTON */}
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
