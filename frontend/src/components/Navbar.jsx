import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false) }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-[#1e1e2e] shadow-xl shadow-black/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#c8a96e] flex items-center justify-center font-bold text-[#0a0a0f] text-base shadow-lg shadow-[#c8a96e]/30">PC</div>
          <span className="font-serif text-lg font-bold text-[#e8e6e1] hidden sm:block">PhotoConnect</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link to="/" className={`text-sm transition-colors ${isActive('/') ? 'text-[#c8a96e]' : 'text-[#9a9890] hover:text-[#e8e6e1]'}`}>Explore</Link>
          <Link to="/?tab=photographers" className="text-sm text-[#9a9890] hover:text-[#e8e6e1] transition-colors">Photographers</Link>
          <Link to="/?tab=feed" className="text-sm text-[#9a9890] hover:text-[#e8e6e1] transition-colors">Feed</Link>
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-[#9a9890] hover:text-[#e8e6e1] transition-colors font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Join Free</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#1e1e2e] transition group">
                <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e] font-bold text-sm overflow-hidden">
                  {user.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" alt="" /> : user.name[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#e8e6e1] leading-none">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-[#4a4a6a] capitalize mt-0.5">{user.role}</p>
                </div>
                <svg className={`w-4 h-4 text-[#4a4a6a] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl shadow-2xl shadow-black/50 py-1 border border-[#2a2a3a] animate-fade-in">
                  <Link to={user.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer'}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#9a9890] hover:text-[#e8e6e1] hover:bg-[#1e1e2e] transition">
                    <span>📊</span> Dashboard
                  </Link>
                  {user.role === 'photographer' && (
                    <Link to="/dashboard/photographer?tab=upload" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#9a9890] hover:text-[#e8e6e1] hover:bg-[#1e1e2e] transition">
                      <span>📤</span> Upload Media
                    </Link>
                  )}
                  <div className="border-t border-[#1e1e2e] mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[#1e1e2e] transition">
          <span className={`w-5 h-0.5 bg-[#9a9890] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#9a9890] transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#9a9890] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#0a0a0f]/98 backdrop-blur-xl border-t border-[#1e1e2e] px-4 py-4 space-y-1">
          {[['/', '🏠 Explore'],['/?tab=photographers','👤 Photographers'],['/?tab=feed','🖼 Photo Feed']].map(([to, label]) => (
            <Link key={to} to={to} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#9a9890] hover:text-[#e8e6e1] hover:bg-[#1e1e2e] transition">{label}</Link>
          ))}
          <div className="border-t border-[#1e1e2e] pt-3 mt-3">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn-ghost btn w-full justify-center py-2.5 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary btn w-full justify-center py-2.5 text-sm">Join Free</Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link to={user.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer'}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#9a9890] hover:text-[#e8e6e1] hover:bg-[#1e1e2e] transition">
                  📊 Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition">
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {dropdownOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setDropdownOpen(false)} />}
    </nav>
  )
}
