import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import { isAdminLoggedIn } from '../utils/AuthHelper'

function AdminLayout() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <>
      <AdminNav />
      <div className="pt-24 px-4">
        <Outlet />
      </div>
    </>
  )
}

export default AdminLayout
