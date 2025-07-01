import React from 'react'
import { Link } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FaArrowLeft } from 'react-icons/fa'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 text-center relative">
      
      {/* Animasi Lottie */}
      <div className="w-full max-w-xl mb-6">
        <DotLottieReact
          src="https://lottie.host/ecd52c2d-6ded-491e-a363-f0c201162fe5/RJjPrqJlmt.lottie"
          loop
          autoplay
        />
      </div>

      {/* Teks 404 */}
      <h1 className="text-4xl font-bold text-blue-600 mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-gray-600 text-sm mb-6">
        Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>

      {/* Tombol kembali */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        <FaArrowLeft />
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default NotFound
