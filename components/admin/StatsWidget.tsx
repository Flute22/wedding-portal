import { cn } from '@/lib/utils/cn'

interface StatsWidgetProps {
  label:    string
  value:    string | number
  sub?:     string
  icon?:    React.ReactNode
  accent?:  'gold' | 'blush' | 'green'
}

const accentClasses = {
  gold:  'bg-gold-50 border-gold-200',
  blush: 'bg-blush-light border-blush',
  green: 'bg-emerald-50 border-emerald-200',
}

const iconClasses = {
  gold:  'bg-gold-100 border-gold-200 text-gold-500',
  blush: 'bg-blush border-blush-dark text-ink-light',
  green: 'bg-emerald-100 border-emerald-200 text-emerald-600',
}

export function StatsWidget({ label, value, sub, icon, accent = 'gold' }: StatsWidgetProps) {
  return (
    <div className={cn('rounded-2xl border p-5 flex items-start justify-between gap-4', accentClasses[accent])}>
      <div>
        <p className="section-label mb-3">{label}</p>
        <p className="text-3xl font-serif text-ink">{value}</p>
        {sub && <p className="text-xs text-stone-500 mt-1">{sub}</p>}
      </div>
      {icon && (
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', iconClasses[accent])}>
          {icon}
        </div>
      )}
    </div>
  )
}
