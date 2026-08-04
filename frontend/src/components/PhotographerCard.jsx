import { Link } from 'react-router-dom'
import Avatar from './ui/Avatar'
import Badge from './ui/Badge'
import { CATEGORY_LABELS } from '../lib/categories'

export default function PhotographerCard({ p }) {
  const city = [p.location?.city, p.location?.state].filter(Boolean).join(', ') || 'India'
  const rating = p.averageRating > 0

  return (
    <Link
      to={`/photographer/${p.user?._id}`}
      className="card group hover:shadow-lift hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Cover */}
      <div className="h-44 overflow-hidden relative bg-cream-200">
        {p.coverImage?.url ? (
          <img src={p.coverImage.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-clay-light/50 to-clay/40 flex items-center justify-center">
            <span className="text-5xl opacity-40">📷</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {p.categories?.slice(0, 2).map((c) => (
            <span key={c} className="text-[11px] bg-surface/90 backdrop-blur text-ink px-2.5 py-1 rounded-full font-medium shadow-soft">
              {CATEGORY_LABELS[c] || c}
            </span>
          ))}
        </div>
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full shadow-soft">
            <span className="text-amber text-xs">★</span>
            <span className="text-xs font-semibold text-ink">{p.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 pt-0 flex-1 flex flex-col">
        <div className="flex items-start gap-3 -mt-6 mb-3">
          <div className="ring-4 ring-surface rounded-full">
            <Avatar src={p.user?.avatar?.url} name={p.user?.name} size="md" />
          </div>
          <div className="pt-6 flex-1 min-w-0">
            <h3 className="font-semibold text-ink truncate">{p.user?.name}</h3>
            <p className="text-xs text-ink-muted truncate">📍 {city}</p>
          </div>
        </div>

        {p.tagline && <p className="text-sm text-clay-dark italic mb-1.5 line-clamp-1">"{p.tagline}"</p>}
        {p.bio && <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed flex-1">{p.bio}</p>}

        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            {p.experienceYears > 0 ? <span>{p.experienceYears} yr exp</span> : <Badge tone="success">New</Badge>}
            {p.totalBookings > 0 && <span>· {p.totalBookings} sessions</span>}
          </div>
          <span className="text-sm text-clay font-medium group-hover:translate-x-0.5 transition-transform">View →</span>
        </div>
      </div>
    </Link>
  )
}

export function PhotographerCardSkeleton() {
  return (
    <div className="card">
      <div className="h-44 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-10 w-10 rounded-full shimmer -mt-6" />
        <div className="h-4 shimmer rounded w-2/3" />
        <div className="h-3 shimmer rounded w-1/2" />
      </div>
    </div>
  )
}
