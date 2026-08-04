import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { CATEGORIES, CATEGORY_LABELS } from '../lib/categories'
import PhotographerCard, { PhotographerCardSkeleton } from '../components/PhotographerCard'
import { Container, Button, EmptyState } from '../components/ui'
import { Stagger, StaggerItem } from '../components/motion'

const SORTS = [
  ['rating', 'Top rated'],
  ['experience', 'Most experienced'],
  ['bookings', 'Most booked'],
  ['newest', 'Newest'],
]

function FeedCard({ post, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const isVideo = post.media?.type === 'video'
  return (
    <div className="masonry-item group relative cursor-pointer rounded-2xl overflow-hidden bg-cream-200 border border-line" onClick={onClick}>
      {isVideo ? (
        <>
          {post.media?.thumbnail
            ? <img src={post.media.thumbnail} className="w-full object-cover" alt="" />
            : <div className="w-full h-44 flex items-center justify-center text-4xl opacity-30">🎬</div>}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-surface/90 flex items-center justify-center shadow-lift group-hover:scale-110 transition">
              <span className="text-clay text-lg ml-0.5">▶</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {!loaded && <div className="w-full h-44 shimmer" />}
          <img src={post.media?.url} alt={post.caption} onLoad={() => setLoaded(true)}
            className={`w-full object-cover group-hover:scale-105 transition duration-500 ${loaded ? '' : 'opacity-0 absolute'}`} />
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition duration-300">
        <p className="text-xs font-semibold text-white">{post.photographer?.name}</p>
        <p className="text-[11px] text-clay-light capitalize">{CATEGORY_LABELS[post.category] || post.category}</p>
      </div>
    </div>
  )
}

export default function Explore() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()

  const [tab, setTab] = useState(params.get('type') === 'feed' ? 'feed' : 'photographers')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [search, setSearch] = useState(params.get('q') || '')
  const [city, setCity] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [mediaFilter, setMediaFilter] = useState('all')

  const [photographers, setPhotographers] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  // keep URL in sync (shareable filters)
  useEffect(() => {
    const next = {}
    if (tab !== 'photographers') next.type = tab
    if (category !== 'all') next.category = category
    if (search) next.q = search
    setParams(next, { replace: true })
  }, [tab, category, search, setParams])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (tab === 'feed') {
        const p = new URLSearchParams({ limit: 30 })
        if (category !== 'all') p.set('category', category)
        if (mediaFilter !== 'all') p.set('type', mediaFilter)
        const { data } = await api.get(`/portfolio?${p}`)
        setFeed(Array.isArray(data) ? data : data.items || [])
      } else {
        const p = new URLSearchParams({ sortBy })
        if (category !== 'all') p.set('category', category)
        if (search) p.set('search', search)
        if (city) p.set('city', city)
        const { data } = await api.get(`/photographers?${p}`)
        setPhotographers(data)
      }
    } catch (e) {
      console.error(e)
      toast.error('Could not load results')
    }
    setLoading(false)
  }, [tab, category, mediaFilter, sortBy, city, search])

  useEffect(() => { fetchData() }, [tab, category, mediaFilter, sortBy, city])
  useEffect(() => {
    const t = setTimeout(fetchData, 400)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-cream-200 border-b border-line">
        <Container className="py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink">Explore photographers</h1>
          <p className="text-ink-muted mt-2">Browse every kind of photographer and find the right one for your moment.</p>

          {/* Search + city */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-1 bg-surface border border-line-strong rounded-full px-4 focus-within:border-clay focus-within:ring-2 focus-within:ring-clay/20 transition">
              <svg className="w-4 h-4 text-ink-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, city or specialty…"
                className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none py-3" />
              {search && <button onClick={() => setSearch('')} className="text-ink-faint hover:text-ink text-xl">×</button>}
            </div>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City"
              className="input rounded-full sm:w-44" />
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Tabs + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex bg-cream-200 border border-line rounded-full p-1 gap-1 w-max">
            {[['photographers', 'Photographers'], ['feed', 'Photo feed']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${tab === key ? 'bg-clay text-white shadow-clay' : 'text-ink-muted hover:text-ink'}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'photographers' ? (
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select w-max rounded-full py-2 text-sm">
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ) : (
            <div className="flex bg-cream-200 border border-line rounded-full p-1 gap-1">
              {[['all', 'All'], ['image', 'Photos'], ['video', 'Videos']].map(([key, label]) => (
                <button key={key} onClick={() => setMediaFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${mediaFilter === key ? 'bg-surface text-ink shadow-soft' : 'text-ink-muted hover:text-ink'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setCategory('all')} className={category === 'all' ? 'chip-on' : 'chip-off'}>✦ All</button>
          {CATEGORIES.map(({ key, label, icon }) => (
            <button key={key} onClick={() => setCategory(key)} className={category === key ? 'chip-on' : 'chip-off'}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (tab === 'photographers'
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <PhotographerCardSkeleton key={i} />)}</div>
          : <div className="masonry">{[...Array(9)].map((_, i) => <div key={i} className={`masonry-item shimmer rounded-2xl ${i % 3 === 0 ? 'h-64' : 'h-44'}`} />)}</div>
        )}

        {/* Photographers */}
        {!loading && tab === 'photographers' && (
          photographers.length === 0
            ? <EmptyState icon="🔍" title="No photographers found" description="Try a different search, city, or category."
                action={<Button variant="ghost" onClick={() => { setSearch(''); setCity(''); setCategory('all') }}>Clear filters</Button>} />
            : <>
                <p className="text-sm text-ink-muted mb-4">{photographers.length} photographer{photographers.length !== 1 ? 's' : ''} found</p>
                <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" gap={0.05}>
                  {photographers.map((p) => <StaggerItem key={p._id} className="h-full"><PhotographerCard p={p} /></StaggerItem>)}
                </Stagger>
              </>
        )}

        {/* Feed */}
        {!loading && tab === 'feed' && (
          feed.length === 0
            ? <EmptyState icon="🖼️" title="No media yet" description="No photos or videos in this category yet." />
            : <div className="masonry">{feed.map((post) => <FeedCard key={post._id} post={post} onClick={() => setLightbox(post)} />)}</div>
        )}
      </Container>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-11 h-11 rounded-full bg-surface text-ink hover:bg-cream-200 transition flex items-center justify-center text-lg shadow-lift">✕</button>
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-4 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-center bg-ink/90">
              {lightbox.media?.type === 'video'
                ? <video src={lightbox.media.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-2xl" />
                : <img src={lightbox.media?.url} alt={lightbox.caption} className="max-w-full max-h-[80vh] object-contain rounded-2xl" />}
            </div>
            <div className="md:w-72 bg-surface rounded-2xl border border-line p-5 space-y-4 shadow-lift">
              <p className="text-lg font-semibold text-ink">{lightbox.photographer?.name}</p>
              <span className="tag">{CATEGORY_LABELS[lightbox.category] || lightbox.category}</span>
              {lightbox.caption && <p className="text-sm text-ink-muted leading-relaxed">{lightbox.caption}</p>}
              <Link to={`/photographer/${lightbox.photographer?._id}`} onClick={() => setLightbox(null)} className="btn-primary w-full py-3">View photographer</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
