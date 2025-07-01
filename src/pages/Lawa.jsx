import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ Ambil BASE_URL dari environment
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Lawa() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchLawa();
  }, [i18n.language]);

  const fetchLawa = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/lawa`);
      const lang = i18n.language;

      const mapped = res.data.map((item) => ({
        id: item.id,
        title: item.nama,
        desc: lang.startsWith("en")
          ? item.deskripsi_en || item.deskripsi
          : item.deskripsi,
        img: `${BASE_URL}/uploads/lawa/${item.gambar}`,
      }));

      setData(mapped);
    } catch (err) {
      console.error("Gagal fetch data lawa:", err);
    }
  };

  return (
    <div className="bg-[#F3FFF3] text-[#526E48] min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center uppercase mb-10">
          {t("lawa.title") || "Daftar Lawa"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/lawa/${item.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#526E48]">
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

          {data.length === 0 && (
            <p className="text-center col-span-4 text-gray-500">
              {t("lawa.empty") || "Belum ada data Lawa."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lawa;
