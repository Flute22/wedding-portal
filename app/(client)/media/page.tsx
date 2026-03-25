import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MediaGrid } from '@/components/media/MediaGrid'
import type { MediaFile } from '@/types/database'

export const metadata: Metadata = { title: 'My Gallery' }

export default async function MediaPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // RLS ensures this only returns the authenticated client's files
  const { data: files, error } = await supabase
    .from('media_files')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('media_files error:', error)
  }

  // Generate signed URLs for each file (1-hour TTL)
  const filesWithUrls: MediaFile[] = await Promise.all(
    (files ?? []).map(async (file) => {
      const { data } = await supabase.storage
        .from('client-media')
        .createSignedUrl(file.storage_path, 3600)

      return { ...file, url: data?.signedUrl ?? null } as MediaFile
    })
  )

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="px-8 pt-10 pb-6 border-b border-cream-dark bg-cream">
        <p className="section-label mb-1">Private gallery</p>
        <h1 className="text-3xl font-serif text-ink">Your Wedding Memories</h1>
        {filesWithUrls.length > 0 && (
          <p className="text-sm text-stone-500 mt-1.5">
            {filesWithUrls.length} file{filesWithUrls.length !== 1 ? 's' : ''} delivered
          </p>
        )}
      </div>

      <MediaGrid files={filesWithUrls} />
    </div>
  )
}
