import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { AppointmentTable } from '@/components/admin/AppointmentTable'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Appointments' }

export default async function AdminAppointmentsPage() {
  const supabase = createAdminClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('start_time', { ascending: true })

  const pending   = (appointments ?? []).filter(a => a.status === 'pending')
  const upcoming  = (appointments ?? []).filter(a =>
    a.status !== 'cancelled' && a.status !== 'completed' && new Date(a.start_time) >= new Date()
  )
  const past      = (appointments ?? []).filter(a =>
    a.status === 'completed' || (a.status !== 'cancelled' && new Date(a.start_time) < new Date())
  )
  const cancelled = (appointments ?? []).filter(a => a.status === 'cancelled')

  return (
    <div className="px-8 py-10 max-w-3xl">
      <div className="mb-8">
        <p className="section-label mb-1">Calendar</p>
        <h1 className="text-3xl font-serif text-ink">Appointments</h1>
        <p className="text-sm text-stone-400 mt-1">
          {pending.length} pending · {upcoming.length} upcoming
        </p>
      </div>

      {/* Pending first — needs action */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Awaiting confirmation ({pending.length})
          </h2>
          <AppointmentTable appointments={pending as any} />
        </section>
      )}

      {/* Upcoming confirmed */}
      {upcoming.filter(a => a.status === 'confirmed').length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-stone-500 mb-3">Upcoming confirmed</h2>
          <AppointmentTable appointments={upcoming.filter(a => a.status === 'confirmed') as any} />
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="mb-8 opacity-70">
          <h2 className="text-sm font-medium text-stone-500 mb-3">Past sessions</h2>
          <AppointmentTable appointments={past as any} />
        </section>
      )}

      {/* Cancelled */}
      {cancelled.length > 0 && (
        <section className="mb-8 opacity-50">
          <h2 className="text-sm font-medium text-stone-500 mb-3">Cancelled</h2>
          <AppointmentTable appointments={cancelled as any} />
        </section>
      )}

      {(appointments ?? []).length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-stone-400">No appointments yet.</p>
          <p className="text-xs text-stone-300 mt-1">They'll appear here once clients book via the public booking page.</p>
        </div>
      )}
    </div>
  )
}
