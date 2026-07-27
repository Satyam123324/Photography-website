import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STEPS = ['Enter Email', 'Verify OTP', 'New Password']

export default function ForgotPassword() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [otpError, setOtpError] = useState(false)
  const inputRefs = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    if (timer > 0) { const t = setTimeout(() => setTimer(t => t - 1), 1000); return () => clearTimeout(t) }
  }, [timer])

  const sendOTP = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return toast.error('Enter a valid email address')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('OTP sent to your email!')
      setStep(1)
      setTimer(60)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    setOtpError(false)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 6) {
      setOtp(paste.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const verifyOTP = async () => {
    const otpStr = otp.join('')
    if (otpStr.length !== 6) return toast.error('Enter the 6-digit OTP')
    setLoading(true)
    try {
      await api.post('/auth/verify-otp', { email, otp: otpStr })
      toast.success('OTP verified!')
      setStep(2)
    } catch (err) {
      setOtpError(true)
      toast.error(err.response?.data?.message || 'Invalid or expired OTP')
    }
    setLoading(false)
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirmPassword) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, otp: otp.join(''), password })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#c8a96e] flex items-center justify-center font-bold text-[#0a0a0f]">PC</div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#e8e6e1] mb-2">Reset Password</h1>
          <p className="text-[#9a9890] text-sm">We'll send a code to your email</p>
        </div>

        {/* Step bar */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? 'step-done' : i === step ? 'step-active' : 'step-pending'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] hidden sm:block ${i === step ? 'text-[#c8a96e]' : 'text-[#4a4a6a]'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-16 sm:w-20 h-0.5 mx-2 transition-all duration-500 ${i < step ? 'bg-[#c8a96e]' : 'bg-[#2a2a3a]'}`} />}
            </div>
          ))}
        </div>

        <div className="glass p-6 sm:p-8">
          {/* STEP 0 — Email */}
          {step === 0 && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center mb-2">
                <div className="text-5xl mb-3">📧</div>
                <p className="text-sm text-[#9a9890]">Enter the email address linked to your account and we'll send you a 6-digit OTP.</p>
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input-lg" placeholder="you@example.com" autoFocus
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()} />
              </div>
              <button onClick={sendOTP} disabled={loading} className="btn-primary btn w-full btn-lg">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Sending OTP...</span> : 'Send OTP →'}
              </button>
            </div>
          )}

          {/* STEP 1 — OTP */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🔐</div>
                <p className="text-sm text-[#9a9890]">Enter the 6-digit OTP sent to</p>
                <p className="text-[#c8a96e] font-medium text-sm mt-1">{email}</p>
              </div>

              {/* OTP inputs */}
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input key={idx}
                    ref={el => inputRefs.current[idx] = el}
                    type="text" inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2 bg-[#13131a] transition-all duration-200 outline-none
                      ${digit ? 'border-[#c8a96e] text-[#c8a96e] shadow-md shadow-[#c8a96e]/20' : otpError ? 'border-red-500/60' : 'border-[#2a2a3a] text-[#e8e6e1]'}
                      focus:border-[#c8a96e] focus:shadow-md focus:shadow-[#c8a96e]/20`}
                  />
                ))}
              </div>

              {otpError && <p className="text-red-400 text-sm text-center animate-slide-in">Invalid OTP. Please check and try again.</p>}

              <button onClick={verifyOTP} disabled={loading || otp.join('').length !== 6} className="btn-primary btn w-full btn-lg">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Verifying...</span> : 'Verify OTP'}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-[#4a4a6a]">Resend OTP in <span className="text-[#c8a96e] font-mono font-bold">{timer}s</span></p>
                ) : (
                  <button onClick={sendOTP} disabled={loading} className="text-sm text-[#c8a96e] hover:text-[#d4b98a] transition font-medium">Resend OTP</button>
                )}
              </div>

              <button onClick={() => setStep(0)} className="btn-ghost btn w-full py-2.5 text-sm">← Change Email</button>
            </div>
          )}

          {/* STEP 2 — New Password */}
          {step === 2 && (
            <form onSubmit={resetPassword} className="animate-fade-in space-y-5">
              <div className="text-center mb-2">
                <div className="text-5xl mb-3">🔑</div>
                <p className="text-sm text-[#9a9890]">Create a new strong password for your account</p>
              </div>
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-lg pr-14" placeholder="Min. 6 characters" autoFocus
                    value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#4a4a6a] hover:text-[#9a9890] font-medium transition">{showPass ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'}
                    className={`input-lg pr-14 ${confirmPassword && (password === confirmPassword ? 'border-green-600/50' : 'border-red-600/50')}`}
                    placeholder="Re-enter new password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                {confirmPassword && (
                  <p className={`text-xs mt-1.5 ${password === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading || password !== confirmPassword || password.length < 6} className="btn-primary btn w-full btn-lg">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Resetting...</span> : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#4a4a6a] mt-6">
            Remembered it? <Link to="/login" className="text-[#c8a96e] hover:text-[#d4b98a] font-medium transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
