import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const CATEGORIES = ['wedding','pre-wedding','post-wedding','modeling','wildlife','event','portrait','fashion','product','travel']
const STATUS_COLORS = { pending: 'text-yellow-400 bg-yellow-900/30', confirmed: 'text-green-400 bg-green-900/30', rejected: 'text-red-400 bg-red-900/30', completed: 'text-blue-400 bg-blue-900/30', cancelled: 'text-gray-400 bg-gray-800' }

export default function PhotographerDashboard() {
  const [tab, setTab] = useState('bookings')
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [profileForm, setProfileForm] = useState({ bio: '', city: '', state: '', country: '', experienceYears: 0, categories: [], instagram: '', website: '' })
  const [uploadForm, setUploadForm] = useState({ category: '', caption: '', file: null })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [prof, book, port] = await Promise.all([
        api.get('/photographers/me'),
        api.get('/bookings/mine'),
        api.get('/portfolio/' + JSON.parse(localStorage.getItem('user'))._id),
      ])
      setProfile(prof.data)
      setBookings(book.data)
      setPortfolio(port.data)
      setProfileForm({
        bio: prof.data.bio || '',
        city: prof.data.location?.city || '',
        state: prof.data.location?.state || '',
        country: prof.data.location?.country || '',
        experienceYears: prof.data.experienceYears || 0,
        categories: prof.data.categories || [],
        instagram: prof.data.socialLinks?.instagram || '',
        website: prof.data.socialLinks?.website || '',
      })
    } catch (e) { console.error(e) }
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    try {
      await api.put('/photographers/profile', {
        bio: profileForm.bio,
        categories: profileForm.categories,
        location: { city: profileForm.city, state: profileForm.state, country: profileForm.country },
        experienceYears: profileForm.experienceYears,
        socialLinks: { instagram: profileForm.instagram, website: profileForm.website },
      })
      toast.success('Profile updated!')
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadForm.file) return toast.error('Please select an image')
    setUploading(true)
    const fd = new FormData()
    fd.append('image', uploadForm.file)
    fd.append('category', uploadForm.category)
    fd.append('caption', uploadForm.caption)
    try {
      await api.post('/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Photo uploaded!')
      setUploadForm({ category: '', caption: '', file: null })
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed') }
    setUploading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status })
      toast.success(`Booking ${status}`)
      fetchAll()
    } catch (err) { toast.error('Failed to update status') }
  }

  const deletePhoto = async (id) => {
    if (!confirm('Delete this photo?')) return
    try { await api.delete(`/portfolio/${id}`); fetchAll(); toast.success('Deleted') }
    catch { toast.error('Delete failed') }
  }

  const toggleCategory = (cat) => {
    setProfileForm(p => ({
      ...p,
      categories: p.categories.includes(cat) ? p.categories.filter(c => c !== cat) : [...p.categories, cat]
    }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Photographer Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-800">
        {[['bookings','📅 Bookings'],['upload','📤 Upload Photo'],['profile','⚙️ Edit Profile'],['portfolio','🖼 My Portfolio']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px ${tab === key ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {tab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 && <p className="text-gray-500 text-center py-16">No booking requests yet</p>}
          {bookings.map(b => (
            <div key={b._id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-sm">{b.customer?.name?.[0]}</div>
                    <div>
                      <p className="font-semibold">{b.customer?.name}</p>
                      <p className="text-xs text-gray-400">{b.customer?.phone || b.customer?.email}</p>
                    </div>
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-400">
                    <div><span className="text-gray-500 text-xs">Type</span><p className="capitalize text-gray-200">{b.category}</p></div>
                    <div><span className="text-gray-500 text-xs">Date</span><p className="text-gray-200">{new Date(b.eventDate).toLocaleDateString()}</p></div>
                    <div><span className="text-gray-500 text-xs">Location</span><p className="text-gray-200">{b.location}</p></div>
                    <div><span className="text-gray-500 text-xs">Budget</span><p className="text-gray-200">{b.budget ? `₹${b.budget}` : 'Not specified'}</p></div>
                  </div>
                  {b.notes && <p className="text-sm text-gray-400 mt-2 italic">"{b.notes}"</p>}
                </div>
                {b.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(b._id, 'confirmed')} className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition">✓ Accept</button>
                    <button onClick={() => updateStatus(b._id, 'rejected')} className="bg-red-800 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition">✗ Reject</button>
                  </div>
                )}
                {b.status === 'confirmed' && (
                  <button onClick={() => updateStatus(b._id, 'completed')} className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div className="max-w-lg">
          <form onSubmit={handleUpload} className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg mb-2">Upload Portfolio Photo</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category *</label>
              <select className="input" value={uploadForm.category} onChange={e => setUploadForm({...uploadForm, category: e.target.value})} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image *</label>
              <input type="file" accept="image/*"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-700 file:text-white file:cursor-pointer hover:file:bg-indigo-600"
                onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})} required />
              {uploadForm.file && (
                <img src={URL.createObjectURL(uploadForm.file)} alt="preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Caption</label>
              <input className="input" placeholder="Describe this shot..." value={uploadForm.caption} onChange={e => setUploadForm({...uploadForm, caption: e.target.value})} />
            </div>
            <button type="submit" disabled={uploading} className="btn-primary w-full py-3">
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </form>
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="max-w-2xl">
          <form onSubmit={saveProfile} className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg mb-2">Edit Profile</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio</label>
              <textarea className="input" rows={4} placeholder="Tell customers about yourself, your style, experience..." value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['city','state','country'].map(f => (
                <div key={f}>
                  <label className="block text-sm text-gray-400 mb-1 capitalize">{f}</label>
                  <input className="input" value={profileForm[f]} onChange={e => setProfileForm({...profileForm, [f]: e.target.value})} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
              <input type="number" className="input" value={profileForm.experienceYears} min={0} onChange={e => setProfileForm({...profileForm, experienceYears: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-3">Your Categories (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button type="button" key={cat} onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${profileForm.categories.includes(cat) ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Instagram URL</label>
                <input className="input" placeholder="https://instagram.com/..." value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website URL</label>
                <input className="input" placeholder="https://yoursite.com" value={profileForm.website} onChange={e => setProfileForm({...profileForm, website: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3">Save Profile</button>
          </form>
        </div>
      )}

      {/* Portfolio Tab */}
      {tab === 'portfolio' && (
        <div>
          <p className="text-gray-400 text-sm mb-4">{portfolio.length} photos uploaded</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map(post => (
              <div key={post._id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800">
                <img src={post.image.url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                  <span className="text-xs text-indigo-300 capitalize bg-indigo-900/70 px-2 py-1 rounded-full">{post.category}</span>
                  <button onClick={() => deletePhoto(post._id)} className="text-xs text-red-400 bg-red-900/70 px-3 py-1 rounded-full hover:bg-red-800 transition">Delete</button>
                </div>
              </div>
            ))}
            {portfolio.length === 0 && <p className="col-span-4 text-center text-gray-500 py-16">No photos uploaded yet. Go to Upload Photo tab to add your first photo!</p>}
          </div>
        </div>
      )}
    </div>
  )
}
