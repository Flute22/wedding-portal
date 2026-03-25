import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function Logo({ href = '/', size = 'md', className }: LogoProps) {
  return (
    <Link href={href} className={cn('group inline-flex flex-col items-center gap-0.5', className)}>
      <span className={cn('font-serif italic text-ink leading-none tracking-wide', sizeClasses[size])}>
        Khushal Sinhmar
      </span>
      <span className="text-[10px] tracking-[0.25em] uppercase text-gold-500 font-sans">
        Films & Photography
      </span>
    </Link>
  )
}
