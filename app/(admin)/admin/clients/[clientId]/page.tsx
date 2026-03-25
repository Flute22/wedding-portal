import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Package, StickyNote } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { UploadZone } from '@/components/media/UploadZone'
import { AdminMediaList } from '@/components/admin/AdminMediaList'
import { formatBytes } from '@/lib/utils/formatBytes'

export const metadata: Metadata = { title: 'Client Detail' }

interface Props {
  params: { clientId: string }
}

export default async function ClientDetailPage({ params }: Props) {
  const supabase = createAdminClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*, profiles!user_id(*)')
    .eq('id', params.clientId)
    .single()

  if (!client) notFound()

  const { data: files } = await supabase
    .from('media_files')
    .select('*')
    .eq('client_id', params.clientId)
    .order('created_at', { ascending: false })

  // Generate signed URLs for preview
  const filesWithUrls = await Promise.all(
    (files ?? []).map(async (f) => {
      const { data } = await supabase.storage
        .from('client-media')
        .createSignedUrl(f.storage_path, 3600)
      return { ...f, url: data?.signedUrl ?? null }
    })
  )

  const totalSize = (files ?? []).reduce((sum, f) => sum + (f.size_bytes ?? 0), 0)

  return (
    <div className="px-8 py-10 max-w-5xl">
      <Link href="/admin/clients" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 mb-6">
        <ArrowLeft size={14} /> All clients
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: client info */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gold-100 border-2 border-gold-200 flex items-center justify-center text-gold-500 font-serif text-2xl mb-4">
              {client.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>

            <h2 className="text-xl font-serif text-ink">{client.profiles?.full_name}</h2>
            <p className="text-sm text-stone-500 mt-0.5">{client.profiles?.email}</p>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              {client.wedding_date && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar size={14} className="text-gold-400 shrink-0" />
                  {format(new Date(client.wedding_date), 'MMMM d, yyyy')}
                </div>
              )}
              {client.package_type && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Package size={14} className="text-gold-400 shrink-0" />
                  {client.package_type}
                </div>
              )}
              {client.notes && (
                <div className="flex items-start gap-2 text-stone-500">
                  <StickyNote size={14} className="text-gold-400 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{client.notes}</p>
                </div>
              )}
            </div>

            {/* Media stats */}
            <div className="mt-6 pt-5 border-t border-cream-dark grid grid-cols-2 gap-3">
              <div>
                <p className="section-label mb-1">Files</p>
                <p className="text-2xl font-serif text-ink">{files?.length ?? 0}</p>
              </div>
              <div>
                <p className="section-label mb-1">Total size</p>
                <p className="text-sm font-medium text-ink">{formatBytes(totalSize)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: upload + file list */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Upload zone */}
          <div>
            <h3 className="text-lg font-serif text-ink mb-4">Upload media</h3>
            <UploadZone clientId={params.clientId} />
          </div>

          {/* Files */}
          <div>
            <h3 className="text-lg font-serif text-ink mb-4">Delivered files</h3>
            <AdminMediaList files={filesWithUrls} clientId={params.clientId} />
          </div>
        </div>
      </div>
    </div>
  )
}
