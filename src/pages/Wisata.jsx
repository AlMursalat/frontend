import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ Ambil BASE_URL dari .env
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Wisata() {
  const { i18n, t } = useTranslation();
  const [wisataList, setWisataList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWisata();
  }, [i18n.language]);

  const fetchWisata = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wisata`);
      const currentLang = i18n.language;

      const data = res.data.map((item) => ({
        id: item.id,
        title: item.nama,
        desc: currentLang.startsWith("en")
          ? item.deskripsi_en || item.deskripsi
          : item.deskripsi || item.deskripsi_en,
        img: `${BASE_URL}/uploads/wisata/${item.gambar}`,
      }));

      setWisataList(data);
    } catch (err) {
      console.error("Gagal fetch wisata:", err);
    }
  };

  return (
    <div className="bg-[#F3FFF3] text-[#526E48] min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#526E48] mb-8 text-center uppercase">
          {t("wisata.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wisataList.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/wisata/${item.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#526E48]">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.desc.length > 50
                    ? `${item.desc.slice(0, 50)}...`
                    : item.desc}
                </p>
              </div>
            </div>
          ))}

          {wisataList.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              {t("wisata.noData")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wisata;
