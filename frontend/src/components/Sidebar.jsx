import React, { useEffect, useState } from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar({ onClose }) {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      try {
        const stored = JSON.parse(
          localStorage.getItem(`promtHistory_${user._id}`)
        );
        if (stored && Array.isArray(stored)) {
          const userMessages = stored.filter((msg) => msg.role === "user");
          setHistory(userMessages.reverse()); // latest first
        }
      } catch (err) {
        console.error("Prompt history error:", err);
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert(data.message);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout Failed");
    }
  };

  const handleNewChat = () => {
    if (user) {
      localStorage.removeItem(`promtHistory_${user._id}`);
      setHistory([]);
      window.location.reload(); // optional: reset chat
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-[#232327] text-white overflow-y-auto">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center border-b border-gray-600 mb-4 pb-2">
          <div className="text-2xl font-bold text-white">deepseek</div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 md:hidden" />
          </button>
        </div>

        {/* Chat History */}
        <button
          onClick={handleNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4 transition"
        >
          + New Chat
        </button>

        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">
              No chat history yet.
            </p>
          ) : (
            history.slice(0, 8).map((item, idx) => (
              <div
                key={idx}
                title={item.content}
                onClick={() => navigator.clipboard.writeText(item.content)}
                className="bg-[#2f2f2f] px-3 py-2 rounded cursor-pointer hover:bg-[#3a3a3a] text-sm truncate"
              >
                {item.content}
              </div>
            ))
          )}
        </div>
        </div>


        {/* Footer */}
        <div className="pt-4 border-t border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="https://i.pravatar.cc/32"
              alt="profile"
              className="rounded-full w-8 h-8"
            />
            <span className="text-gray-300 font-bold">
              {user?.firstName || "My Profile"}
            </span>
          </div>

          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
      );
}

      export default Sidebar;
