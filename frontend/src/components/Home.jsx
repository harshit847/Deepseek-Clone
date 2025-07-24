import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Promt from "./Promt";
import { Menu } from "lucide-react";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#232327] z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:flex-shrink-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="text-xl font-bold">deepseek</div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Promt + messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <Promt />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
