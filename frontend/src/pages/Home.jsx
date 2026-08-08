import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES, FEATURED_CATEGORIES } from '../lib/categories'
import PhotographerCard, { PhotographerCardSkeleton } from '../components/PhotographerCard'
import { Container, SectionHeading, Button } from '../components/ui'
import { Reveal, Stagger, StaggerItem } from '../components/motion'
import AnimatedCamera from '../components/AnimatedCamera'
import CameraScrollShow from '../components/CameraScrollShow'
import LensZoom3D from '../components/LensZoom3D'
import Tilt from '../components/Tilt'

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]))

const STEPS = [
  { title: 'Discover', text: 'Browse photographers by specialty, city and style — every kind, all in one place.' },
  { title: 'Book a date', text: 'Check real availability and request the slot that works for you.' },
  { title: 'Get your shots', text: 'Meet, shoot, receive your gallery — then leave a review.' },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  const heroWords = ['weddings', 'portraits', 'wildlife', 'fashion', 'journeys']
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % heroWords.length), 2200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/photographers?sortBy=rating')
        setFeatured(data.slice(0, 6))
      } catch (e) { console.error(e) }
      setLoading(false)
    })()
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(search ? `/explore?q=${encodeURIComponent(search)}` : '/explore')
  }

  return (
    <div className="min-h-screen">
      {/* HERO — editorial, asymmetric */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36">
        <div className="absolute -top-24 -right-32 w-[42rem] h-[42rem] bg-clay/10 rounded-full blur-3xl -z-10" />
        <div className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFF 1px, transparent 0)', backgroundSize: '38px 38px' }} />

        {/* Animated camera */}
        <div className="absolute top-20 right-4 xl:right-16 w-[280px] xl:w-[340px] hidden lg:block z-0 pointer-events-none">
          <div className="absolute inset-0 bg-clay/15 rounded-full blur-3xl scale-90" />
          <AnimatedCamera className="relative w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]" />
        </div>

        <Container className="relative z-10">
          <Reveal delay={0} y={12} once className="flex items-center gap-3 text-ink-muted text-xs font-semibold tracking-[0.28em] uppercase mb-8">
            <span className="text-clay">/ 01</span>
            <span className="h-px flex-1 bg-line max-w-[120px]" />
            A marketplace for every kind of photographer
          </Reveal>

          <Reveal as="h1" delay={0.08} once className="headline text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-ink max-w-5xl break-words">
            Capture your
            <br className="hidden sm:block" />{' '}
            <span key={wordIdx} className="text-clay accent-underline word-swap">{heroWords[wordIdx]}</span>
            <span className="text-ink">.</span>
          </Reveal>

          <Reveal delay={0.2} once className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-end">
            <p className="text-ink-muted text-lg leading-relaxed max-w-xl">
              Discover talented photographers, explore their work, and book your session — all in one place, built for the way you actually shoot.
            </p>

            {/* Search */}
            <form onSubmit={submitSearch}
              className="flex items-stretch gap-2 bg-surface border border-line-strong rounded-2xl p-2 shadow-card focus-within:border-clay/60 focus-within:shadow-flare transition">
              <div className="flex items-center gap-2 flex-1 px-3">
                <svg className="w-5 h-5 text-ink-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, city, specialty…"
                  className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none py-2.5" />
              </div>
              <Button type="submit" className="rounded-xl px-6">Search</Button>
            </form>
          </Reveal>
        </Container>

        {/* Marquee of specialties */}
        <div className="mt-14 border-y border-line py-4 overflow-hidden mask-fade-x">
          <div className="flex gap-8 w-max animate-marquee">
            {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
              <span key={i} className="flex items-center gap-3 text-2xl sm:text-3xl font-serif text-ink-faint whitespace-nowrap">
                <span className="text-base">{c.icon}</span>{c.label}
                <span className="text-clay">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY TILES — numbered editorial grid */}
      <section className="py-16">
        <Container>
          <div className="flex items-end justify-between gap-4 mb-10">
            <SectionHeading eyebrow="/ 02  Browse by specialty" title="What are you shooting?" />
            <Link to="/explore" className="text-clay font-medium hover:underline shrink-0 hidden sm:block">All specialties →</Link>
          </div>
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" gap={0.06}>
            {FEATURED_CATEGORIES.map((key, i) => {
              const c = CAT_MAP[key]
              return (
                <StaggerItem key={key} className="h-full">
                  <Tilt className="h-full">
                    <Link to={`/explore?category=${key}`}
                      className="card group hover:shadow-lift hover:border-clay/40 transition-colors duration-300 p-5 flex flex-col gap-6 h-full relative overflow-hidden [transform-style:preserve-3d]">
                      {/* depth glow behind icon */}
                      <span className="pointer-events-none absolute -top-6 -left-6 w-24 h-24 bg-clay/0 group-hover:bg-clay/20 blur-2xl rounded-full transition-colors duration-300" style={{ transform: 'translateZ(-20px)' }} />
                      <span className="text-xs font-semibold text-ink-faint relative" style={{ transform: 'translateZ(18px)' }}>0{i + 1}</span>
                      <span className="text-4xl relative" style={{ transform: 'translateZ(48px)' }}>{c.icon}</span>
                      <span className="text-sm font-semibold text-ink group-hover:text-clay transition-colors relative" style={{ transform: 'translateZ(28px)' }}>{c.label}</span>
                    </Link>
                  </Tilt>
                </StaggerItem>
              )
            })}
          </Stagger>
        </Container>
      </section>

      {/* FEATURED PHOTOGRAPHERS */}
      <section className="py-16 bg-cream-200 border-y border-line">
        <Container>
          <div className="flex items-end justify-between gap-4 mb-10">
            <SectionHeading eyebrow="/ 03  Top rated" title="Featured photographers" />
            <Link to="/explore" className="text-clay font-medium hover:underline shrink-0">View all →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <PhotographerCardSkeleton key={i} />)}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12 text-ink-muted">
              <p className="text-4xl mb-3">📷</p>
              <p>No photographers yet — be the first to join.</p>
              <Link to="/register" className="btn-primary mt-5 inline-flex">Join as photographer</Link>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <StaggerItem key={p._id} className="h-full"><PhotographerCard p={p} /></StaggerItem>)}
            </Stagger>
          )}
        </Container>
      </section>

      {/* OPTICS — zooming 3D lens */}
      <section className="py-20 overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="section-label mb-3">/ 04  Precision optics</p>
              <h2 className="headline text-4xl sm:text-5xl font-bold text-ink">Glass that sees<br />the whole story.</h2>
              <p className="text-ink-muted mt-4 text-lg leading-relaxed max-w-md">
                Every photographer here shoots on gear they trust. Filter by the look you want — from wide-open bokeh to razor-sharp detail — and book the eye behind the lens.
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                {[['ƒ/1.2', 'Dreamy bokeh'], ['4K', 'Cinematic video'], ['RAW', 'Full-res delivery']].map(([k, v]) => (
                  <div key={k}>
                    <div className="headline text-2xl font-bold text-clay">{k}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <div className="flex justify-center py-6">
              <LensZoom3D />
            </div>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS — oversized numerals */}
      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="/ 05  How it works" title="Book in three steps" />
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12} className="relative pt-8">
                <span className="headline text-6xl sm:text-7xl font-bold text-line-strong absolute -top-2 left-0">{i + 1}</span>
                <div className="relative pl-2">
                  <h3 className="text-xl font-semibold text-ink mt-6">{s.title}</h3>
                  <p className="text-ink-muted mt-2 leading-relaxed">{s.text}</p>
                </div>
                <span className="block h-px bg-line mt-6" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Scroll-driven 3D camera */}
      <CameraScrollShow />

      {/* CTA — crisp white invert card */}
      <section className="pb-20 pt-16">
        <Container>
          <Reveal className="card-invert px-8 py-14 sm:px-14 relative overflow-hidden">
            <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-clay/20 rounded-full blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="section-label mb-4">/ Join the roster</p>
              <h2 className="headline text-4xl sm:text-5xl font-bold text-cream">Are you a photographer?</h2>
              <p className="text-cream/70 mt-4 text-lg">Create your profile, showcase your work, set your availability, and start taking bookings.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {user?.role === 'photographer' ? (
                  <Link to="/dashboard/photographer" className="btn bg-clay text-white hover:bg-clay-dark px-8 py-3 shadow-clay">Go to dashboard</Link>
                ) : (
                  <Link to="/register" className="btn bg-clay text-white hover:bg-clay-dark px-8 py-3 shadow-clay">Join free</Link>
                )}
                <Link to="/explore" className="btn border border-cream/25 text-cream hover:bg-cream/5 px-8 py-3">Browse photographers</Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
