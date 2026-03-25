'use client'
import { useState } from 'react'
import { Trash2, Film, ImageIcon, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatBytes } from '@/lib/utils/formatBytes'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import type { MediaFile } from '@/types/database'

interface AdminMediaListProps {
  files:    MediaFile[]
  clientId: string
}

export function AdminMediaList({ files: initial, clientId }: AdminMediaListProps) {
  const [files,   setFiles]   = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  async function deleteFile(file: MediaFile) {
    if (!confirm(`Delete "${file.file_name}"? This cannot be undone.`)) return
    setDeleting(file.id)

    // Remove from storage
    await supabase.storage.from('client-media').remove([file.storage_path])
    // Remove DB record
    await supabase.from('media_files').delete().eq('id', file.id)

    setFiles(prev => prev.filter(f => f.id !== file.id))
    setDeleting(null)
  }

  if (files.length === 0) {
    return <p className="text-sm text-stone-400 py-6 text-center">No files uploaded yet.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {files.map(file => (
        <div key={file.id} className="flex items-center gap-3 bg-white border border-cream-dark rounded-xl px-4 py-3">
          {/* Type icon */}
          <div className="w-8 h-8 rounded-lg bg-cream-dark flex items-center justify-center shrink-0">
            {file.file_type === 'video'
              ? <Film size={15} className="text-stone-500" strokeWidth={1.5} />
              : <ImageIcon size={15} className="text-stone-500" strokeWidth={1.5} />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ink font-medium truncate">{file.file_name}</p>
            <p className="text-xs text-stone-400">
              {formatBytes(file.size_bytes)} · {format(new Date(file.created_at), 'MMM d, yyyy')}
            </p>
          </div>

          {/* Badges */}
          <Badge variant={file.file_type === 'video' ? 'gold' : 'blush'}>
            {file.file_type.toUpperCase()}
          </Badge>
          {file.is_favorite && <Badge variant="green">★ Fav</Badge>}

          {/* Actions */}
          {file.url && (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-gold-500 hover:bg-gold-50 transition-all"
              title="Open"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            onClick={() => deleteFile(file)}
            disabled={deleting === file.id}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
            title="Delete"
          >
            {deleting === file.id
              ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Trash2 size={14} />
            }
          </button>
        </div>
      ))}
    </div>
  )
}
