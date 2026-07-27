import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const STATUS = {
  pending:   { style:'text-yellow-400 bg-yellow-900/20 border-yellow-800/30', label:'⏳ Pending', desc:'Awaiting response' },
  confirmed: { style:'text-emerald-400 bg-emerald-900/20 border-emerald-800/30', label:'✓ Confirmed', desc:'Session is on!' },
  rejected:  { style:'text-red-400 bg-red-900/20 border-red-800/30', label:'✗ Declined', desc:'Try another photographer' },
  completed: { style:'text-blue-400 bg-blue-900/20 border-blue-800/30', label:'✦ Completed', desc:'Session done' },
  cancelled: { style:'text-[#4a4a6a] bg-[#13131a] border-[#2a2a3a]', label:'Cancelled', desc:'You cancelled this' },
}
const ICONS = { wedding:'💍','pre-wedding':'🌸','post-wedding':'🥂',modeling:'👗',wildlife:'🦅',event:'🎉',portrait:'🎨',fashion:'✨',product:'📦',travel:'🌍',food:'🍽',architecture:'🏛',sports:'⚽',newborn:'👶',maternity:'🤱' }

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [review, setReview] = useState({ rating:5, comment:'', aspects:{ quality:5, communication:5, punctuality:5, value:5 } })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(null)

  useEffect(() => {
    api.get('/bookings/mine').then(({ data }) => setBookings(data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try { await api.put(`/bookings/${id}/status`, { status:'cancelled' }); toast.success('Booking cancelled'); setBookings(b => b.map(x => x._id===id ? {...x, status:'cancelled'} : x)) }
    catch { toast.error('Cancel failed') }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setReviewLoading(true)
    try {
      await api.post('/reviews', { bookingId: reviewModal._id, ...review })
      toast.success('Review submitted! Thank you 🙏')
      setReviewModal(null)
      setReview({ rating:5, comment:'', aspects:{ quality:5, communication:5, punctuality:5, value:5 } })
    } catch (err) { toast.error(err.response?.data?.message || 'Submit failed') }
    setReviewLoading(false)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const RATING_LABELS = ['','Poor','Below Average','Average','Good','Excellent!']

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="section-label mb-1">Client</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#e8e6e1]">My Bookings</h1>
          <p className="text-[#4a4a6a] text-sm mt-1">Hello, {user?.name?.split(' ')[0]} 👋</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label:'Total', value: bookings.length, icon:'📅', color:'text-[#c8a96e]' },
            { label:'Pending', value: bookings.filter(b=>b.status==='pending').length, icon:'⏳', color:'text-yellow-400' },
            { label:'Confirmed', value: bookings.filter(b=>b.status==='confirmed').length, icon:'✓', color:'text-emerald-400' },
            { label:'Completed', value: bookings.filter(b=>b.status==='completed').length, icon:'🎉', color:'text-blue-400' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="glass p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className={`font-serif text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-[#9a9890] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          {['all','pending','confirmed','completed','rejected','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition whitespace-nowrap ${filter===f?'bg-[#c8a96e] text-[#0a0a0f]':'bg-[#13131a] border border-[#1e1e2e] text-[#9a9890] hover:border-[#c8a96e]/30'}`}>
              {f === 'all' ? `All (${bookings.length})` : `${f} (${bookings.filter(b=>b.status===f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading
          ? <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="glass p-6 h-32 shimmer" />)}</div>
          : filtered.length === 0
            ? <div className="glass p-16 text-center"><p className="text-4xl mb-4">📷</p><p className="text-[#9a9890] mb-3">{filter==='all'?"You haven't made any bookings yet":`No ${filter} bookings`}</p>{filter==='all'&&<Link to="/" className="btn-primary btn">Find Photographers</Link>}</div>
            : <div className="space-y-4">
                {filtered.map(b => {
                  const info = STATUS[b.status]
                  return (
                    <div key={b._id} className="glass p-5 hover:border-[#c8a96e]/20 transition">
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <Link to={`/photographer/${b.photographer?._id}`} className="flex items-center gap-3 group">
                              <div className="w-11 h-11 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center text-[#c8a96e] font-bold overflow-hidden shrink-0">
                                {b.photographer?.avatar?.url ? <img src={b.photographer.avatar.url} className="w-full h-full object-cover" alt="" /> : b.photographer?.name?.[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-[#e8e6e1] text-sm group-hover:text-[#c8a96e] transition">{b.photographer?.name}</p>
                                <p className="text-xs text-[#4a4a6a]">{b.photographer?.email}</p>
                              </div>
                            </Link>
                            <div className="text-right shrink-0">
                              <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium border whitespace-nowrap block ${info.style}`}>{info.label}</span>
                              <p className="text-[9px] text-[#4a4a6a] mt-1">{info.desc}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0a0f]/50 rounded-xl p-4">
                            <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Type</p><p className="text-xs text-[#e8e6e1] capitalize">{ICONS[b.category]} {b.category}</p></div>
                            <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Date</p><p className="text-xs text-[#e8e6e1]">{new Date(b.eventDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p></div>
                            <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Location</p><p className="text-xs text-[#e8e6e1]">{b.location}</p></div>
                            <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Budget</p><p className="text-xs text-[#c8a96e] font-semibold">{b.budget ? `₹${Number(b.budget).toLocaleString('en-IN')}` : 'Open'}</p></div>
                          </div>
                          {b.notes && <p className="text-xs text-[#9a9890] mt-2 italic bg-[#0a0a0f]/30 rounded-lg px-3 py-2">"{b.notes}"</p>}
                          <p className="text-[10px] text-[#4a4a6a] mt-2">Booked on {new Date(b.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                        </div>

                        <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                          <Link to={`/photographer/${b.photographer?._id}`} className="btn-ghost btn btn-sm text-center">View Profile</Link>
                          {b.status === 'pending' && <button onClick={() => cancelBooking(b._id)} className="btn-danger btn btn-sm">Cancel</button>}
                          {b.status === 'completed' && <button onClick={() => setReviewModal(b)} className="btn-primary btn btn-sm">Leave Review ★</button>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass w-full max-w-md p-6 sm:p-8 animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#e8e6e1]">Share Your Experience</h3>
                <p className="text-xs text-[#4a4a6a] mt-1">with {reviewModal.photographer?.name}</p>
              </div>
              <button onClick={() => setReviewModal(null)} className="w-8 h-8 rounded-full bg-[#1e1e2e] text-[#9a9890] hover:text-white transition flex items-center justify-center">✕</button>
            </div>
            <form onSubmit={submitReview} className="space-y-5">
              {/* Overall rating */}
              <div>
                <label className="label mb-3">Overall Rating *</label>
                <div className="flex gap-2 justify-center">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s}
                      onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => setReview({...review, rating: s})}
                      className={`text-4xl transition-all duration-150 hover:scale-125 ${s <= (hoveredStar||review.rating) ? 'text-[#c8a96e]' : 'text-[#2a2a3a]'}`}>★</button>
                  ))}
                </div>
                <p className={`text-center text-xs mt-1 transition ${review.rating >= 4 ? 'text-emerald-400' : review.rating >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {RATING_LABELS[hoveredStar || review.rating]}
                </p>
              </div>

              {/* Aspect ratings */}
              <div className="bg-[#0a0a0f]/50 rounded-xl p-4 space-y-3">
                <p className="text-xs text-[#4a4a6a] uppercase tracking-widest font-semibold">Rate Specific Aspects</p>
                {[['quality','📸 Photo Quality'],['communication','💬 Communication'],['punctuality','⏰ Punctuality'],['value','💰 Value for Money']].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-[#9a9890] w-32 shrink-0">{label}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button type="button" key={s} onClick={() => setReview({...review, aspects: {...review.aspects, [key]: s}})}
                          className={`text-lg transition-all duration-100 hover:scale-110 ${s <= review.aspects[key] ? 'text-[#c8a96e]' : 'text-[#2a2a3a]'}`}>★</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="label">Your Review</label>
                <textarea className="input resize-none" rows={4}
                  placeholder="How was your experience? Was the photographer professional, creative, and delivered as promised? Help others make the right choice..."
                  value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
              </div>
              <button type="submit" disabled={reviewLoading} className="btn-primary btn w-full btn-lg">
                {reviewLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Submitting...</span> : 'Submit Review ✦'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
