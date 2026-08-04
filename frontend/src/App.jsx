import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import PhotographerProfile from './pages/PhotographerProfile'
import PhotographerDashboard from './pages/PhotographerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import StyleGuide from './pages/StyleGuide'

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
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/photographer/:id" element={<PhotographerProfile />} />
        <Route path="/style-guide" element={<StyleGuide />} />
        <Route path="/dashboard/photographer" element={<ProtectedRoute role="photographer"><PhotographerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" toastOptions={{
        duration: 3500,
        style: { background: '#17171C', color: '#F4F1EC', border: '1px solid #26262E', borderRadius: '14px', fontSize: '14px', padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' },
        success: { iconTheme: { primary: '#54E08A', secondary: '#0B0B0D' } },
        error: { iconTheme: { primary: '#FB7185', secondary: '#0B0B0D' } },
      }} />
    </BrowserRouter>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
