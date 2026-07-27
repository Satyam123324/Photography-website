import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`)
      navigate(data.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#c8a96e] flex items-center justify-center font-bold text-[#0a0a0f] shadow-lg shadow-[#c8a96e]/30">PC</div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#e8e6e1] mb-2">Welcome back</h1>
          <p className="text-[#9a9890] text-sm">Sign in to your PhotoConnect account</p>
        </div>

        <div className="glass p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input-lg" placeholder="you@example.com" autoFocus
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label" style={{margin:0}}>Password</label>
                <Link to="/forgot-password" className="text-xs text-[#c8a96e] hover:text-[#d4b98a] transition">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-lg pr-14" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#4a4a6a] hover:text-[#9a9890] transition font-medium">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn w-full btn-lg mt-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-[#4a4a6a] mt-6">
            Don't have an account? <Link to="/register" className="text-[#c8a96e] hover:text-[#d4b98a] font-medium transition">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
