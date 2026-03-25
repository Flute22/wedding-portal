import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ChevronRight, User } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const supabase = createAdminClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*, profiles!user_id(*), media_files(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="px-8 py-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="section-label mb-1">All clients</p>
          <h1 className="text-3xl font-serif text-ink">Clients</h1>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 bg-gold-400 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-500 transition-colors"
        >
          <Plus size={15} />
          New client
        </Link>
      </div>

      {clients?.length === 0 && (
        <div className="card p-12 text-center">
          <User size={32} className="text-stone-300 mx-auto mb-3" strokeWidth={1.2} />
          <p className="text-stone-400 mb-4">No clients yet.</p>
          <Link href="/admin/clients/new" className="text-sm text-gold-500 hover:text-gold-600">
            Create your first client →
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {(clients ?? []).map((client: any) => (
          <Link
            key={client.id}
            href={`/admin/clients/${client.id}`}
            className="card p-5 flex items-center gap-4 hover:shadow-gold transition-shadow group"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center shrink-0 text-gold-500 font-serif text-lg">
              {client.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{client.profiles?.full_name ?? '—'}</p>
              <p className="text-xs text-stone-400">{client.profiles?.email}</p>
              <div className="flex items-center gap-3 mt-1">
                {client.wedding_date && (
                  <span className="text-xs text-stone-500">
                    Wedding: {format(new Date(client.wedding_date), 'MMM d, yyyy')}
                  </span>
                )}
                {client.package_type && (
                  <Badge variant="gold">{client.package_type}</Badge>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm text-ink font-medium">
                {client.media_files?.[0]?.count ?? 0}
              </p>
              <p className="text-xs text-stone-400">files</p>
            </div>

            <ChevronRight size={16} className="text-stone-300 group-hover:text-gold-400 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
