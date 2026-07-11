import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-indigo-400 tracking-tight">
          📷 PhotoConnect
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Explore</Link>
          {!user ? (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Join Now</Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer'}
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm transition">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
