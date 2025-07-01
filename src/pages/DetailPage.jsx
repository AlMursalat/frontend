import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";

// ✅ Ambil BASE_URL dari .env
const BASE_URL = import.meta.env.VITE_BASE_URL;

function DetailPage({ type }) {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id, i18n.language]);

  const fetchDetail = async () => {
    try {
      const lang = i18n.language;
      const res = await axios.get(`${BASE_URL}/api/${type}/${id}?lang=${lang}`);
      setData(res.data);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
    }
  };

  const handleGoNow = () => {
    if (!data?.lat || !data?.lng) return;
    const destination = `${data.lat},${data.lng}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      "_blank"
    );
  };

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-600">
        {t("detail.loading", "Memuat detail...")}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-[#526E48]">
      {/* Gambar */}
      <img
        src={`${BASE_URL}/uploads/${type}/${data.gambar}`}
        alt={data.nama}
        className="w-full h-64 object-cover rounded-lg shadow mb-6"
      />

      {/* Judul dan Deskripsi */}
      <div className="bg-[#F3FFF3] p-6 rounded-lg shadow mb-6">
        <h2 className="text-3xl font-bold mb-4 text-[#526E48]">{data.nama}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {data.deskripsi}
        </p>
      </div>

      {/* Peta */}
      <div className="h-64 mb-6 rounded overflow-hidden shadow">
        <MapContainer
          center={[data.lat, data.lng]}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics'
          />
          <Marker position={[data.lat, data.lng]} />
        </MapContainer>
      </div>

      {/* Tombol */}
      <button
        onClick={handleGoNow}
        className="bg-[#62825D] text-white px-6 py-2 rounded hover:bg-[#526E48]"
      >
        {t("detail.goNow", "Pergi Sekarang?")}
      </button>
    </div>
  );
}

export default DetailPage;
