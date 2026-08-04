import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './ui/Avatar'

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/explore?type=photographers', label: 'Photographers' },
  { to: '/how-it-works', label: 'How it works' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    fn()
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false) }
  const dashPath = user?.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer'
  const isActive = (path) => location.pathname === path.split('?')[0]

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/85 backdrop-blur-xl border-b border-line shadow-soft' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-clay flex items-center justify-center font-bold text-white text-base shadow-clay">PC</div>
          <span className="font-serif text-lg font-bold text-ink hidden sm:block">PhotoConnect</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={label} to={to}
              className={`text-sm px-3.5 py-2 rounded-full transition-colors font-medium ${isActive(to) ? 'text-clay-dark bg-clay-soft' : 'text-ink-muted hover:text-ink hover:bg-cream-200'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-ink-muted hover:text-ink transition-colors font-medium">Sign in</Link>
              <Link to="/register" className="btn-primary btn-sm">Join free</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 p-1.5 pr-2 rounded-full hover:bg-cream-200 transition">
                <Avatar src={user.avatar?.url} name={user.name} size="sm" />
                <div className="text-left">
                  <p className="text-sm font-medium text-ink leading-none">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-ink-faint capitalize mt-0.5">{user.role}</p>
                </div>
                <svg className={`w-4 h-4 text-ink-faint transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface rounded-2xl shadow-lift py-1.5 border border-line animate-scale-in">
                  <Link to={dashPath} onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-cream-200 transition">
                    <span>📊</span> Dashboard
                  </Link>
                  {user.role === 'photographer' && (
                    <Link to="/dashboard/photographer?tab=upload" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-cream-200 transition">
                      <span>📤</span> Upload media
                    </Link>
                  )}
                  <div className="border-t border-line mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose hover:bg-rose-soft transition">
                      <span>🚪</span> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-cream-200 transition">
          <span className={`w-5 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-cream/95 backdrop-blur-xl border-t border-line px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={label} to={to} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-cream-200 transition">{label}</Link>
          ))}
          <div className="border-t border-line pt-3 mt-3">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn-ghost w-full justify-center py-2.5 text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary w-full justify-center py-2.5 text-sm">Join free</Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link to={dashPath} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-cream-200 transition">📊 Dashboard</Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-rose hover:bg-rose-soft transition">🚪 Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {dropdownOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setDropdownOpen(false)} />}
    </nav>
  )
}
