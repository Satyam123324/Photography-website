import { cn } from './cn'

export default function Container({ className = '', children, ...props }) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description, center = false, className = '' }) {
  return (
    <div className={cn(center && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && <p className="section-label mb-3">{eyebrow}</p>}
      {title && <h2 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">{title}</h2>}
      {description && <p className="text-ink-muted mt-3 text-base sm:text-lg">{description}</p>}
    </div>
  )
}
