import { useEffect } from 'react'
import { cn } from './cn'

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

export default function Modal({ open, onClose, title, size = 'md', children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative w-full bg-surface rounded-3xl border border-line shadow-lift animate-scale-in max-h-[90vh] flex flex-col', SIZES[size])}>
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-line">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-cream-200 hover:text-ink transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 p-5 sm:p-6 border-t border-line">{footer}</div>}
      </div>
    </div>
  )
}
