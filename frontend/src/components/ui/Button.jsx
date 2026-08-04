import { cn } from './cn'

const VARIANTS = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  soft: 'btn-soft',
  danger: 'btn-danger',
}
const SIZES = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      disabled={Comp === 'button' ? disabled || loading : undefined}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden />
      )}
      {children}
    </Comp>
  )
}
