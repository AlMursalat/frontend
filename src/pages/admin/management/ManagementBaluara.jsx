// ManagementBaluara.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../../utils/MapHelper";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Gunakan base URL dari .env
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE = `${BASE_URL}/api/baluara`;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationMarker({ setLatLng }) {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ManagementBaluara() {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [deskripsiEn, setDeskripsiEn] = useState("");
  const [latLng, setLatLng] = useState([-5.4738105, 122.6020628]);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_BASE);
      setData(res.data);
    } catch (err) {
      console.error("Gagal fetch:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && editingId === null)
      return alert("Pilih file gambar terlebih dahulu!");

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("deskripsi", deskripsi);
      formData.append("deskripsi_en", deskripsiEn);
      formData.append("lat", latLng[0]);
      formData.append("lng", latLng[1]);
      if (file) formData.append("gambar", file);

      if (editingId !== null) {
        const res = await axios.put(`${API_BASE}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setData(data.map((item) => (item.id === editingId ? res.data : item)));
      } else {
        const res = await axios.post(API_BASE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setData([res.data, ...data]);
      }

      resetForm();
    } catch (err) {
      console.error("Gagal simpan data:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setDeskripsiEn(item.deskripsi_en || "");
    setLatLng([parseFloat(item.lat), parseFloat(item.lng)]);
    setFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  const resetForm = () => {
    setNama("");
    setDeskripsi("");
    setDeskripsiEn("");
    setLatLng([-5.4738105, 122.6020628]);
    setFile(null);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#526E48]">Manajemen Baluara</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <div>
          <label className="block font-medium">Nama Baluara</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Deskripsi (ID)</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Deskripsi (EN)</label>
          <textarea
            value={deskripsiEn}
            onChange={(e) => setDeskripsiEn(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-2">
            Klik Peta untuk Koordinat
          </label>
          <MapContainer
            center={latLng}
            zoom={16}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
            <LocationMarker setLatLng={setLatLng} />
            <Marker position={latLng} />
          </MapContainer>
          <p className="mt-2 text-sm">
            Lat: {latLng[0]}, Lng: {latLng[1]}
          </p>
        </div>

        <div>
          <label className="block font-medium">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border px-3 py-2 rounded"
            required={editingId === null}
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-4">
          <button
            type="submit"
            className="bg-[#62825D] text-white px-6 py-2 rounded hover:bg-[#526E48]"
          >
            {editingId !== null ? "Simpan Perubahan" : "Tambah"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-collapse bg-white shadow">
          <thead>
            <tr className="bg-[#C2FFC7] text-[#526E48]">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Deskripsi (ID)</th>
              <th className="border px-4 py-2">Deskripsi (EN)</th>
              <th className="border px-4 py-2">Gambar</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{item.nama}</td>
                <td className="border px-2 py-1 text-left align-top max-w-xs">
                  <div className="h-24 overflow-y-auto text-sm text-gray-700 pr-2">
                    {item.deskripsi}
                  </div>
                </td>
                <td className="border px-2 py-1 text-left align-top max-w-xs">
                  <div className="h-24 overflow-y-auto text-sm text-gray-700 pr-2">
                    {item.deskripsi_en || <em className="text-gray-400">-</em>}
                  </div>
                </td>
                <td className="border px-2 py-1">
                  <img
                    src={`${BASE_URL}/uploads/baluara/${item.gambar}`}
                    alt={item.nama}
                    className="w-24 h-16 object-cover rounded mx-auto"
                  />
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagementBaluara;
