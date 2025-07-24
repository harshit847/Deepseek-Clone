import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Paperclip, ArrowUp, Globe, Bot } from "lucide-react";
import logo from "../../public/logo.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

function Promt() {
  const [inputValue, setInputValue] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [promt, setPromt] = useState([]);
  const [loading, setLoading] = useState(false);
  const promtEndRef = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const storedPromt = localStorage.getItem(`promtHistory_${user._id}`);
      if (storedPromt) {
        setPromt(JSON.parse(storedPromt));
      }
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`promtHistory_${user._id}`, JSON.stringify(promt));
    }
  }, [promt]);

  useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promt, loading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setInputValue("");
    setTypeMessage(trimmed);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/deepseekai/promt`,
        { content: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setPromt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setPromt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content: "❌ Something went wrong with the AI response.",
        },
      ]);
    } finally {
      setLoading(false);
      setTypeMessage(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 md:px-6">
      {/* 🔒 Sticky Greeting Header */}
      <div className="sticky top-0 z-10 bg-[#1e1e1e] border-b border-gray-700 pt-6 pb-4">
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="DeepSeek Logo" className="h-6 md:h-8" />
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Hi, I'm DeepSeek.
          </h1>
        </div>
        <p className="text-gray-400 text-base md:text-sm text-center mt-2">
          💬 How can I help you today?
        </p>
      </div>

      {/* 🗨️ Scrollable Chat */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {promt.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="bg-blue-600 text-white rounded-xl px-4 py-3 text-sm w-fit max-w-[70%]">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {/* User typing */}
        {loading && typeMessage && (
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-xl px-4 py-3 text-sm max-w-[70%]">
              {typeMessage}
            </div>
          </div>
        )}

        {/* AI Typing... */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-xl text-sm animate-pulse">
              🤖 Loading...
            </div>
          </div>
        )}

        <div ref={promtEndRef} />
      </div>

      {/* 📝 Input Box */}
      <div className="bg-[#2f2f2f] rounded-2xl px-4 md:px-6 py-6 md:py-8 mt-2 mb-6 shadow-md">
        <input
          type="text"
          placeholder="💬 Message DeepSeek"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent w-full text-white placeholder-gray-400 text-base md:text-lg outline-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
              <Bot className="w-4 h-4" />
              DeepThink (R1)
            </button>
            <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
              <Globe className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Send */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="text-gray-400 hover:text-white transition">
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              className="bg-gray-500 hover:bg-blue-600 p-2 rounded-full text-white transition"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promt;
