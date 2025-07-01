import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-6 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout
