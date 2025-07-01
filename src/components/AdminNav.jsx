import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const menu = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/", label: "Beranda" },
  { path: "/tentang", label: "Tentang Kami" },
  { path: "/wisata", label: "Wisata" },
  { path: "/lawa", label: "Lawa" },
  { path: "/baluara", label: "Baluara" },
];

function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("id");

  const isDashboard = location.pathname === "/admin/dashboard";

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#526E48] shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center text-white">
        <h1 className="font-bold text-xl">Benteng Buton</h1>
        <div className="flex gap-6 items-center">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-[#C2FFC7] ${
                location.pathname === item.path ? "underline font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Dropdown Bahasa hanya ditampilkan jika BUKAN di halaman dashboard */}
          {!isDashboard && (
            <div className="relative group">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="appearance-none bg-transparent cursor-pointer pr-6 hover:text-[#C2FFC7] transition duration-200 focus:outline-none font-normal"
              >
                <option value="id" className="text-black">
                  ID
                </option>
                <option value="en" className="text-black">
                  EN
                </option>
              </select>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-white group-hover:text-[#C2FFC7] transition duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          )}

          <button onClick={handleLogout} className="hover:text-[#C2FFC7]">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );  
}

export default AdminNav;
