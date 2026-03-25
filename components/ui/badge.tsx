import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'gold' | 'blush' | 'green' | 'red' | 'grey'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-ink text-cream',
  gold:    'bg-gold-100 text-gold-600 border border-gold-300',
  blush:   'bg-blush-light text-ink border border-blush',
  green:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  red:     'bg-red-50 text-red-700 border border-red-200',
  grey:    'bg-cream-dark text-stone-600 border border-cream-dark',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  )
}
