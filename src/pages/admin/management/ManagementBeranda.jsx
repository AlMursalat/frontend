import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Ambil BASE_URL dari .env
const BASE_URL = import.meta.env.VITE_BASE_URL;

function ManagementBeranda() {
  const [sliderImage, setSliderImage] = useState(null);
  const [sliderPreview, setSliderPreview] = useState(null);
  const [sliderList, setSliderList] = useState([]);

  const [aboutImage, setAboutImage] = useState(null);
  const [aboutPreview, setAboutPreview] = useState(null);
  const [aboutText, setAboutText] = useState("");
  const [aboutTextEn, setAboutTextEn] = useState("");
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => {
    fetchSliderImages();
    fetchAboutInfo();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/beranda/slider`);
      setSliderList(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Gagal ambil slider:", error);
    }
  };

  const fetchAboutInfo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/beranda/about`);
      const about = res.data;
      setAboutText(about.text || "");
      setAboutTextEn(about.text_en || "");
      setAboutId(about.id || null);
      setAboutPreview(
        about.image ? `${BASE_URL}/uploads/tentang/${about.image}` : null
      );
    } catch (error) {
      console.error("Gagal ambil tentang kami:", error);
    }
  };

  const handleSliderChange = (e) => {
    const file = e.target.files[0];
    setSliderImage(file);
    setSliderPreview(URL.createObjectURL(file));
  };

  const handleAboutImageChange = (e) => {
    const file = e.target.files[0];
    setAboutImage(file);
    setAboutPreview(URL.createObjectURL(file));
  };

  const handleSliderUpload = async () => {
    if (!sliderImage) return alert("Pilih gambar slider terlebih dahulu");
    try {
      const formData = new FormData();
      formData.append("image", sliderImage);
      await axios.post(`${BASE_URL}/api/beranda/slider`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload slider berhasil");
      fetchSliderImages();
      setSliderImage(null);
      setSliderPreview(null);
    } catch (error) {
      console.error("Upload gagal:", error);
      alert("Gagal upload gambar");
    }
  };

  const handleDeleteSlider = async (id) => {
    if (!window.confirm("Yakin ingin menghapus gambar slider ini?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/beranda/slider/${id}`);
      fetchSliderImages();
    } catch (error) {
      console.error("Gagal hapus slider:", error);
      alert("Gagal hapus data slider");
    }
  };

  const handleAboutSave = async () => {
    if (!aboutText.trim() || !aboutTextEn.trim()) {
      return alert("Deskripsi tidak boleh kosong (baik ID maupun EN)");
    }

    try {
      const formData = new FormData();
      if (aboutImage) formData.append("image", aboutImage);
      formData.append("text", aboutText);
      formData.append("text_en", aboutTextEn);
      if (aboutId) formData.append("id", aboutId);

      await axios.post(`${BASE_URL}/api/beranda/about`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Data tentang kami berhasil disimpan");
      fetchAboutInfo();
    } catch (error) {
      console.error("Gagal simpan tentang kami:", error);
      alert("Gagal menyimpan data");
    }
  };

  const handleDeleteAbout = async () => {
    if (!window.confirm("Yakin ingin menghapus data Tentang Kami?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/beranda/about`);
      setAboutText("");
      setAboutTextEn("");
      setAboutPreview(null);
      setAboutImage(null);
      setAboutId(null);
      alert("Tentang Kami berhasil dihapus");
    } catch (error) {
      console.error("Gagal hapus tentang kami:", error);
      alert("Gagal menghapus data");
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-[#526E48]">Manajemen Beranda</h2>

      {/* Upload Slider */}
      <section className="bg-white p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold">Upload Gambar Slider</h3>
        <input type="file" accept="image/*" onChange={handleSliderChange} />
        {sliderPreview && (
          <div className="mt-2">
            <img
              src={sliderPreview}
              alt="Slider Preview"
              className="w-full max-w-md rounded shadow"
            />
          </div>
        )}
        <button
          onClick={handleSliderUpload}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Slider
        </button>

        <h4 className="text-md font-semibold mt-6">Daftar Gambar Slider</h4>
        <table className="w-full border mt-2 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">No</th>
              <th className="border px-2 py-1">Gambar</th>
              <th className="border px-2 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sliderList.map((item, index) => (
              <tr key={item.id}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1 text-center">
                  <img
                    src={`${BASE_URL}/uploads/slider/${item.image_url}`}
                    alt={`slider-${index}`}
                    className="h-20 object-cover mx-auto"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleDeleteSlider(item.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {sliderList.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-3">
                  Belum ada gambar slider
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Tentang Kami */}
      <section className="bg-white p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold">Tentang Kami</h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAboutImageChange}
            />
            {aboutPreview && (
              <img
                src={aboutPreview}
                alt="About Preview"
                className="mt-2 w-full rounded shadow"
              />
            )}
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi (Indonesia)
              </label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={4}
                className="w-full border px-3 py-2 rounded"
                placeholder="Tulis informasi tentang Benteng Keraton di sini..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi (English)
              </label>
              <textarea
                value={aboutTextEn}
                onChange={(e) => setAboutTextEn(e.target.value)}
                rows={4}
                className="w-full border px-3 py-2 rounded"
                placeholder="Write the English version of the description here..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAboutSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            onClick={handleDeleteAbout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </section>
    </div>
  );
}

export default ManagementBeranda;
