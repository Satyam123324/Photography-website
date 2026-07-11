import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
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
        <Route path="/photographer/:id" element={<PhotographerProfile />} />
        <Route path="/dashboard/photographer" element={
          <ProtectedRoute role="photographer"><PhotographerDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/customer" element={
          <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
        } />
      </Routes>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' } }} />
    </BrowserRouter>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
