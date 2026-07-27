import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import PhotographerProfile from './pages/PhotographerProfile'
import PhotographerDashboard from './pages/PhotographerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/photographer/:id" element={<PhotographerProfile />} />
        <Route path="/dashboard/photographer" element={<ProtectedRoute role="photographer"><PhotographerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" toastOptions={{
        duration: 3500,
        style: { background: '#13131a', color: '#e8e6e1', border: '1px solid #2a2a3a', borderRadius: '14px', fontSize: '14px', padding: '12px 16px' },
        success: { iconTheme: { primary: '#c8a96e', secondary: '#0a0a0f' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#0a0a0f' } },
      }} />
    </BrowserRouter>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
