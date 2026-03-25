'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Images, CalendarDays, LayoutDashboard, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Logo } from './Logo'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard',     icon: LayoutDashboard, label: 'Overview'   },
  { href: '/media',         icon: Images,          label: 'My Gallery' },
  { href: '/appointments',  icon: CalendarDays,    label: 'Bookings'   },
]

export function ClientNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-white border-r border-cream-dark shadow-soft">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-cream-dark">
        <Logo size="sm" href="/dashboard" />
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 py-6 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-gold-50 text-gold-600 font-medium border border-gold-200'
                : 'text-stone-600 hover:bg-cream-dark hover:text-ink'
            )}
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-cream-dark">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-500 hover:bg-cream-dark hover:text-ink transition-all duration-150"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </nav>
  )
}
