import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { key: 'all', label: 'All', icon: '✦' },
  { key: 'wedding', label: 'Wedding', icon: '💍' },
  { key: 'pre-wedding', label: 'Pre-Wedding', icon: '🌸' },
  { key: 'post-wedding', label: 'Post-Wedding', icon: '🥂' },
  { key: 'modeling', label: 'Modeling', icon: '👗' },
  { key: 'wildlife', label: 'Wildlife', icon: '🦅' },
  { key: 'event', label: 'Events', icon: '🎉' },
  { key: 'portrait', label: 'Portrait', icon: '🎨' },
  { key: 'fashion', label: 'Fashion', icon: '✨' },
  { key: 'product', label: 'Product', icon: '📦' },
  { key: 'travel', label: 'Travel', icon: '🌍' },
  { key: 'newborn', label: 'Newborn', icon: '👶' },
  { key: 'maternity', label: 'Maternity', icon: '🤱' },
]

function VideoCard({ post, onClick }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="masonry-item group relative cursor-pointer rounded-xl overflow-hidden bg-[#13131a]" onClick={onClick}>
      {playing ? (
        <video src={post.media.url} autoPlay muted loop className="w-full object-cover rounded-xl" />
      ) : (
        <>
          {post.media.thumbnail
            ? <img src={post.media.thumbnail} className="w-full object-cover group-hover:scale-105 transition duration-500" alt="" />
            : <div className="w-full h-40 bg-gradient-to-br from-[#1e1e2e] to-[#13131a] flex items-center justify-center"><span className="text-4xl opacity-30">🎬</span></div>}
          <div className="absolute inset-0 bg-[#0a0a0f]/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#c8a96e] flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-300">
              <span className="text-[#0a0a0f] text-lg ml-1">▶</span>
            </div>
          </div>
          <div className="absolute top-2 left-2"><span className="text-[10px] bg-[#0a0a0f]/80 text-[#c8a96e] px-2 py-0.5 rounded-full border border-[#c8a96e]/20">VIDEO</span></div>
        </>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0a0a0f]/90 p-3 translate-y-full group-hover:translate-y-0 transition duration-300">
        <p className="text-xs font-semibold text-[#e8e6e1]">{post.photographer?.name}</p>
        <p className="text-[10px] text-[#c8a96e] capitalize">{post.category}</p>
      </div>
    </div>
  )
}

function PhotoCard({ post, onClick }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="masonry-item group relative cursor-pointer rounded-xl overflow-hidden bg-[#13131a]" onClick={onClick}>
      {!loaded && <div className="w-full h-40 shimmer" />}
      <img src={post.media.url} alt={post.caption}
        onLoad={() => setLoaded(true)}
        className={`w-full object-cover group-hover:scale-105 transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-3 flex flex-col justify-end">
        <p className="text-xs font-semibold text-[#e8e6e1]">{post.photographer?.name}</p>
        <p className="text-[10px] text-[#c8a96e] capitalize">{post.category}</p>
        {post.caption && <p className="text-[10px] text-[#9a9890] truncate mt-0.5">{post.caption}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-[#4a4a6a]">♥ {post.likes?.length || 0}</span>
          <span className="text-[10px] text-[#4a4a6a]">👁 {post.views || 0}</span>
        </div>
      </div>
    </div>
  )
}

function PhotographerCard({ p }) {
  return (
    <Link to={`/photographer/${p.user?._id}`}
      className="card group hover:border-[#c8a96e]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#c8a96e]/5 flex flex-col">
      <div className="h-40 overflow-hidden relative">
        {p.coverImage?.url
          ? <img src={p.coverImage.url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
          : <div className="w-full h-full bg-gradient-to-br from-[#1e1e2e] to-[#0a0a0f] flex items-center justify-center"><span className="text-5xl opacity-10">📷</span></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-transparent" />
        <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end">
          {p.categories?.slice(0,2).map(c => (
            <span key={c} className="text-[9px] bg-[#0a0a0f]/80 backdrop-blur text-[#c8a96e] px-2 py-0.5 rounded-full capitalize">{c}</span>
          ))}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 -mt-6 mb-3">
          <div className="w-11 h-11 rounded-xl bg-[#c8a96e]/15 border-2 border-[#13131a] flex items-center justify-center text-[#c8a96e] font-bold text-base overflow-hidden shrink-0 shadow-lg">
            {p.user?.avatar?.url ? <img src={p.user.avatar.url} className="w-full h-full object-cover" alt="" /> : p.user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="pt-5 flex-1 min-w-0">
            <h3 className="font-semibold text-[#e8e6e1] truncate text-sm">{p.user?.name}</h3>
            <p className="text-[11px] text-[#4a4a6a] truncate">
              📍 {[p.location?.city, p.location?.state].filter(Boolean).join(', ') || 'India'}
            </p>
          </div>
          <div className="pt-5 text-right shrink-0">
            {p.averageRating > 0
              ? <><div className="text-[#c8a96e] text-sm font-bold">★ {p.averageRating}</div><div className="text-[9px] text-[#4a4a6a]">{p.totalReviews} reviews</div></>
              : <span className="text-[10px] bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full">New</span>}
          </div>
        </div>
        {p.tagline && <p className="text-xs text-[#c8a96e]/80 italic mb-2 line-clamp-1">"{p.tagline}"</p>}
        {p.bio && <p className="text-xs text-[#9a9890] line-clamp-2 leading-relaxed flex-1">{p.bio}</p>}
        <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex items-center justify-between">
          <div className="flex gap-3 text-[11px] text-[#4a4a6a]">
            <span>{p.experienceYears > 0 ? `${p.experienceYears}yr exp` : 'New'}</span>
            {p.totalBookings > 0 && <span>· {p.totalBookings} sessions</span>}
          </div>
          <span className="text-[11px] text-[#c8a96e] font-medium group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('photographers')
  const [mediaFilter, setMediaFilter] = useState('all') // all, image, video
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [feed, setFeed] = useState([])
  const [photographers, setPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = useCallback(async (reset = true) => {
    setLoading(true)
    try {
      if (activeTab === 'feed') {
        const params = new URLSearchParams({ limit: 20, page: reset ? 1 : page })
        if (category !== 'all') params.set('category', category)
        if (mediaFilter !== 'all') params.set('type', mediaFilter)
        const { data } = await api.get(`/portfolio?${params}`)
        setFeed(reset ? data : prev => [...prev, ...data])
        setHasMore(data.length === 20)
        if (!reset) setPage(p => p + 1)
      } else {
        const params = new URLSearchParams({ sortBy })
        if (category !== 'all') params.set('category', category)
        if (search) params.set('search', search)
        const { data } = await api.get(`/photographers?${params}`)
        setPhotographers(data)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [activeTab, category, mediaFilter, sortBy, search])

  useEffect(() => { setPage(1); fetchData(true) }, [activeTab, category, mediaFilter, sortBy])
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchData(true) }, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleLike = async (post, e) => {
    e.stopPropagation()
    if (!user) return toast.error('Login to like photos')
    try {
      const { data } = await api.post(`/portfolio/${post._id}/like`)
      setFeed(prev => prev.map(p => p._id === post._id ? { ...p, likes: Array(data.likes).fill(null) } : p))
    } catch { toast.error('Failed to like') }
  }

  const heroWords = ['Wedding', 'Wildlife', 'Fashion', 'Portrait', 'Travel']
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % heroWords.length), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background grid */}
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, #1e1e2e 1px, transparent 0)', backgroundSize:'40px 40px', opacity:0.4}} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c8a96e]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#c8a96e]/10 border border-[#c8a96e]/20 text-[#c8a96e] text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-[#c8a96e] rounded-full animate-pulse" />
            India's Premier Photography Marketplace
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-[#e8e6e1] mb-6 animate-fade-up">
            Capture every<br />
            <span className="gradient-text transition-all duration-500">{heroWords[wordIdx]}</span>{' '}
            <span className="text-[#e8e6e1]">moment.</span>
          </h1>
          <p className="text-[#9a9890] text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up">
            Connect with India's finest photographers and videographers. From intimate portraits to grand celebrations.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-2 max-w-2xl mx-auto focus-within:border-[#c8a96e]/40 transition-all duration-300 shadow-2xl shadow-black/50 mb-12 animate-fade-up">
            <div className="flex items-center gap-2 flex-1 px-3">
              <svg className="w-4 h-4 text-[#4a4a6a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search photographers, city, speciality..."
                className="flex-1 bg-transparent text-sm text-[#e8e6e1] placeholder-[#4a4a6a] outline-none py-2" />
              {search && <button onClick={() => setSearch('')} className="text-[#4a4a6a] hover:text-[#9a9890] text-xl transition">×</button>}
            </div>
            <button onClick={() => { setActiveTab('photographers'); fetchData(true) }}
              className="btn-primary rounded-xl px-6 py-3 text-sm whitespace-nowrap">
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 animate-fade-up">
            {[['500+','Photographers'],['10K+','Bookings Done'],['15','Categories'],['4.9★','Avg Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#c8a96e]">{num}</div>
                <div className="text-[10px] text-[#4a4a6a] mt-0.5 hidden sm:block">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#4a4a6a] animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {/* Tab switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex bg-[#13131a] border border-[#1e1e2e] rounded-xl p-1 gap-1">
            {[['photographers','👤 Photographers'],['feed','🖼 Media Feed']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === key ? 'bg-[#c8a96e] text-[#0a0a0f] shadow-lg shadow-[#c8a96e]/20' : 'text-[#9a9890] hover:text-[#e8e6e1]'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === 'feed' && (
              <div className="flex bg-[#13131a] border border-[#1e1e2e] rounded-lg p-0.5 gap-0.5">
                {[['all','All'],['image','Photos'],['video','Videos']].map(([key, label]) => (
                  <button key={key} onClick={() => setMediaFilter(key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${mediaFilter === key ? 'bg-[#1e1e2e] text-[#e8e6e1]' : 'text-[#4a4a6a] hover:text-[#9a9890]'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            {activeTab === 'photographers' && (
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-[#13131a] border border-[#1e1e2e] text-[#9a9890] text-xs rounded-lg px-3 py-2 outline-none focus:border-[#c8a96e]/40 cursor-pointer">
                <option value="rating">Top Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="bookings">Most Booked</option>
                <option value="newest">Newest</option>
              </select>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(({ key, label, icon }) => (
            <button key={key} onClick={() => setCategory(key)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${category === key ? 'bg-[#c8a96e] text-[#0a0a0f] shadow-lg shadow-[#c8a96e]/20' : 'bg-[#13131a] border border-[#1e1e2e] text-[#9a9890] hover:border-[#c8a96e]/30 hover:text-[#e8e6e1]'}`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && (
          activeTab === 'photographers'
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_,i) => <div key={i} className="card"><div className="h-40 shimmer" /><div className="p-4 space-y-3"><div className="h-4 shimmer rounded w-2/3" /><div className="h-3 shimmer rounded w-1/2" /></div></div>)}
              </div>
            : <div className="masonry">{[...Array(8)].map((_,i) => <div key={i} className={`masonry-item shimmer rounded-xl ${i % 3 === 0 ? 'h-64' : 'h-40'}`} />)}</div>
        )}

        {/* Photographers Grid */}
        {!loading && activeTab === 'photographers' && (
          <>
            {photographers.length === 0
              ? <div className="text-center py-24"><p className="text-5xl mb-4">📷</p><p className="text-[#9a9890] mb-2">No photographers found</p><p className="text-[#4a4a6a] text-sm">Try a different search or category</p></div>
              : <>
                  <p className="text-xs text-[#4a4a6a] mb-4">{photographers.length} photographers found</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {photographers.map(p => <PhotographerCard key={p._id} p={p} />)}
                  </div>
                </>}
          </>
        )}

        {/* Media Feed */}
        {!loading && activeTab === 'feed' && (
          <>
            {feed.length === 0
              ? <div className="text-center py-24"><p className="text-5xl mb-4">🖼</p><p className="text-[#9a9890]">No media yet in this category</p></div>
              : <>
                  <div className="masonry">
                    {feed.map(post => (
                      post.media?.type === 'video'
                        ? <VideoCard key={post._id} post={post} onClick={() => setLightbox(post)} />
                        : <PhotoCard key={post._id} post={post} onClick={() => setLightbox(post)} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="text-center mt-10">
                      <button onClick={() => fetchData(false)} className="btn-ghost btn px-8 py-3">Load More</button>
                    </div>
                  )}
                </>}
          </>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 bg-[#0a0a0f]/98 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#1e1e2e] text-[#9a9890] hover:text-[#e8e6e1] transition flex items-center justify-center text-lg z-10">✕</button>
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-4 max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-center bg-[#0a0a0f]">
              {lightbox.media?.type === 'video'
                ? <video src={lightbox.media.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-2xl" />
                : <img src={lightbox.media?.url} alt={lightbox.caption} className="max-w-full max-h-[80vh] object-contain rounded-2xl" />}
            </div>
            <div className="md:w-64 space-y-3">
              <div className="glass-dark p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/15 flex items-center justify-center text-[#c8a96e] font-bold text-sm">
                    {lightbox.photographer?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e8e6e1]">{lightbox.photographer?.name}</p>
                    <span className="tag text-[10px]">{lightbox.category}</span>
                  </div>
                </div>
                {lightbox.caption && <p className="text-sm text-[#9a9890] leading-relaxed">{lightbox.caption}</p>}
                {lightbox.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {lightbox.tags.map(t => <span key={t} className="text-[10px] text-[#4a4a6a] bg-[#1e1e2e] px-2 py-0.5 rounded-full">#{t}</span>)}
                  </div>
                )}
                <div className="flex gap-3 text-xs text-[#4a4a6a]">
                  <span>♥ {lightbox.likes?.length || 0} likes</span>
                  <span>👁 {lightbox.views || 0} views</span>
                </div>
              </div>
              <Link to={`/photographer/${lightbox.photographer?._id}`}
                onClick={() => setLightbox(null)}
                className="btn-primary btn w-full py-3 text-sm">View Photographer</Link>
              <button onClick={() => setLightbox(null)} className="btn-ghost btn w-full py-2.5 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
