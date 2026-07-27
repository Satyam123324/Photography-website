import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ICONS = { wedding:'💍','pre-wedding':'🌸','post-wedding':'🥂',modeling:'👗',wildlife:'🦅',event:'🎉',portrait:'🎨',fashion:'✨',product:'📦',travel:'🌍',food:'🍽',architecture:'🏛',sports:'⚽',newborn:'👶',maternity:'🤱' }

export default function PhotographerProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [mediaFilter, setMediaFilter] = useState('all')
  const [showBooking, setShowBooking] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [booking, setBooking] = useState({ category:'', eventDate:'', eventEndDate:'', location:'', budget:'', numberOfHours:'', numberOfPeople:'', notes:'' })

  useEffect(() => {
    const fetch = async () => {
      try {
        const [p, port, rev] = await Promise.all([
          api.get(`/photographers/${id}`),
          api.get(`/portfolio/${id}`),
          api.get(`/reviews/${id}`),
        ])
        setProfile(p.data); setPortfolio(port.data); setReviews(rev.data)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetch()
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to book a photographer')
    setBookingLoading(true)
    try {
      await api.post('/bookings', { photographer: id, ...booking })
      toast.success('Booking request sent! The photographer will respond soon.')
      setShowBooking(false)
      setBooking({ category:'', eventDate:'', eventEndDate:'', location:'', budget:'', numberOfHours:'', numberOfPeople:'', notes:'' })
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed') }
    setBookingLoading(false)
  }

  const filteredMedia = portfolio.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (mediaFilter !== 'all' && p.media?.type !== mediaFilter) return false
    return true
  })

  if (loading) return (
    <div className="min-h-screen pt-16">
      <div className="h-80 shimmer" />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {[...Array(3)].map((_,i) => <div key={i} className={`shimmer rounded-xl h-${i===0?'16':'10'}`} />)}
      </div>
    </div>
  )
  if (!profile) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-5xl mb-4">😕</p><p className="text-[#9a9890]">Photographer not found</p><Link to="/" className="btn-primary btn mt-4">Go Home</Link></div></div>

  const avgRating = reviews.length > 0 ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="min-h-screen pt-16">
      {/* Cover */}
      <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden">
        {profile.coverImage?.url
          ? <img src={profile.coverImage.url} className="w-full h-full object-cover" alt="cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#1e1e2e] to-[#0a0a0f]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 relative pb-20">
        {/* Profile card */}
        <div className="glass p-5 sm:p-7 mb-8">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-[#0a0a0f] bg-[#c8a96e]/10 flex items-center justify-center text-3xl font-bold text-[#c8a96e] overflow-hidden shrink-0 shadow-xl">
              {profile.user?.avatar?.url ? <img src={profile.user.avatar.url} className="w-full h-full object-cover" alt="" /> : profile.user?.name?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#e8e6e1]">{profile.user?.name}</h1>
                  {profile.tagline && <p className="text-[#c8a96e] italic text-sm mt-1">"{profile.tagline}"</p>}
                  <p className="text-[#9a9890] text-sm mt-2 flex items-center gap-1.5">
                    📍 {[profile.location?.city, profile.location?.state, profile.location?.country].filter(Boolean).join(', ') || 'India'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {user && user.role === 'customer' && (
                    <button onClick={() => setShowBooking(true)} className="btn-primary btn px-5 sm:px-7 py-2.5 text-sm">📅 Book Now</button>
                  )}
                  {!user && (
                    <Link to="/login" className="btn-primary btn px-5 sm:px-7 py-2.5 text-sm">Login to Book</Link>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-8 mt-4 pt-4 border-t border-[#1e1e2e]">
                {[
                  { label: 'Photos & Videos', val: portfolio.length, icon: '🖼' },
                  { label: 'Rating', val: avgRating ? `★ ${avgRating}` : 'New', icon: '⭐' },
                  { label: 'Reviews', val: reviews.length, icon: '💬' },
                  { label: 'Experience', val: profile.experienceYears > 0 ? `${profile.experienceYears}yr` : 'New', icon: '🎯' },
                  { label: 'Sessions', val: profile.totalBookings || 0, icon: '📅' },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="text-center">
                    <div className="text-base font-bold text-[#c8a96e]">{val}</div>
                    <div className="text-[10px] text-[#4a4a6a]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && <p className="text-[#9a9890] text-sm mt-5 leading-relaxed border-t border-[#1e1e2e] pt-5">{profile.bio}</p>}

          {/* Categories */}
          {profile.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.categories.map(c => <span key={c} className="tag">{ICONS[c]} {c}</span>)}
            </div>
          )}

          {/* Equipment + Languages */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            {profile.equipmentUsed?.length > 0 && (
              <div><span className="text-[#4a4a6a] text-xs">📷 Equipment: </span><span className="text-[#9a9890] text-xs">{profile.equipmentUsed.join(', ')}</span></div>
            )}
            {profile.languages?.length > 0 && (
              <div><span className="text-[#4a4a6a] text-xs">🗣 Languages: </span><span className="text-[#9a9890] text-xs">{profile.languages.join(', ')}</span></div>
            )}
          </div>

          {/* Highlights */}
          {profile.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.highlights.map(h => (
                <span key={h} className="text-xs bg-[#1e1e2e] text-[#9a9890] px-3 py-1 rounded-full border border-[#2a2a3a]">✦ {h}</span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {(profile.socialLinks?.instagram || profile.socialLinks?.website || profile.socialLinks?.youtube || profile.socialLinks?.facebook) && (
            <div className="flex gap-3 mt-5 pt-4 border-t border-[#1e1e2e] flex-wrap">
              {[['instagram','📸 Instagram'],['website','🌐 Website'],['youtube','▶️ YouTube'],['facebook','👥 Facebook']].map(([key, label]) =>
                profile.socialLinks[key] ? (
                  <a key={key} href={profile.socialLinks[key]} target="_blank" rel="noreferrer"
                    className="text-xs text-[#9a9890] hover:text-[#c8a96e] transition flex items-center gap-1">{label}</a>
                ) : null
              )}
            </div>
          )}

          {/* Pricing */}
          {profile.pricing && profile.pricing.size > 0 && (
            <div className="mt-5 pt-4 border-t border-[#1e1e2e]">
              <p className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-3 font-semibold">Pricing</p>
              <div className="flex flex-wrap gap-3">
                {Array.from(profile.pricing.entries()).map(([cat, price]) => (
                  <div key={cat} className="flex items-center gap-2 bg-[#1e1e2e] px-3 py-2 rounded-xl border border-[#2a2a3a]">
                    <span className="text-xs">{ICONS[cat]}</span>
                    <span className="text-xs text-[#9a9890] capitalize">{cat}</span>
                    <span className="text-xs text-[#c8a96e] font-semibold">₹{Number(price).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h2 className="font-serif text-2xl font-bold text-[#e8e6e1]">Portfolio</h2>
            <div className="flex bg-[#13131a] border border-[#1e1e2e] rounded-lg p-0.5 gap-0.5">
              {[['all','All'],['image','Photos'],['video','Videos']].map(([key,label]) => (
                <button key={key} onClick={() => setMediaFilter(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${mediaFilter===key?'bg-[#1e1e2e] text-[#e8e6e1]':'text-[#4a4a6a] hover:text-[#9a9890]'}`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-5">
            <button onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeCategory==='all'?'bg-[#c8a96e] text-[#0a0a0f]':'bg-[#13131a] border border-[#2a2a3a] text-[#9a9890] hover:border-[#c8a96e]/30'}`}>
              All ({portfolio.length})
            </button>
            {profile.categories?.map(cat => {
              const count = portfolio.filter(p => p.category === cat).length
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${activeCategory===cat?'bg-[#c8a96e] text-[#0a0a0f]':'bg-[#13131a] border border-[#2a2a3a] text-[#9a9890] hover:border-[#c8a96e]/30'}`}>
                  {ICONS[cat]} {cat} ({count})
                </button>
              )
            })}
          </div>

          {filteredMedia.length === 0
            ? <div className="glass p-16 text-center text-[#4a4a6a]">No media in this category</div>
            : <div className="masonry">
                {filteredMedia.map(post => (
                  <div key={post._id} className="masonry-item group relative rounded-xl overflow-hidden bg-[#13131a] cursor-pointer" onClick={() => setLightbox(post)}>
                    {post.media?.type === 'video'
                      ? <>
                          {post.media.thumbnail
                            ? <img src={post.media.thumbnail} className="w-full object-cover group-hover:scale-105 transition duration-500" alt="" />
                            : <div className="w-full h-36 bg-[#1e1e2e] flex items-center justify-center"><span className="text-3xl opacity-30">🎬</span></div>}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#c8a96e] flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                              <span className="text-[#0a0a0f] text-sm ml-0.5">▶</span>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2"><span className="text-[9px] bg-[#0a0a0f]/80 text-[#c8a96e] px-1.5 py-0.5 rounded-full">VIDEO</span></div>
                        </>
                      : <img src={post.media?.url} alt={post.caption} className="w-full object-cover group-hover:scale-105 transition duration-500" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                      {post.caption && <p className="text-xs text-[#9a9890] truncate">{post.caption}</p>}
                    </div>
                  </div>
                ))}
              </div>}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#e8e6e1] mb-5">Client Reviews {reviews.length > 0 && <span className="text-[#c8a96e]">({reviews.length})</span>}</h2>
          {reviews.length === 0
            ? <div className="glass p-12 text-center text-[#4a4a6a]">No reviews yet</div>
            : <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r._id} className="glass p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center text-[#c8a96e] font-bold text-sm shrink-0">
                        {r.customer?.name?.[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-medium text-sm text-[#e8e6e1]">{r.customer?.name}</p>
                          <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s<=r.rating?'text-[#c8a96e]':'text-[#2a2a3a]'}`}>★</span>)}</div>
                        </div>
                        <p className="text-[10px] text-[#4a4a6a] mt-0.5">{new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-[#9a9890] leading-relaxed italic">"{r.comment}"</p>}
                    {r.aspects && Object.values(r.aspects).some(Boolean) && (
                      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#1e1e2e]">
                        {[['quality','Quality'],['communication','Communication'],['punctuality','Punctuality'],['value','Value']].map(([key,label]) =>
                          r.aspects[key] ? (
                            <div key={key} className="text-center">
                              <div className="text-xs text-[#c8a96e] font-semibold">{r.aspects[key]}/5</div>
                              <div className="text-[9px] text-[#4a4a6a]">{label}</div>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-[#0a0a0f]/98 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#1e1e2e] text-[#9a9890] hover:text-white transition flex items-center justify-center z-10">✕</button>
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-4 max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] rounded-2xl overflow-hidden">
              {lightbox.media?.type === 'video'
                ? <video src={lightbox.media.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-2xl" />
                : <img src={lightbox.media?.url} alt="" className="max-w-full max-h-[80vh] object-contain" />}
            </div>
            <div className="md:w-56 space-y-3">
              <div className="glass-dark p-4 space-y-2">
                <span className="tag">{ICONS[lightbox.category]} {lightbox.category}</span>
                {lightbox.media?.type === 'video' && <span className="tag ml-1">🎬 Video</span>}
                {lightbox.caption && <p className="text-sm text-[#9a9890] leading-relaxed mt-2">{lightbox.caption}</p>}
                <p className="text-xs text-[#4a4a6a]">♥ {lightbox.likes?.length || 0} likes</p>
              </div>
              <button onClick={() => setLightbox(null)} className="btn-ghost btn w-full py-2.5 text-sm">Close ✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass w-full max-w-lg p-6 sm:p-8 animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#e8e6e1]">Book a Session</h3>
                <p className="text-sm text-[#4a4a6a] mt-1">with {profile.user?.name}</p>
              </div>
              <button onClick={() => setShowBooking(false)} className="w-8 h-8 rounded-full bg-[#1e1e2e] text-[#9a9890] hover:text-white transition flex items-center justify-center text-sm">✕</button>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="label">Shoot Type *</label>
                <select className="input" value={booking.category} onChange={e => setBooking({...booking, category: e.target.value})} required>
                  <option value="">Select what you need...</option>
                  {profile.categories?.map(c => <option key={c} value={c} className="bg-[#13131a] capitalize">{ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Event Date *</label>
                  <input type="date" className="input" value={booking.eventDate} onChange={e => setBooking({...booking, eventDate: e.target.value})} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input" value={booking.eventEndDate} onChange={e => setBooking({...booking, eventEndDate: e.target.value})} min={booking.eventDate} />
                </div>
              </div>
              <div>
                <label className="label">Location / Venue *</label>
                <input className="input" placeholder="City, venue name or address" value={booking.location} onChange={e => setBooking({...booking, location: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Budget (₹)</label>
                  <input type="number" className="input" placeholder="e.g. 25000" value={booking.budget} onChange={e => setBooking({...booking, budget: e.target.value})} />
                </div>
                <div>
                  <label className="label">Hours Needed</label>
                  <input type="number" className="input" placeholder="e.g. 4" value={booking.numberOfHours} onChange={e => setBooking({...booking, numberOfHours: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Number of People</label>
                <input className="input" placeholder="e.g. Couple, 50 guests..." value={booking.numberOfPeople} onChange={e => setBooking({...booking, numberOfPeople: e.target.value})} />
              </div>
              <div>
                <label className="label">Notes & Requirements</label>
                <textarea className="input resize-none" rows={3} placeholder="Describe your vision, style preferences, special requirements..." value={booking.notes} onChange={e => setBooking({...booking, notes: e.target.value})} />
              </div>
              <button type="submit" disabled={bookingLoading} className="btn-primary btn w-full btn-lg">
                {bookingLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Sending...</span> : '📅 Send Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
