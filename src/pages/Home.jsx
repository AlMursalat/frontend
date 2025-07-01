import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Home() {
  const [sliderImages, setSliderImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [aboutText, setAboutText] = useState("");
  const [aboutImage, setAboutImage] = useState(null);
  const [wisataData, setWisataData] = useState([]);
  const [lawaData, setLawaData] = useState([]);
  const [baluaraData, setBaluaraData] = useState([]);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchSlider();
    fetchAbout();
    fetchWisata();
    fetchLawa();
    fetchBaluara();
  }, [i18n.language]);

  const fetchSlider = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/beranda/slider`);
      const images = (res.data || []).map(
        (item) => `${BASE_URL}/uploads/slider/${item.image_url}`
      );
      setSliderImages(images);
    } catch (err) {
      console.error("Gagal fetch slider:", err);
    }
  };

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/beranda/about`);
      const lang = i18n.language;

      const selectedText =
        lang === "en" ? res.data.text_en || res.data.text : res.data.text;

      setAboutText(selectedText || "");
      setAboutImage(
        res.data.image ? `${BASE_URL}/uploads/tentang/${res.data.image}` : null
      );
    } catch (err) {
      console.error("Gagal fetch tentang:", err);
    }
  };

  const fetchWisata = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wisata`);
      const data = res.data.map((item) => ({
        id: item.id,
        title: item.nama,
        desc: item.deskripsi,
        desc_en: item.deskripsi_en,
        img: `${BASE_URL}/uploads/wisata/${item.gambar}`,
        lat: item.lat,
        lng: item.lng,
      }));
      setWisataData(data);
    } catch (err) {
      console.error("Gagal fetch wisata:", err);
    }
  };

  const fetchLawa = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/lawa`);
      const data = res.data.map((item) => ({
        id: item.id,
        title: item.nama,
        desc: item.deskripsi,
        desc_en: item.deskripsi_en,
        img: `${BASE_URL}/uploads/lawa/${item.gambar}`,
        lat: item.lat,
        lng: item.lng,
      }));
      setLawaData(data);
    } catch (err) {
      console.error("Gagal fetch lawa:", err);
    }
  };

  const fetchBaluara = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/baluara`);
      const data = res.data.map((item) => ({
        id: item.id,
        title: item.nama,
        desc: item.deskripsi,
        desc_en: item.deskripsi_en,
        img: `${BASE_URL}/uploads/baluara/${item.gambar}`,
        lat: item.lat,
        lng: item.lng,
      }));
      setBaluaraData(data);
    } catch (err) {
      console.error("Gagal fetch baluara:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages]);

  const sectionCards = [
    {
      title: t("home.wisata.title"),
      path: "/wisata",
      data: wisataData.slice(0, 4),
    },
    {
      title: t("home.lawa.title"),
      path: "/lawa",
      data: lawaData.slice(0, 4),
    },
    {
      title: t("home.baluara.title"),
      path: "/baluara",
      data: baluaraData.slice(0, 4),
    },
  ];

  return (
    <div>
      {/* Slider */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {(sliderImages.length > 0 ? sliderImages : ["/images/slide1.jpg"]).map(
          (img, i) => (
            <div
              key={i}
              className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
                current === i ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={img}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover z-10 relative"
              />
            </div>
          )
        )}
        <button
          onClick={() =>
            setCurrent(
              (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#62825D] text-white px-4 py-2 rounded-full hover:bg-[#526E48]"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % sliderImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#62825D] text-white px-4 py-2 rounded-full hover:bg-[#526E48]"
        >
          ›
        </button>
      </div>

      {/* Tentang Kami */}
      <section className="bg-[#F3FFF3] py-16">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            {aboutImage ? (
              <img
                src={aboutImage}
                alt="Tentang Kami"
                className="w-full aspect-video object-cover rounded shadow-lg"
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded">
                {t("home.noImage")}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 text-[#526E48]">
            <h2 className="text-3xl font-bold mb-4">{t("home.aboutTitle")}</h2>
            <p className="mb-4 text-sm">
              {aboutText
                ? aboutText.length > 200
                  ? `${aboutText.substring(0, 200)}...`
                  : aboutText
                : t("home.aboutDesc")}
            </p>
            <button
              onClick={() => navigate("/tentang")}
              className="bg-[#62825D] text-white px-6 py-2 rounded hover:bg-[#526E48]"
            >
              {t("home.readMore")}
            </button>
          </div>
        </div>
      </section>

      {/* Section Cards */}
      {sectionCards.map((section, index) => (
        <section
          key={index}
          className={index % 2 === 0 ? "bg-white py-14" : "bg-[#F3FFF3] py-14"}
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#526E48] uppercase">
                {section.title}
              </h2>
              <button
                onClick={() => navigate(section.path)}
                className="text-[#62825D] hover:text-[#526E48]"
              >
                {t("home.more")} →
              </button>
            </div>

            {/* Scrollable Destinations */}
            <div className="lg:grid lg:grid-cols-4 lg:gap-6 overflow-x-auto flex gap-4 pb-2 snap-x scroll-smooth no-scrollbar">
              {section.data.map((item) => {
                const deskripsiFinal =
                  i18n.language === "en" && item.desc_en
                    ? item.desc_en
                    : item.desc;

                return (
                  <div
                    key={item.id}
                    className="min-w-[250px] lg:min-w-0 flex-shrink-0 bg-white rounded shadow overflow-hidden cursor-pointer hover:shadow-lg transition snap-start"
                    onClick={() => navigate(`${section.path}/${item.id}`)}
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
                      <p className="text-sm text-gray-600">
                        {deskripsiFinal.length > 50
                          ? `${deskripsiFinal.slice(0, 50)}...`
                          : deskripsiFinal}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Peta Interaktif */}
      <div className="w-full h-[400px]">
        <MapContainer
          center={[-5.4738105, 122.6020628]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
          {[...wisataData, ...lawaData, ...baluaraData].map(
            (item) =>
              item.lat &&
              item.lng && (
                <Marker
                  key={`${item.id}-${item.title}`}
                  position={[parseFloat(item.lat), parseFloat(item.lng)]}
                />
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Home;
