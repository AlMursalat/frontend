import { jwtDecode } from 'jwt-decode'

export function isAdminLoggedIn() {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    return !!decoded?.username
  } catch (err) {
    return false
  }
}
