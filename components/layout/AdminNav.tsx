'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Users, CalendarDays, LayoutDashboard, LogOut, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Logo } from './Logo'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { href: '/admin/clients',      icon: Users,           label: 'Clients'      },
  { href: '/admin/appointments', icon: CalendarDays,    label: 'Appointments' },
]

export function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-ink text-cream">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <span className="text-base font-serif italic tracking-wide text-gold-400 leading-none block">
          Khushal Sinhmar
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-sans mt-1 block">
          Admin Dashboard
        </span>
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
                ? 'bg-gold-400/20 text-gold-400 font-medium'
                : 'text-stone-400 hover:bg-white/10 hover:text-cream'
            )}
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-white/10 hover:text-cream transition-all duration-150"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </nav>
  )
}
