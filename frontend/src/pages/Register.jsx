import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await register(form.name, form.email, form.password, form.phone, form.role)
      toast.success('Account created successfully!')
      navigate(data.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join PhotoConnect today</p>
        </div>
        <div className="card p-8">
          {/* Role Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            {['customer', 'photographer'].map(role => (
              <button key={role} type="button"
                onClick={() => setForm({...form, role})}
                className={`flex-1 py-2 rounded-md text-sm font-medium capitalize transition ${form.role === role ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {role === 'customer' ? '🔍 I want to hire' : '📷 I am a photographer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input className="input" placeholder="Your name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone (optional)</label>
              <input className="input" placeholder="+91 9876543210"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" className="input" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
