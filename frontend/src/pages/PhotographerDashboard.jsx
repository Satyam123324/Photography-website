import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CATS = ['wedding','pre-wedding','post-wedding','modeling','wildlife','event','portrait','fashion','product','travel','food','architecture','sports','newborn','maternity']
const ICONS = { wedding:'💍','pre-wedding':'🌸','post-wedding':'🥂',modeling:'👗',wildlife:'🦅',event:'🎉',portrait:'🎨',fashion:'✨',product:'📦',travel:'🌍',food:'🍽',architecture:'🏛',sports:'⚽',newborn:'👶',maternity:'🤱' }
const STATUS = { pending:'text-yellow-400 bg-yellow-900/20 border-yellow-800/30', confirmed:'text-emerald-400 bg-emerald-900/20 border-emerald-800/30', rejected:'text-red-400 bg-red-900/20 border-red-800/30', completed:'text-blue-400 bg-blue-900/20 border-blue-800/30', cancelled:'text-[#4a4a6a] bg-[#13131a] border-[#2a2a3a]' }

const EQUIP_OPTIONS = ['Canon 5D Mark IV','Canon R5','Nikon D850','Nikon Z9','Sony A7 III','Sony A7R V','Fujifilm X-T4','GoPro Hero 11','DJI Drone','50mm Lens','85mm Lens','24-70mm Lens','70-200mm Lens','Ring Light','Softbox','Godox Flash']
const LANG_OPTIONS = ['Hindi','English','Tamil','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Urdu']

export default function PhotographerDashboard() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('bookings')
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [pf, setPf] = useState({ bio:'',tagline:'',city:'',state:'',country:'India',pincode:'',experienceYears:0,categories:[],instagram:'',website:'',youtube:'',facebook:'',equipmentUsed:[],languages:[],highlights:'' })
  const [pricing, setPricing] = useState({})
  const [upload, setUpload] = useState({ category:'',caption:'',tags:'',file:null,preview:null,isVideo:false })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [prof, book, port] = await Promise.all([
        api.get('/photographers/me'),
        api.get('/bookings/mine'),
        api.get(`/portfolio/${user._id}`),
      ])
      setProfile(prof.data)
      setBookings(book.data)
      setPortfolio(port.data)
      const p = prof.data
      setPf({
        bio: p.bio||'', tagline: p.tagline||'',
        city: p.location?.city||'', state: p.location?.state||'', country: p.location?.country||'India', pincode: p.location?.pincode||'',
        experienceYears: p.experienceYears||0,
        categories: p.categories||[],
        instagram: p.socialLinks?.instagram||'', website: p.socialLinks?.website||'', youtube: p.socialLinks?.youtube||'', facebook: p.socialLinks?.facebook||'',
        equipmentUsed: p.equipmentUsed||[], languages: p.languages||[],
        highlights: (p.highlights||[]).join('\n'),
      })
      const pr = {}
      if (p.pricing) p.pricing.forEach((v,k) => { pr[k] = v })
      setPricing(pr)
    } catch (e) { console.error(e) }
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/photographers/profile', {
        bio: pf.bio, tagline: pf.tagline, categories: pf.categories,
        location: { city: pf.city, state: pf.state, country: pf.country, pincode: pf.pincode },
        experienceYears: Number(pf.experienceYears), pricing,
        socialLinks: { instagram: pf.instagram, website: pf.website, youtube: pf.youtube, facebook: pf.facebook },
        equipmentUsed: pf.equipmentUsed, languages: pf.languages,
        highlights: pf.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      })
      toast.success('Profile saved!')
      fetchAll()
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const isVideo = file.type.startsWith('video/')
    setUpload({ ...upload, file, isVideo, preview: isVideo ? null : URL.createObjectURL(file) })
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!upload.file) return toast.error('Select a photo or video')
    if (!upload.category) return toast.error('Select a category')
    setUploading(true); setUploadProgress(0)
    const fd = new FormData()
    fd.append('media', upload.file)
    fd.append('category', upload.category)
    fd.append('caption', upload.caption)
    fd.append('tags', upload.tags)
    try {
      await api.post('/portfolio', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round(e.loaded * 100 / e.total)),
      })
      toast.success('Uploaded successfully!')
      setUpload({ category:'',caption:'',tags:'',file:null,preview:null,isVideo:false })
      setUploadProgress(0)
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed') }
    setUploading(false)
  }

  const handleAvatarUpload = async (file) => {
    setAvatarUploading(true)
    const fd = new FormData(); fd.append('image', file)
    try {
      const { data } = await api.post('/auth/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      updateUser({ avatar: data.avatar })
      toast.success('Profile photo updated!')
      fetchAll()
    } catch { toast.error('Avatar upload failed') }
    setAvatarUploading(false)
  }

  const handleCoverUpload = async (file) => {
    const fd = new FormData(); fd.append('image', file)
    try {
      await api.post('/photographers/cover', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Cover photo updated!')
      fetchAll()
    } catch { toast.error('Cover upload failed') }
  }

  const updateStatus = async (id, status) => {
    try { await api.put(`/bookings/${id}/status`, { status }); toast.success(`Booking ${status}`); fetchAll() }
    catch { toast.error('Update failed') }
  }

  const deleteMedia = async (id) => {
    if (!confirm('Delete this permanently?')) return
    try { await api.delete(`/portfolio/${id}`); fetchAll(); toast.success('Deleted') }
    catch { toast.error('Delete failed') }
  }

  const toggleCat = (c) => setPf(p => ({ ...p, categories: p.categories.includes(c) ? p.categories.filter(x => x!==c) : [...p.categories, c] }))
  const toggleEquip = (e) => setPf(p => ({ ...p, equipmentUsed: p.equipmentUsed.includes(e) ? p.equipmentUsed.filter(x => x!==e) : [...p.equipmentUsed, e] }))
  const toggleLang = (l) => setPf(p => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x!==l) : [...p.languages, l] }))

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="section-label mb-1">Photographer</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#e8e6e1]">Studio Dashboard</h1>
            <p className="text-[#4a4a6a] text-sm mt-1">Hello, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          {!profile?.profileCompleted && (
            <div className="bg-[#c8a96e]/10 border border-[#c8a96e]/30 text-[#c8a96e] text-xs px-4 py-2 rounded-xl flex items-center gap-2">
              ⚠️ Complete your profile to appear in search results
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label:'Total Media', value: portfolio.length, icon:'🖼', sub:`${portfolio.filter(p=>p.media?.type==='video').length} videos` },
            { label:'Total Bookings', value: bookings.length, icon:'📅', sub:`${pendingCount} pending` },
            { label:'Confirmed', value: bookings.filter(b=>b.status==='confirmed').length, icon:'✓', sub:'Active sessions' },
            { label:'Completed', value: bookings.filter(b=>b.status==='completed').length, icon:'🎉', sub:'Happy clients' },
          ].map(({ label, value, icon, sub }) => (
            <div key={label} className="glass p-4 text-center hover:border-[#c8a96e]/20 transition cursor-default">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-serif text-2xl font-bold text-[#c8a96e]">{value}</div>
              <div className="text-xs font-medium text-[#9a9890] mt-0.5">{label}</div>
              <div className="text-[10px] text-[#4a4a6a] mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#13131a] border border-[#1e1e2e] rounded-xl p-1 mb-8 overflow-x-auto">
          {[['bookings',`📅 Bookings`,pendingCount],['upload','📤 Upload Media',0],['portfolio','🖼 Portfolio',0],['profile','⚙️ Profile',0]].map(([key,label,badge]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap flex-1 justify-center ${tab===key?'bg-[#c8a96e] text-[#0a0a0f] shadow-lg shadow-[#c8a96e]/20':'text-[#9a9890] hover:text-[#e8e6e1]'}`}>
              {label}
              {badge > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab===key?'bg-[#0a0a0f]/20':'bg-red-500 text-white'}`}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 && <div className="glass p-16 text-center"><p className="text-4xl mb-3">📅</p><p className="text-[#9a9890]">No bookings yet. Complete your profile to get discovered!</p></div>}
            {bookings.map(b => (
              <div key={b._id} className="glass p-5 hover:border-[#c8a96e]/20 transition">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center text-[#c8a96e] font-bold shrink-0">
                          {b.customer?.avatar?.url ? <img src={b.customer.avatar.url} className="w-full h-full rounded-xl object-cover" alt="" /> : b.customer?.name?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[#e8e6e1] text-sm">{b.customer?.name}</p>
                          <p className="text-xs text-[#4a4a6a]">{b.customer?.email}</p>
                          {b.customer?.phone && <p className="text-xs text-[#4a4a6a]">📞 {b.customer.phone}</p>}
                        </div>
                      </div>
                      <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full capitalize font-medium border whitespace-nowrap ${STATUS[b.status]}`}>{b.status}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0a0f]/50 rounded-xl p-4 text-sm">
                      <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Type</p><p className="text-[#e8e6e1] capitalize text-xs">{ICONS[b.category]} {b.category}</p></div>
                      <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Date</p><p className="text-[#e8e6e1] text-xs">{new Date(b.eventDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p></div>
                      <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Location</p><p className="text-[#e8e6e1] text-xs">{b.location}</p></div>
                      <div><p className="text-[10px] text-[#4a4a6a] uppercase mb-1">Budget</p><p className="text-[#c8a96e] text-xs font-semibold">{b.budget ? `₹${Number(b.budget).toLocaleString('en-IN')}` : 'Open'}</p></div>
                    </div>
                    {b.numberOfHours && <p className="text-xs text-[#4a4a6a] mt-2">⏱ {b.numberOfHours} hours · {b.numberOfPeople && `👥 ${b.numberOfPeople}`}</p>}
                    {b.notes && <p className="text-xs text-[#9a9890] mt-2 italic bg-[#0a0a0f]/30 rounded-lg px-3 py-2">"{b.notes}"</p>}
                  </div>
                  {b.status === 'pending' && (
                    <div className="flex lg:flex-col gap-2 shrink-0">
                      <button onClick={() => updateStatus(b._id,'confirmed')} className="flex-1 lg:flex-none bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-400 border border-emerald-800/40 text-xs px-4 py-2.5 rounded-xl transition font-medium">✓ Accept</button>
                      <button onClick={() => updateStatus(b._id,'rejected')} className="flex-1 lg:flex-none bg-red-900/20 hover:bg-red-800/40 text-red-400 border border-red-800/30 text-xs px-4 py-2.5 rounded-xl transition font-medium">✗ Decline</button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => updateStatus(b._id,'completed')} className="shrink-0 bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 border border-blue-800/40 text-xs px-4 py-2.5 rounded-xl transition font-medium h-fit">Mark Done ✓</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UPLOAD */}
        {tab === 'upload' && (
          <div className="max-w-xl">
            <form onSubmit={handleUpload} className="glass p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#e8e6e1] mb-1">Upload to Portfolio</h2>
                <p className="text-xs text-[#4a4a6a]">Photos (JPG, PNG, WebP, HEIC) and Videos (MP4, MOV, AVI, MKV) supported</p>
              </div>

              <div>
                <label className="label">Category *</label>
                <select className="input" value={upload.category} onChange={e => setUpload({...upload, category: e.target.value})} required>
                  <option value="">Select category...</option>
                  {CATS.map(c => <option key={c} value={c} className="bg-[#13131a] capitalize">{ICONS[c]} {c}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Photo or Video *</label>
                <label className="block w-full border-2 border-dashed border-[#2a2a3a] hover:border-[#c8a96e]/40 rounded-2xl cursor-pointer transition group overflow-hidden">
                  <input type="file" accept="image/*,video/*,.heic,.raw,.cr2,.nef" className="hidden" onChange={handleFileChange} />
                  {upload.preview ? (
                    <img src={upload.preview} className="w-full h-56 object-cover" alt="preview" />
                  ) : upload.isVideo && upload.file ? (
                    <div className="h-44 flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center text-2xl">🎬</div>
                      <div className="text-center">
                        <p className="text-sm text-[#c8a96e] font-medium">{upload.file.name}</p>
                        <p className="text-xs text-[#4a4a6a] mt-1">{(upload.file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#1e1e2e] group-hover:bg-[#c8a96e]/10 border border-[#2a2a3a] group-hover:border-[#c8a96e]/30 flex items-center justify-center text-2xl transition">📸</div>
                      <div className="text-center">
                        <p className="text-sm text-[#9a9890]">Click to upload photo or video</p>
                        <p className="text-xs text-[#4a4a6a] mt-1">Max 500MB for videos</p>
                      </div>
                    </div>
                  )}
                </label>
                {(upload.preview || (upload.isVideo && upload.file)) && (
                  <button type="button" onClick={() => setUpload({...upload, file:null, preview:null, isVideo:false})} className="text-xs text-red-400 hover:text-red-300 mt-2 transition">✕ Remove</button>
                )}
              </div>

              {upload.file && (
                <>
                  <div>
                    <label className="label">Caption</label>
                    <textarea className="input resize-none" rows={2} placeholder="Describe the shot or tell its story..." value={upload.caption} onChange={e => setUpload({...upload, caption: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Tags <span className="text-[#4a4a6a] normal-case font-normal">(comma separated)</span></label>
                    <input className="input" placeholder="e.g. outdoor, golden hour, candid" value={upload.tags} onChange={e => setUpload({...upload, tags: e.target.value})} />
                  </div>
                </>
              )}

              {uploading && (
                <div>
                  <div className="flex justify-between text-xs text-[#9a9890] mb-1">
                    <span>Uploading{upload.isVideo ? ' video' : ''}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c8a96e] transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={uploading || !upload.file || !upload.category} className="btn-primary btn w-full btn-lg disabled:opacity-40">
                {uploading ? `Uploading... ${uploadProgress}%` : `Upload ${upload.isVideo ? 'Video' : 'Photo'}`}
              </button>
            </form>
          </div>
        )}

        {/* PORTFOLIO */}
        {tab === 'portfolio' && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-[#4a4a6a]">{portfolio.length} items · {portfolio.filter(p=>p.media?.type==='image').length} photos · {portfolio.filter(p=>p.media?.type==='video').length} videos</p>
            </div>
            {portfolio.length === 0
              ? <div className="glass p-16 text-center"><p className="text-4xl mb-3">📷</p><p className="text-[#9a9890] mb-4">No media yet</p><button onClick={() => setTab('upload')} className="btn-primary btn">Upload First Media</button></div>
              : <div className="masonry">
                  {portfolio.map(post => (
                    <div key={post._id} className="masonry-item group relative rounded-xl overflow-hidden bg-[#13131a]">
                      {post.media?.type === 'video'
                        ? <div className="relative">
                            {post.media.thumbnail ? <img src={post.media.thumbnail} className="w-full object-cover" alt="" /> : <div className="w-full h-36 bg-[#1e1e2e] flex items-center justify-center"><span className="text-3xl opacity-30">🎬</span></div>}
                            <div className="absolute top-2 left-2"><span className="text-[9px] bg-[#0a0a0f]/80 text-[#c8a96e] px-1.5 py-0.5 rounded-full">VIDEO</span></div>
                          </div>
                        : <img src={post.media?.url} alt={post.caption} className="w-full object-cover group-hover:scale-105 transition duration-500" />}
                      <div className="absolute inset-0 bg-[#0a0a0f]/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-3">
                        <span className="tag text-[10px]">{ICONS[post.category]} {post.category}</span>
                        {post.caption && <p className="text-[10px] text-[#9a9890] text-center line-clamp-2">{post.caption}</p>}
                        <button onClick={() => deleteMedia(post._id)} className="text-xs text-red-400 bg-red-900/50 px-3 py-1.5 rounded-full hover:bg-red-800/70 transition mt-1">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <form onSubmit={saveProfile} className="space-y-6 max-w-2xl">
            {/* Avatar & Cover */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Photos</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center">
                  <p className="label mb-3">Profile Photo</p>
                  <label className="cursor-pointer block">
                    <div className="w-20 h-20 rounded-2xl bg-[#c8a96e]/10 border-2 border-dashed border-[#c8a96e]/30 hover:border-[#c8a96e]/60 flex items-center justify-center text-2xl font-bold text-[#c8a96e] overflow-hidden mx-auto transition relative">
                      {user?.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" alt="" /> : user?.name?.[0]?.toUpperCase()}
                      {avatarUploading && <div className="absolute inset-0 bg-[#0a0a0f]/70 flex items-center justify-center"><span className="w-5 h-5 border-2 border-[#c8a96e]/30 border-t-[#c8a96e] rounded-full animate-spin" /></div>}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleAvatarUpload(e.target.files[0])} />
                    <p className="text-[10px] text-[#4a4a6a] mt-2">Click to change</p>
                  </label>
                </div>
                <div className="flex-1">
                  <p className="label mb-3">Cover Photo</p>
                  <label className="cursor-pointer block w-full h-24 rounded-xl border-2 border-dashed border-[#2a2a3a] hover:border-[#c8a96e]/40 overflow-hidden transition relative">
                    {profile?.coverImage?.url ? <img src={profile.coverImage.url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[#4a4a6a] text-xs">Click to upload cover</div>}
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleCoverUpload(e.target.files[0])} />
                  </label>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Basic Info</h3>
              <div>
                <label className="label">Tagline <span className="text-[#4a4a6a] normal-case font-normal">(shown on your card)</span></label>
                <input className="input" placeholder="e.g. Capturing love stories across India" value={pf.tagline} onChange={e => setPf({...pf, tagline: e.target.value})} maxLength={150} />
              </div>
              <div>
                <label className="label">Bio <span className="text-[#4a4a6a] normal-case font-normal">(max 2000 chars)</span></label>
                <textarea className="input resize-none" rows={5} placeholder="Tell clients about your style, experience, passion, and what makes your photography unique..." value={pf.bio} onChange={e => setPf({...pf, bio: e.target.value})} maxLength={2000} />
                <p className="text-[10px] text-[#4a4a6a] text-right mt-1">{pf.bio.length}/2000</p>
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input type="number" min={0} max={60} className="input" value={pf.experienceYears} onChange={e => setPf({...pf, experienceYears: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[['city','City'],['state','State'],['country','Country'],['pincode','Pincode']].map(([key, label]) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input className="input" placeholder={label} value={pf[key]} onChange={e => setPf({...pf, [key]: e.target.value})} />
                  </div>
                ))}
              </div>
              <div>
                <label className="label">Highlights <span className="text-[#4a4a6a] normal-case font-normal">(one per line)</span></label>
                <textarea className="input resize-none" rows={3} placeholder={"500+ weddings shot\nFeatured in Vogue India\nDJI certified drone pilot"} value={pf.highlights} onChange={e => setPf({...pf, highlights: e.target.value})} />
              </div>
            </div>

            {/* Specialities */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Specialities</h3>
              <div className="flex flex-wrap gap-2">
                {CATS.map(c => (
                  <button type="button" key={c} onClick={() => toggleCat(c)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium capitalize transition ${pf.categories.includes(c)?'bg-[#c8a96e] text-[#0a0a0f] shadow-md shadow-[#c8a96e]/20':'bg-[#0a0a0f] border border-[#2a2a3a] text-[#9a9890] hover:border-[#c8a96e]/40'}`}>
                    {ICONS[c]} {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            {pf.categories.length > 0 && (
              <div className="glass p-6 space-y-4">
                <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Pricing (₹ per session)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pf.categories.map(c => (
                    <div key={c} className="flex items-center gap-3 bg-[#0a0a0f]/50 rounded-xl px-4 py-3">
                      <span className="text-lg">{ICONS[c]}</span>
                      <span className="text-xs text-[#9a9890] capitalize flex-1">{c}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#4a4a6a]">₹</span>
                        <input type="number" className="w-24 bg-[#13131a] border border-[#2a2a3a] text-[#e8e6e1] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#c8a96e]/60 text-right" placeholder="0" value={pricing[c] || ''} onChange={e => setPricing({...pricing, [c]: Number(e.target.value)})} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Equipment Used</h3>
              <div className="flex flex-wrap gap-2">
                {EQUIP_OPTIONS.map(e => (
                  <button type="button" key={e} onClick={() => toggleEquip(e)}
                    className={`px-3 py-1.5 rounded-full text-xs transition ${pf.equipmentUsed.includes(e)?'bg-[#1e1e2e] text-[#c8a96e] border border-[#c8a96e]/40':'bg-[#0a0a0f] border border-[#2a2a3a] text-[#9a9890] hover:border-[#2a2a3a]'}`}>
                    {e}
                  </button>
                ))}
              </div>
              <input className="input" placeholder="Add custom equipment (type and press enter)" onKeyDown={e => { if (e.key==='Enter' && e.target.value.trim()) { e.preventDefault(); toggleEquip(e.target.value.trim()); e.target.value='' } }} />
            </div>

            {/* Languages */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Languages Spoken</h3>
              <div className="flex flex-wrap gap-2">
                {LANG_OPTIONS.map(l => (
                  <button type="button" key={l} onClick={() => toggleLang(l)}
                    className={`px-3 py-1.5 rounded-full text-xs transition ${pf.languages.includes(l)?'bg-[#c8a96e] text-[#0a0a0f]':'bg-[#0a0a0f] border border-[#2a2a3a] text-[#9a9890] hover:border-[#c8a96e]/40'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-[#e8e6e1] border-b border-[#1e1e2e] pb-3">Social & Web Links</h3>
              {[['instagram','📸','Instagram URL'],['website','🌐','Website URL'],['youtube','▶️','YouTube URL'],['facebook','👥','Facebook URL']].map(([key, icon, label]) => (
                <div key={key}>
                  <label className="label">{icon} {label}</label>
                  <input className="input" placeholder={`https://`} value={pf[key]} onChange={e => setPf({...pf, [key]: e.target.value})} />
                </div>
              ))}
            </div>

            <button type="submit" disabled={saving} className="btn-primary btn w-full btn-lg sticky bottom-4 shadow-2xl shadow-[#c8a96e]/20">
              {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />Saving...</span> : '💾 Save Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
