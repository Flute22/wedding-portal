import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Images, CalendarDays, ArrowRight } from 'lucide-react'
import { formatBytes } from '@/lib/utils/formatBytes'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function ClientDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: client },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('clients').select('*, media_files(count), appointments(*)').eq('user_id', user.id).single(),
  ])

  const mediaCount = (client as any)?.media_files?.[0]?.count ?? 0
  const upcomingAppointments = ((client as any)?.appointments ?? [])
    .filter((a: any) => a.status !== 'cancelled' && new Date(a.start_time) > new Date())
    .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  const nextAppointment = upcomingAppointments[0] ?? null

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="px-8 py-10 max-w-4xl">
      {/* Welcome */}
      <div className="mb-10 animate-fade-in">
        <p className="section-label mb-2">Welcome back</p>
        <h1 className="text-4xl font-serif text-ink">
          Hello, <span className="italic text-gradient-gold">{firstName}</span> ✨
        </h1>
        {client?.wedding_date && (
          <p className="text-stone-500 mt-2 text-sm">
            Wedding date: {format(new Date(client.wedding_date), 'MMMM d, yyyy')}
          </p>
        )}
      </div>

      {/* Gold divider */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex-1 h-px bg-gold-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
        <div className="flex-1 h-px bg-gold-200" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 animate-slide-up">
        <Link href="/media" className="card p-6 group hover:shadow-gold transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-label mb-3">Delivered files</p>
              <p className="text-4xl font-serif text-ink">{mediaCount}</p>
              <p className="text-sm text-stone-500 mt-1">
                {mediaCount === 0 ? 'Your gallery will appear here' : 'photos & videos ready to download'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gold-100 border border-gold-200 flex items-center justify-center shrink-0">
              <Images size={20} className="text-gold-500" strokeWidth={1.5} />
            </div>
          </div>
          {mediaCount > 0 && (
            <div className="mt-5 flex items-center gap-1.5 text-sm text-gold-500 group-hover:gap-2.5 transition-all">
              View gallery <ArrowRight size={14} />
            </div>
          )}
        </Link>

        <Link href="/appointments" className="card p-6 group hover:shadow-gold transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-label mb-3">Next appointment</p>
              {nextAppointment ? (
                <>
                  <p className="text-lg font-serif text-ink">
                    {format(new Date(nextAppointment.start_time), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {format(new Date(nextAppointment.start_time), 'h:mm a')} ·{' '}
                    {nextAppointment.appointment_type.replace('_', ' ')}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-serif text-stone-400">No upcoming sessions</p>
                  <p className="text-sm text-stone-400 mt-0.5">Book a consultation below</p>
                </>
              )}
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blush-light border border-blush flex items-center justify-center shrink-0">
              <CalendarDays size={20} className="text-ink-light" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-sm text-gold-500 group-hover:gap-2.5 transition-all">
            {nextAppointment ? 'View all bookings' : 'Book a session'} <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* CTA to booking */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif text-ink">Want to book a review session?</h2>
          <p className="text-sm text-stone-500 mt-0.5">Check live availability and book a time that works for you.</p>
        </div>
        <Link
          href="/book"
          className="shrink-0 inline-flex items-center gap-2 bg-gold-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-500 transition-colors"
        >
          Book now <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
