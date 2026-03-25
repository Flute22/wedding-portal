import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, CalendarPlus } from 'lucide-react'
import type { Appointment, AppointmentStatus } from '@/types/database'

export const metadata: Metadata = { title: 'My Bookings' }

const statusBadge: Record<AppointmentStatus, { variant: any; label: string }> = {
  pending:   { variant: 'gold',  label: 'Pending'   },
  confirmed: { variant: 'green', label: 'Confirmed' },
  cancelled: { variant: 'red',   label: 'Cancelled' },
  completed: { variant: 'grey',  label: 'Completed' },
}

const typeLabel: Record<string, string> = {
  consultation:   'Consultation',
  review_session: 'Review Session',
  other:          'Session',
}

export default async function AppointmentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('start_time', { ascending: false })

  const upcoming = (appointments ?? []).filter(a =>
    a.status !== 'cancelled' && new Date(a.start_time) >= new Date()
  )
  const past = (appointments ?? []).filter(a =>
    a.status === 'cancelled' || new Date(a.start_time) < new Date()
  )

  return (
    <div className="px-8 py-10 max-w-2xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="section-label mb-1">Calendar</p>
          <h1 className="text-3xl font-serif text-ink">Your Bookings</h1>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 bg-gold-400 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gold-500 transition-colors"
        >
          <CalendarPlus size={15} />
          Book a session
        </Link>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-stone-400 mb-4">No sessions booked yet.</p>
          <Link href="/book" className="inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600">
            Book your first session <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-stone-500 mb-3">Upcoming</h2>
              <div className="flex flex-col gap-3">
                {upcoming.map(appt => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-stone-500 mb-3">Past sessions</h2>
              <div className="flex flex-col gap-3 opacity-70">
                {past.map(appt => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function AppointmentCard({ appointment: appt }: { appointment: any }) {
  const { variant, label } = statusBadge[appt.status as AppointmentStatus] ?? { variant: 'grey', label: appt.status }
  return (
    <div className="card p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-base font-serif text-ink">
          {format(new Date(appt.start_time), 'EEEE, MMMM d, yyyy')}
        </p>
        <p className="text-sm text-stone-500 mt-0.5">
          {format(new Date(appt.start_time), 'h:mm a')} – {format(new Date(appt.end_time), 'h:mm a')}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          {typeLabel[appt.appointment_type] ?? appt.appointment_type}
        </p>
        {appt.notes && (
          <p className="text-xs text-stone-400 mt-1 italic">"{appt.notes}"</p>
        )}
      </div>
      <Badge variant={variant}>{label}</Badge>
    </div>
  )
}
