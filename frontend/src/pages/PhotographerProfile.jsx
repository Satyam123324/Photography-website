import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function PhotographerProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showBooking, setShowBooking] = useState(false)
  const [booking, setBooking] = useState({ category: '', eventDate: '', location: '', budget: '', notes: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, port, rev] = await Promise.all([
          api.get(`/photographers/${id}`),
          api.get(`/portfolio/${id}`),
          api.get(`/reviews/${id}`),
        ])
        setProfile(p.data)
        setPortfolio(port.data)
        setReviews(rev.data)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchAll()
  }, [id])

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      await api.post('/bookings', { photographer: id, ...booking })
      toast.success('Booking request sent!')
      setShowBooking(false)
      setBooking({ category: '', eventDate: '', location: '', budget: '', notes: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    }
  }

  const filteredPortfolio = activeCategory === 'all' ? portfolio : portfolio.filter(p => p.category === activeCategory)

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
  if (!profile) return <div className="text-center py-20 text-gray-400">Photographer not found</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Cover */}
      <div className="h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 mb-4">
        {profile.coverImage?.url && <img src={profile.coverImage.url} className="w-full h-full object-cover" alt="cover" />}
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex items-end gap-4 -mt-12">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 border-4 border-gray-950 flex items-center justify-center text-3xl font-bold">
            {profile.user?.avatar?.url ? <img src={profile.user.avatar.url} className="w-full h-full object-cover rounded-2xl" alt="avatar" /> : profile.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.user?.name}</h1>
            <p className="text-gray-400">{profile.location?.city}{profile.location?.city ? ', ' : ''}{profile.location?.state}</p>
          </div>
        </div>
        <div className="md:ml-auto flex flex-col items-end gap-2">
          <div className="flex gap-4 text-center">
            <div><div className="text-xl font-bold text-indigo-400">{portfolio.length}</div><div className="text-xs text-gray-400">Photos</div></div>
            <div><div className="text-xl font-bold text-yellow-400">★ {profile.averageRating || 'New'}</div><div className="text-xs text-gray-400">{profile.totalReviews} reviews</div></div>
            <div><div className="text-xl font-bold text-green-400">{profile.experienceYears}yr</div><div className="text-xs text-gray-400">Experience</div></div>
          </div>
          {user && user.role === 'customer' && (
            <button onClick={() => setShowBooking(true)} className="btn-primary px-8">Book Now</button>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && <p className="text-gray-300 mb-6 leading-relaxed">{profile.bio}</p>}

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {profile.categories?.map(c => (
          <span key={c} className="text-sm bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full capitalize">{c}</span>
        ))}
      </div>

      {/* Portfolio */}
      <h2 className="text-xl font-bold mb-4">Portfolio</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {['all', ...(profile.categories || [])].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {filteredPortfolio.map(post => (
          <div key={post._id} className="aspect-square rounded-xl overflow-hidden bg-gray-800 group relative">
            <img src={post.image.url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            {post.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 translate-y-full group-hover:translate-y-0 transition text-xs text-gray-200">{post.caption}</div>
            )}
          </div>
        ))}
        {filteredPortfolio.length === 0 && <p className="col-span-3 text-center text-gray-500 py-10">No photos in this category yet</p>}
      </div>

      {/* Reviews */}
      <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
      <div className="space-y-4 mb-10">
        {reviews.map(r => (
          <div key={r._id} className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold">{r.customer?.name?.[0]}</div>
              <div>
                <p className="font-medium text-sm">{r.customer?.name}</p>
                <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="ml-auto text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
            </div>
            {r.comment && <p className="text-gray-300 text-sm">{r.comment}</p>}
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500 text-center py-6">No reviews yet</p>}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold">Book {profile.user?.name}</h3>
              <button onClick={() => setShowBooking(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Shoot Type</label>
                <select className="input" value={booking.category} onChange={e => setBooking({...booking, category: e.target.value})} required>
                  <option value="">Select category</option>
                  {profile.categories?.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Event Date</label>
                <input type="date" className="input" value={booking.eventDate} onChange={e => setBooking({...booking, eventDate: e.target.value})} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input className="input" placeholder="City, Venue" value={booking.location} onChange={e => setBooking({...booking, location: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Budget (₹)</label>
                <input type="number" className="input" placeholder="Your budget" value={booking.budget} onChange={e => setBooking({...booking, budget: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Additional Notes</label>
                <textarea className="input" rows={3} placeholder="Tell the photographer about your requirements..." value={booking.notes} onChange={e => setBooking({...booking, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Send Booking Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
