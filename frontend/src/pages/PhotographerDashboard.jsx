import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Container, Button, Avatar, Badge, EmptyState } from '../components/ui'

const CATS = ['wedding','pre-wedding','post-wedding','modeling','wildlife','event','portrait','fashion','product','travel','food','architecture','sports','newborn','maternity']
const ICONS = { wedding:'💍','pre-wedding':'🌸','post-wedding':'🥂',modeling:'👗',wildlife:'🦅',event:'🎉',portrait:'🎨',fashion:'✨',product:'📦',travel:'🌍',food:'🍽',architecture:'🏛',sports:'⚽',newborn:'👶',maternity:'🤱' }
const STATUS_TONE = { pending:'amber', confirmed:'success', rejected:'danger', completed:'clay', cancelled:'neutral' }

const EQUIP_OPTIONS = ['Canon 5D Mark IV','Canon R5','Nikon D850','Nikon Z9','Sony A7 III','Sony A7R V','Fujifilm X-T4','GoPro Hero 11','DJI Drone','50mm Lens','85mm Lens','24-70mm Lens','70-200mm Lens','Ring Light','Softbox','Godox Flash']
const LANG_OPTIONS = ['Hindi','English','Tamil','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Urdu']

// small helper: section panel
function Panel({ title, desc, children }) {
  return (
    <div className="card p-6 space-y-4">
      {title && (
        <div className="border-b border-line pb-3">
          <h3 className="font-semibold text-ink">{title}</h3>
          {desc && <p className="text-xs text-ink-muted mt-0.5">{desc}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

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

  // profile completeness meter
  const completion = (() => {
    const checks = [pf.bio, pf.tagline, pf.city, pf.categories.length > 0, portfolio.length > 0, user?.avatar?.url]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  })()

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container className="max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="section-label mb-1">Photographer</p>
            <h1 className="headline text-3xl sm:text-4xl font-bold text-ink">Studio dashboard</h1>
            <p className="text-ink-muted text-sm mt-1">Hello, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          {!profile?.profileCompleted && (
            <div className="bg-clay-soft border border-clay/30 text-clay-light text-xs px-4 py-2 rounded-xl flex items-center gap-2">
              ⚠️ Complete your profile to appear in search
            </div>
          )}
        </div>

        {/* Completion meter */}
        <div className="card p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-ink">Profile strength</p>
            <span className="text-sm font-semibold text-clay">{completion}%</span>
          </div>
          <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
            <div className="h-full bg-clay rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
          {completion < 100 && <p className="text-xs text-ink-faint mt-2">Add a bio, tagline, city, specialties, a profile photo and some work to reach 100%.</p>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label:'Total media', value: portfolio.length, icon:'🖼', sub:`${portfolio.filter(p=>p.media?.type==='video').length} videos` },
            { label:'Total bookings', value: bookings.length, icon:'📅', sub:`${pendingCount} pending` },
            { label:'Confirmed', value: bookings.filter(b=>b.status==='confirmed').length, icon:'✓', sub:'Active sessions' },
            { label:'Completed', value: bookings.filter(b=>b.status==='completed').length, icon:'🎉', sub:'Happy clients' },
          ].map(({ label, value, icon, sub }) => (
            <div key={label} className="card p-4 text-center hover:border-clay/30 transition">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="headline text-2xl font-bold text-clay">{value}</div>
              <div className="text-xs font-medium text-ink mt-0.5">{label}</div>
              <div className="text-[10px] text-ink-faint mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-200 border border-line rounded-2xl p-1 mb-8 overflow-x-auto">
          {[['bookings','📅 Bookings',pendingCount],['upload','📤 Upload',0],['portfolio','🖼 Portfolio',0],['profile','⚙️ Profile',0]].map(([key,label,badge]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap flex-1 justify-center ${tab===key?'bg-clay text-white shadow-clay':'text-ink-muted hover:text-ink'}`}>
              {label}
              {badge > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab===key?'bg-black/20 text-white':'bg-rose text-white'}`}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 && <EmptyState icon="📅" title="No bookings yet" description="Complete your profile to get discovered by clients." />}
            {bookings.map(b => (
              <div key={b._id} className="card p-5 hover:border-clay/30 transition">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={b.customer?.avatar?.url} name={b.customer?.name} size="sm" />
                        <div>
                          <p className="font-semibold text-ink text-sm">{b.customer?.name}</p>
                          <p className="text-xs text-ink-faint">{b.customer?.email}</p>
                          {b.customer?.phone && <p className="text-xs text-ink-faint">📞 {b.customer.phone}</p>}
                        </div>
                      </div>
                      <Badge tone={STATUS_TONE[b.status] || 'neutral'} dot>{b.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cream-100 rounded-xl p-4 text-sm">
                      <div><p className="text-[10px] text-ink-faint uppercase mb-1">Type</p><p className="text-ink capitalize text-xs">{ICONS[b.category]} {b.category}</p></div>
                      <div><p className="text-[10px] text-ink-faint uppercase mb-1">Date</p><p className="text-ink text-xs">{new Date(b.eventDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p></div>
                      <div><p className="text-[10px] text-ink-faint uppercase mb-1">Location</p><p className="text-ink text-xs">{b.location}</p></div>
                      <div><p className="text-[10px] text-ink-faint uppercase mb-1">Budget</p><p className="text-clay text-xs font-semibold">{b.budget ? `₹${Number(b.budget).toLocaleString('en-IN')}` : 'Open'}</p></div>
                    </div>
                    {b.numberOfHours && <p className="text-xs text-ink-faint mt-2">⏱ {b.numberOfHours} hours {b.numberOfPeople && `· 👥 ${b.numberOfPeople}`}</p>}
                    {b.notes && <p className="text-xs text-ink-muted mt-2 italic bg-cream-100 rounded-lg px-3 py-2">"{b.notes}"</p>}
                  </div>
                  {b.status === 'pending' && (
                    <div className="flex lg:flex-col gap-2 shrink-0">
                      <button onClick={() => updateStatus(b._id,'confirmed')} className="flex-1 lg:flex-none bg-moss-soft hover:bg-moss hover:text-cream text-moss border border-moss/30 text-xs px-4 py-2.5 rounded-xl transition font-medium">✓ Accept</button>
                      <button onClick={() => updateStatus(b._id,'rejected')} className="flex-1 lg:flex-none bg-rose-soft hover:bg-rose hover:text-cream text-rose border border-rose/30 text-xs px-4 py-2.5 rounded-xl transition font-medium">✗ Decline</button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => updateStatus(b._id,'completed')} className="shrink-0 bg-clay-soft hover:bg-clay hover:text-white text-clay-light border border-clay/30 text-xs px-4 py-2.5 rounded-xl transition font-medium h-fit">Mark done ✓</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UPLOAD */}
        {tab === 'upload' && (
          <div className="max-w-xl">
            <form onSubmit={handleUpload} className="card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="headline text-xl font-bold text-ink mb-1">Upload to portfolio</h2>
                <p className="text-xs text-ink-faint">Photos (JPG, PNG, WebP, HEIC) and videos (MP4, MOV, AVI, MKV) supported</p>
              </div>

              <div>
                <label className="label">Category *</label>
                <select className="input" value={upload.category} onChange={e => setUpload({...upload, category: e.target.value})} required>
                  <option value="">Select category…</option>
                  {CATS.map(c => <option key={c} value={c} className="capitalize">{ICONS[c]} {c}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Photo or video *</label>
                <label className="block w-full border-2 border-dashed border-line-strong hover:border-clay/50 rounded-2xl cursor-pointer transition group overflow-hidden">
                  <input type="file" accept="image/*,video/*,.heic,.raw,.cr2,.nef" className="hidden" onChange={handleFileChange} />
                  {upload.preview ? (
                    <img src={upload.preview} className="w-full h-56 object-cover" alt="preview" />
                  ) : upload.isVideo && upload.file ? (
                    <div className="h-44 flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-clay-soft flex items-center justify-center text-2xl">🎬</div>
                      <div className="text-center">
                        <p className="text-sm text-clay font-medium">{upload.file.name}</p>
                        <p className="text-xs text-ink-faint mt-1">{(upload.file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-cream-200 group-hover:bg-clay-soft border border-line-strong group-hover:border-clay/40 flex items-center justify-center text-2xl transition">📸</div>
                      <div className="text-center">
                        <p className="text-sm text-ink-muted">Click to upload photo or video</p>
                        <p className="text-xs text-ink-faint mt-1">Max 500MB for videos</p>
                      </div>
                    </div>
                  )}
                </label>
                {(upload.preview || (upload.isVideo && upload.file)) && (
                  <button type="button" onClick={() => setUpload({...upload, file:null, preview:null, isVideo:false})} className="text-xs text-rose hover:text-rose/80 mt-2 transition">✕ Remove</button>
                )}
              </div>

              {upload.file && (
                <>
                  <div>
                    <label className="label">Caption</label>
                    <textarea className="input resize-none" rows={2} placeholder="Describe the shot or tell its story…" value={upload.caption} onChange={e => setUpload({...upload, caption: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Tags <span className="text-ink-faint normal-case font-normal">(comma separated)</span></label>
                    <input className="input" placeholder="e.g. outdoor, golden hour, candid" value={upload.tags} onChange={e => setUpload({...upload, tags: e.target.value})} />
                  </div>
                </>
              )}

              {uploading && (
                <div>
                  <div className="flex justify-between text-xs text-ink-muted mb-1">
                    <span>Uploading{upload.isVideo ? ' video' : ''}…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div className="h-full bg-clay transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" fullWidth loading={uploading} disabled={!upload.file || !upload.category}>
                {uploading ? `Uploading… ${uploadProgress}%` : `Upload ${upload.isVideo ? 'video' : 'photo'}`}
              </Button>
            </form>
          </div>
        )}

        {/* PORTFOLIO */}
        {tab === 'portfolio' && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-ink-muted">{portfolio.length} items · {portfolio.filter(p=>p.media?.type==='image').length} photos · {portfolio.filter(p=>p.media?.type==='video').length} videos</p>
              <Button size="sm" variant="ghost" onClick={() => setTab('upload')}>+ Add media</Button>
            </div>
            {portfolio.length === 0
              ? <EmptyState icon="📷" title="No media yet" description="Upload your best work to start building your portfolio." action={<Button onClick={() => setTab('upload')}>Upload first media</Button>} />
              : <div className="masonry">
                  {portfolio.map(post => (
                    <div key={post._id} className="masonry-item group relative rounded-2xl overflow-hidden bg-surface border border-line">
                      {post.media?.type === 'video'
                        ? <div className="relative">
                            {post.media.thumbnail ? <img src={post.media.thumbnail} className="w-full object-cover" alt="" /> : <div className="w-full h-36 bg-cream-200 flex items-center justify-center"><span className="text-3xl opacity-30">🎬</span></div>}
                            <div className="absolute top-2 left-2"><span className="text-[9px] bg-cream/80 text-clay-light px-1.5 py-0.5 rounded-full">VIDEO</span></div>
                          </div>
                        : <img src={post.media?.url} alt={post.caption} className="w-full object-cover group-hover:scale-105 transition duration-500" />}
                      <div className="absolute inset-0 bg-cream/80 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-3">
                        <span className="tag text-[10px]">{ICONS[post.category]} {post.category}</span>
                        {post.caption && <p className="text-[10px] text-ink-muted text-center line-clamp-2">{post.caption}</p>}
                        <button onClick={() => deleteMedia(post._id)} className="text-xs text-white bg-rose px-3 py-1.5 rounded-full hover:bg-rose/80 transition mt-1">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <form onSubmit={saveProfile} className="space-y-6 max-w-2xl">
            <Panel title="Photos">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center">
                  <p className="label mb-3">Profile photo</p>
                  <label className="cursor-pointer block">
                    <div className="w-20 h-20 rounded-2xl bg-clay-soft border-2 border-dashed border-clay/40 hover:border-clay/70 flex items-center justify-center text-2xl font-bold text-clay overflow-hidden mx-auto transition relative">
                      {user?.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" alt="" /> : user?.name?.[0]?.toUpperCase()}
                      {avatarUploading && <div className="absolute inset-0 bg-cream/70 flex items-center justify-center"><span className="w-5 h-5 border-2 border-clay/30 border-t-clay rounded-full animate-spin" /></div>}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleAvatarUpload(e.target.files[0])} />
                    <p className="text-[10px] text-ink-faint mt-2">Click to change</p>
                  </label>
                </div>
                <div className="flex-1">
                  <p className="label mb-3">Cover photo</p>
                  <label className="cursor-pointer block w-full h-24 rounded-xl border-2 border-dashed border-line-strong hover:border-clay/50 overflow-hidden transition relative">
                    {profile?.coverImage?.url ? <img src={profile.coverImage.url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-ink-faint text-xs">Click to upload cover</div>}
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleCoverUpload(e.target.files[0])} />
                  </label>
                </div>
              </div>
            </Panel>

            <Panel title="Basic info">
              <div>
                <label className="label">Tagline <span className="text-ink-faint normal-case font-normal">(shown on your card)</span></label>
                <input className="input" placeholder="e.g. Capturing love stories across India" value={pf.tagline} onChange={e => setPf({...pf, tagline: e.target.value})} maxLength={150} />
              </div>
              <div>
                <label className="label">Bio <span className="text-ink-faint normal-case font-normal">(max 2000 chars)</span></label>
                <textarea className="input resize-none" rows={5} placeholder="Tell clients about your style, experience, passion, and what makes your photography unique…" value={pf.bio} onChange={e => setPf({...pf, bio: e.target.value})} maxLength={2000} />
                <p className="text-[10px] text-ink-faint text-right mt-1">{pf.bio.length}/2000</p>
              </div>
              <div>
                <label className="label">Years of experience</label>
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
                <label className="label">Highlights <span className="text-ink-faint normal-case font-normal">(one per line)</span></label>
                <textarea className="input resize-none" rows={3} placeholder={"500+ weddings shot\nFeatured in Vogue India\nDJI certified drone pilot"} value={pf.highlights} onChange={e => setPf({...pf, highlights: e.target.value})} />
              </div>
            </Panel>

            <Panel title="Specialties" desc="Select every kind of photography you offer.">
              <div className="flex flex-wrap gap-2">
                {CATS.map(c => (
                  <button type="button" key={c} onClick={() => toggleCat(c)}
                    className={pf.categories.includes(c) ? 'chip-on capitalize' : 'chip-off capitalize'}>
                    {ICONS[c]} {c}
                  </button>
                ))}
              </div>
            </Panel>

            {pf.categories.length > 0 && (
              <Panel title="Pricing (₹ per session)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pf.categories.map(c => (
                    <div key={c} className="flex items-center gap-3 bg-cream-100 rounded-xl px-4 py-3">
                      <span className="text-lg">{ICONS[c]}</span>
                      <span className="text-xs text-ink-muted capitalize flex-1">{c}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-ink-faint">₹</span>
                        <input type="number" className="w-24 bg-surface border border-line-strong text-ink rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-clay text-right" placeholder="0" value={pricing[c] || ''} onChange={e => setPricing({...pricing, [c]: Number(e.target.value)})} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            <Panel title="Equipment used">
              <div className="flex flex-wrap gap-2">
                {EQUIP_OPTIONS.map(e => (
                  <button type="button" key={e} onClick={() => toggleEquip(e)}
                    className={`px-3 py-1.5 rounded-full text-xs transition border ${pf.equipmentUsed.includes(e)?'bg-clay-soft text-clay-light border-clay/40':'bg-surface border-line-strong text-ink-muted hover:border-clay/40'}`}>
                    {e}
                  </button>
                ))}
              </div>
              <input className="input" placeholder="Add custom equipment (type and press Enter)" onKeyDown={e => { if (e.key==='Enter' && e.target.value.trim()) { e.preventDefault(); toggleEquip(e.target.value.trim()); e.target.value='' } }} />
            </Panel>

            <Panel title="Languages spoken">
              <div className="flex flex-wrap gap-2">
                {LANG_OPTIONS.map(l => (
                  <button type="button" key={l} onClick={() => toggleLang(l)}
                    className={`px-3 py-1.5 rounded-full text-xs transition border ${pf.languages.includes(l)?'bg-clay text-white border-clay':'bg-surface border-line-strong text-ink-muted hover:border-clay/40'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Social & web links">
              {[['instagram','📸','Instagram URL'],['website','🌐','Website URL'],['youtube','▶️','YouTube URL'],['facebook','👥','Facebook URL']].map(([key, icon, label]) => (
                <div key={key}>
                  <label className="label">{icon} {label}</label>
                  <input className="input" placeholder="https://" value={pf[key]} onChange={e => setPf({...pf, [key]: e.target.value})} />
                </div>
              ))}
            </Panel>

            <div className="sticky bottom-4">
              <Button type="submit" size="lg" fullWidth loading={saving} className="shadow-lift">
                {saving ? 'Saving…' : '💾 Save profile'}
              </Button>
            </div>
          </form>
        )}
      </Container>
    </div>
  )
}
