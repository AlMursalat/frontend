import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#526E48] text-white mt-10">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Kolom 1: Logo dan Deskripsi */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Benteng Buton</h2>
          <p className="text-sm text-[#C2FFC7]">{t("footer.description")}</p>
        </div>

        {/* Kolom 2: Navigasi */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            {t("footer.explore")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#9EDF9C] transition">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link to="/tentang" className="hover:text-[#9EDF9C] transition">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link to="/wisata" className="hover:text-[#9EDF9C] transition">
                {t("nav.wisata")}
              </Link>
            </li>
            <li>
              <Link to="/lawa" className="hover:text-[#9EDF9C] transition">
                {t("nav.lawa")}
              </Link>
            </li>
            <li>
              <Link to="/baluara" className="hover:text-[#9EDF9C] transition">
                {t("nav.baluara")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Kontak dan Sosial Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            {t("footer.contact")}
          </h3>
          <ul className="text-sm text-[#C2FFC7] space-y-2">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#C2FFC7]" />
              {t("footer.address")}
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#C2FFC7]" />
              {t("footer.email")}
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-[#C2FFC7]" />
              {t("footer.phone")}
            </li>
          </ul>

          <div className="flex gap-4 mt-4 text-[#C2FFC7]">
            <a href="#" className="hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#62825D] mt-8 pt-4 text-center text-xs text-[#C2FFC7]">
        &copy; {new Date().getFullYear()} BentengKeratonButon.{" "}
        {t("footer.copyright")}
      </div>
    </footer>
  );
}

export default Footer;
