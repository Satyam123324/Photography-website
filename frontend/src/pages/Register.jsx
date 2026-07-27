import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STEPS = ['Account Type', 'Personal Info', 'Security']

export default function Register() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ role: 'customer', name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const nextStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return toast.error('Enter your full name')
      if (!form.email.trim()) return toast.error('Enter your email')
      if (!/\S+@\S+\.\S+/.test(form.email)) return toast.error('Enter a valid email')
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      const data = await register(form)
      toast.success(`Welcome to PhotoConnect, ${data.name.split(' ')[0]}! 🎉`)
      navigate(data.role === 'photographer' ? '/dashboard/photographer' : '/dashboard/customer')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const passStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '' }
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    return { score, label: labels[score], color: colors[score] }
  }

  const strength = passStrength(form.password)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-lg animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#c8a96e] flex items-center justify-center font-bold text-[#0a0a0f]">PC</div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#e8e6e1] mb-2">Create your account</h1>
          <p className="text-[#9a9890] text-sm">Join India's premier photography marketplace</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? 'step-done' : i === step ? 'step-active animate-pulse-gold' : 'step-pending'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium transition-colors hidden sm:block ${i === step ? 'text-[#c8a96e]' : 'text-[#4a4a6a]'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-all duration-500 ${i < step ? 'bg-[#c8a96e]' : 'bg-[#2a2a3a]'}`} />}
            </div>
          ))}
        </div>

        <div className="glass p-6 sm:p-8">
          {/* STEP 0 — Role Selection */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-xl font-bold text-[#e8e6e1] mb-2">How will you use PhotoConnect?</h2>
              <p className="text-sm text-[#4a4a6a] mb-6">Choose the account type that fits you best</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { role: 'customer', icon: '🔍', title: 'Client', subtitle: 'Find & book photographers', perks: ['Browse 500+ photographers', 'Book sessions instantly', 'Secure payments', 'Leave reviews'] },
                  { role: 'photographer', icon: '📷', title: 'Photographer', subtitle: 'Showcase your work & get booked', perks: ['Upload photos & videos', 'Get discovered by clients', 'Manage bookings', 'Build your brand'] },
                ].map(({ role, icon, title, subtitle, perks }) => (
                  <button key={role} type="button" onClick={() => set('role', role)}
                    className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${form.role === role ? 'border-[#c8a96e] bg-[#c8a96e]/8 shadow-lg shadow-[#c8a96e]/10' : 'border-[#2a2a3a] hover:border-[#c8a96e]/40 bg-[#0a0a0f]/50'}`}>
                    <div className="text-3xl mb-3">{icon}</div>
                    <div className={`font-bold text-base mb-1 ${form.role === role ? 'text-[#c8a96e]' : 'text-[#e8e6e1]'}`}>{title}</div>
                    <div className="text-xs text-[#4a4a6a] mb-4">{subtitle}</div>
                    <ul className="space-y-1.5">
                      {perks.map(p => <li key={p} className="flex items-center gap-2 text-xs text-[#9a9890]"><span className="text-[#c8a96e] text-xs">✓</span>{p}</li>)}
                    </ul>
                    {form.role === role && <div className="mt-4 text-[10px] text-[#c8a96e] font-semibold uppercase tracking-widest">✦ Selected</div>}
                  </button>
                ))}
              </div>
              <button onClick={nextStep} className="btn-primary btn w-full btn-lg">Continue as {form.role === 'photographer' ? 'Photographer' : 'Client'} →</button>
            </div>
          )}

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#e8e6e1] mb-1">Personal Information</h2>
                <p className="text-sm text-[#4a4a6a]">Tell us a little about yourself</p>
              </div>
              <div>
                <label className="label">Full Name *</label>
                <input className="input-lg" placeholder="e.g. Rahul Sharma"
                  value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" className="input-lg" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="label">Phone Number <span className="text-[#4a4a6a] normal-case font-normal">(optional)</span></label>
                <div className="flex gap-2">
                  <div className="w-16 h-[50px] bg-[#13131a] border border-[#2a2a3a] rounded-xl flex items-center justify-center text-sm text-[#9a9890] shrink-0">+91</div>
                  <input className="input-lg flex-1" placeholder="98765 43210"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(0)} className="btn-ghost btn flex-1 py-3">← Back</button>
                <button onClick={nextStep} className="btn-primary btn flex-1 py-3">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-in space-y-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#e8e6e1] mb-1">Secure Your Account</h2>
                <p className="text-sm text-[#4a4a6a]">Create a strong password to protect your account</p>
              </div>
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-lg pr-14"
                    placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} autoFocus />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#4a4a6a] hover:text-[#9a9890] transition font-medium">
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-[#2a2a3a]'}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength.score >= 3 ? 'text-green-400' : strength.score >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {strength.label} password
                    </p>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {[['8+ chars', form.password.length >= 8],['Uppercase', /[A-Z]/.test(form.password)],['Number', /[0-9]/.test(form.password)],['Symbol', /[^A-Za-z0-9]/.test(form.password)]].map(([label, met]) => (
                    <span key={label} className={`text-[10px] px-2 py-0.5 rounded-full border transition ${met ? 'text-green-400 border-green-800/50 bg-green-900/20' : 'text-[#4a4a6a] border-[#2a2a3a]'}`}>
                      {met ? '✓' : '○'} {label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} className={`input-lg pr-14 ${form.confirmPassword && (form.password === form.confirmPassword ? 'border-green-600/50 focus:border-green-500/60' : 'border-red-600/50 focus:border-red-500/60')}`}
                    placeholder="Re-enter your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#4a4a6a] hover:text-[#9a9890] transition font-medium">
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {form.confirmPassword && (
                  <p className={`text-xs mt-1.5 flex items-center gap-1 ${form.password === form.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                    {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
              <div className="pt-1 space-y-3">
                <button type="submit" disabled={loading || form.password !== form.confirmPassword || form.password.length < 6} className="btn-primary btn w-full btn-lg">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Creating account...</span>
                  ) : `Create Account as ${form.role === 'photographer' ? 'Photographer' : 'Client'}`}
                </button>
                <button type="button" onClick={() => setStep(1)} className="btn-ghost btn w-full py-3 text-sm">← Back</button>
              </div>
              <p className="text-[10px] text-[#4a4a6a] text-center">By creating an account you agree to our Terms of Service and Privacy Policy</p>
            </form>
          )}

          <p className="text-center text-sm text-[#4a4a6a] mt-6">
            Already have an account? <Link to="/login" className="text-[#c8a96e] hover:text-[#d4b98a] font-medium transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
