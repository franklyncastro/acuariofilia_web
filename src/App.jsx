import { Routes, Route } from 'react-router-dom'
import StorefrontPage from './pages/StorefrontPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import RequireAuth from './components/RequireAuth.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StorefrontPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminDashboardPage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
