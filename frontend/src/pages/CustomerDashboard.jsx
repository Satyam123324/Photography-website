import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STATUS_COLORS = { pending: 'text-yellow-400 bg-yellow-900/30', confirmed: 'text-green-400 bg-green-900/30', rejected: 'text-red-400 bg-red-900/30', completed: 'text-blue-400 bg-blue-900/30', cancelled: 'text-gray-400 bg-gray-800' }

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([])
  const [reviewModal, setReviewModal] = useState(null)
  const [review, setReview] = useState({ rating: 5, comment: '' })

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/mine')
      setBookings(data)
    } catch (e) { console.error(e) }
  }

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await api.put(`/bookings/${id}/status`, { status: 'cancelled' })
      toast.success('Booking cancelled')
      fetchBookings()
    } catch { toast.error('Failed to cancel') }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      await api.post('/reviews', { bookingId: reviewModal._id, ...review })
      toast.success('Review submitted!')
      setReviewModal(null)
      setReview({ rating: 5, comment: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review') }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
      <p className="text-gray-400 mb-8">Track and manage your photography sessions</p>

      {bookings.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
          <Link to="/" className="btn-primary">Find Photographers</Link>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b._id} className="card p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center font-bold">
                    {b.photographer?.name?.[0]}
                  </div>
                  <div>
                    <Link to={`/photographer/${b.photographer?._id}`} className="font-semibold hover:text-indigo-400 transition">
                      {b.photographer?.name}
                    </Link>
                    <p className="text-xs text-gray-400">{b.photographer?.email}</p>
                  </div>
                  <span className={`ml-auto text-xs px-3 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gray-500 text-xs block">Type</span><span className="capitalize text-gray-200">{b.category}</span></div>
                  <div><span className="text-gray-500 text-xs block">Date</span><span className="text-gray-200">{new Date(b.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  <div><span className="text-gray-500 text-xs block">Location</span><span className="text-gray-200">{b.location}</span></div>
                  <div><span className="text-gray-500 text-xs block">Budget</span><span className="text-gray-200">{b.budget ? `₹${Number(b.budget).toLocaleString()}` : '—'}</span></div>
                </div>
                {b.notes && <p className="text-sm text-gray-400 mt-2 italic">"{b.notes}"</p>}
              </div>
              <div className="flex flex-col gap-2 justify-center">
                {b.status === 'pending' && (
                  <button onClick={() => cancelBooking(b._id)} className="text-sm text-red-400 border border-red-800 hover:bg-red-900/30 px-4 py-2 rounded-lg transition">Cancel</button>
                )}
                {b.status === 'completed' && (
                  <button onClick={() => setReviewModal(b)} className="btn-primary text-sm py-2 px-4">Leave Review</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold">Review {reviewModal.photographer?.name}</h3>
              <button onClick={() => setReviewModal(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button type="button" key={star} onClick={() => setReview({...review, rating: star})}
                      className={`text-2xl transition ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Review</label>
                <textarea className="input" rows={4} placeholder="Share your experience..."
                  value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
