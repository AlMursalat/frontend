import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Ambil BASE_URL dari .env
const BASE_URL = import.meta.env.VITE_BASE_URL;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function Tentang() {
  const { t, i18n } = useTranslation();
  const [aboutText, setAboutText] = useState("");
  const [aboutImage, setAboutImage] = useState(null);
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/beranda/about`);
        const lang = i18n.language;

        const selectedText = lang.startsWith("en")
          ? res.data.text_en || res.data.text
          : res.data.text || res.data.text_en;

        setAboutText(selectedText);
        setLoading(false);
        setAboutImage(
          res.data.image
            ? `${BASE_URL}/uploads/tentang/${res.data.image}`
            : null
        );
      } catch (err) {
        console.error("Gagal fetch tentang kami", err);
      }
    };

    const fetchDestinasi = async () => {
      try {
        const [wisataRes, lawaRes, baluaraRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/wisata`),
          axios.get(`${BASE_URL}/api/lawa`),
          axios.get(`${BASE_URL}/api/baluara`),
        ]);

        const all = [
          ...wisataRes.data.map((item) => ({
            id: `wisata-${item.id}`,
            nama: item.nama,
            deskripsi: item.deskripsi,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
          })),
          ...lawaRes.data.map((item) => ({
            id: `lawa-${item.id}`,
            nama: item.nama,
            deskripsi: item.deskripsi,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
          })),
          ...baluaraRes.data.map((item) => ({
            id: `baluara-${item.id}`,
            nama: item.nama,
            deskripsi: item.deskripsi,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
          })),
        ];

        setDestinasi(all);
      } catch (err) {
        console.error("Gagal fetch destinasi", err);
      }
    };

    fetchAbout();
    fetchDestinasi();
  }, [i18n.language]);

  return (
    <div className="bg-[#F3FFF3] text-[#526E48]">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">{t("tentang.title")}</h1>
        <p className="max-w-2xl mx-auto text-sm text-[#526E48]/80">
          {t("tentang.intro")}
        </p>
      </div>

      {/* Section: Info & Image */}
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">
            {t("tentang.missionTitle")}
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            {loading ? t("tentang.mission1") : aboutText}
          </p>
        </div>
        <div className="md:w-1/2">
          {aboutImage ? (
            <img
              src={aboutImage}
              alt={t("tentang.title")}
              className="w-full aspect-square md:aspect-video object-cover rounded shadow-md"
            />
          ) : (
            <div className="w-full aspect-square md:aspect-video bg-gray-200 rounded shadow flex items-center justify-center text-gray-500">
              {t("tentang.noImage")}
            </div>
          )}
        </div>
      </div>

      {/* Section: Lokasi */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {t("tentang.locationTitle")}
        </h2>

        <div className="w-full h-[400px] rounded shadow overflow-hidden">
          <MapContainer
            center={[-5.4738, 122.602]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
            />
            {destinasi.map((item) => (
              <Marker key={item.id} position={[item.lat, item.lng]}>
                <Popup>
                  <strong>{item.nama}</strong>
                  <br />
                  {item.deskripsi.slice(0, 100)}...
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Tentang;
