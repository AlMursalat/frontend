import React, { useState } from "react";
import ManagementBeranda from "./management/ManagementBeranda";
import ManagementWisata from "./management/ManagementWisata";
import ManagementLawa from "./management/ManagementLawa";
import ManagementBaluara from "./management/ManagementBaluara";

// ✅ Jika dibutuhkan untuk fetch di masa depan
const BASE_URL = import.meta.env.VITE_BASE_URL;

const menuItems = [
  { key: "beranda", label: "Manajemen Beranda" },
  { key: "wisata", label: "Manajemen Wisata" },
  { key: "lawa", label: "Manajemen Lawa" },
  { key: "baluara", label: "Manajemen Baluara" },
];

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("beranda");

  const renderContent = () => {
    switch (activeMenu) {
      case "wisata":
        return <ManagementWisata />;
      case "lawa":
        return <ManagementLawa />;
      case "baluara":
        return <ManagementBaluara />;
      case "beranda":
      default:
        return <ManagementBeranda />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Tetap */}
      <aside className="w-64 bg-[#62825D] text-white p-4 fixed top-0 left-0 bottom-0 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-[#C2FFC7] hover:text-[#526E48] ${
                activeMenu === item.key
                  ? "bg-[#C2FFC7] text-[#526E48] font-bold"
                  : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Konten yang bisa discroll */}
      <main className="flex-1 ml-64 overflow-y-auto h-screen p-6 bg-white">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
