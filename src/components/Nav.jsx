import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAdminLoggedIn } from "../utils/AuthHelper";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";

function Nav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState("id");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
    setMenuOpen(false); // tutup menu saat route berubah
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    navigate("/");
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  const navLinks = [
    { to: "/", label: i18n.t("nav.home") },
    { to: "/tentang", label: i18n.t("nav.about") },
    { to: "/wisata", label: i18n.t("nav.wisata") },
    { to: "/lawa", label: i18n.t("nav.lawa") },
    { to: "/baluara", label: i18n.t("nav.baluara") },
  ];

  if (isAdmin) {
    navLinks.unshift({ to: "/admin/dashboard", label: "Dashboard" });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#526E48] shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center text-white">
        <h1 className="font-bold text-xl">Benteng Buton</h1>

        {/* Tombol Hamburger untuk mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-[#C2FFC7] transition duration-200 ${
                location.pathname === link.to ? "underline font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isAdmin && (
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent cursor-pointer pr-6 hover:text-[#C2FFC7] transition duration-200 focus:outline-none font-normal text-white"
            >
              <option value="id" className="text-black">
                ID
              </option>
              <option value="en" className="text-black">
                EN
              </option>
            </select>
          )}

          {isAdmin && (
            <button
              onClick={handleLogout}
              className="hover:text-red-300 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="lg:hidden bg-[#526E48] px-4 pt-4 pb-6 text-white space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block hover:text-[#C2FFC7] transition duration-200 ${
                location.pathname === link.to ? "underline font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isAdmin && (
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full mt-2 bg-white text-black px-2 py-1 rounded focus:outline-none"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
            </select>
          )}

          {isAdmin && (
            <button
              onClick={handleLogout}
              className="w-full text-left hover:text-red-300 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;
