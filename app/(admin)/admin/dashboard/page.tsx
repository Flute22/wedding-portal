import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, Images, CalendarDays, Clock, ArrowRight } from 'lucide-react'
import { StatsWidget } from '@/components/admin/StatsWidget'
import { AppointmentTable } from '@/components/admin/AppointmentTable'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: clientCount },
    { count: mediaCount  },
    { data:  appointments },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('media_files').select('*', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('*')
      .order('start_time', { ascending: true })
      .limit(20),
  ])

  const pending   = (appointments ?? []).filter(a => a.status === 'pending')
  const upcoming  = (appointments ?? []).filter(a =>
    a.status !== 'cancelled' && new Date(a.start_time) >= new Date()
  ).slice(0, 5)

  return (
    <div className="px-8 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-1">Overview</p>
        <h1 className="text-3xl font-serif text-ink">Dashboard</h1>
        <p className="text-sm text-stone-400 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsWidget
          label="Total clients"
          value={clientCount ?? 0}
          sub="active accounts"
          icon={<Users size={18} strokeWidth={1.5} />}
          accent="gold"
        />
        <StatsWidget
          label="Files delivered"
          value={mediaCount ?? 0}
          sub="photos & videos"
          icon={<Images size={18} strokeWidth={1.5} />}
          accent="blush"
        />
        <StatsWidget
          label="Pending bookings"
          value={pending.length}
          sub="need confirmation"
          icon={<Clock size={18} strokeWidth={1.5} />}
          accent="gold"
        />
        <StatsWidget
          label="Upcoming sessions"
          value={upcoming.length}
          sub="next 7 days"
          icon={<CalendarDays size={18} strokeWidth={1.5} />}
          accent="green"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Upcoming appointments */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-ink">Upcoming sessions</h2>
            <Link href="/admin/appointments" className="text-xs text-gold-500 hover:text-gold-600 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <AppointmentTable appointments={upcoming as any} />
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-serif text-ink mb-4">Quick actions</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/clients/new"
              className="card p-4 hover:shadow-gold transition-shadow flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-medium text-ink">Create new client</p>
                <p className="text-xs text-stone-400 mt-0.5">Set up a client account</p>
              </div>
              <ArrowRight size={16} className="text-stone-400 group-hover:text-gold-500 transition-colors" />
            </Link>
            <Link
              href="/admin/clients"
              className="card p-4 hover:shadow-gold transition-shadow flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-medium text-ink">Upload media</p>
                <p className="text-xs text-stone-400 mt-0.5">Deliver photos & videos</p>
              </div>
              <ArrowRight size={16} className="text-stone-400 group-hover:text-gold-500 transition-colors" />
            </Link>
            <Link
              href="/book"
              target="_blank"
              className="card p-4 hover:shadow-gold transition-shadow flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-medium text-ink">View booking page</p>
                <p className="text-xs text-stone-400 mt-0.5">Public URL for clients</p>
              </div>
              <ArrowRight size={16} className="text-stone-400 group-hover:text-gold-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
