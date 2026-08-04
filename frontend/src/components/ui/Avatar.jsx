import { cn } from './cn'

const SIZES = { xs: 'w-7 h-7 text-xs', sm: 'w-9 h-9 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl' }

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-semibold',
        'bg-clay-soft text-clay-dark border border-clay/15',
        SIZES[size],
        className
      )}
    >
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </span>
  )
}
