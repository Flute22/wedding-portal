'use client'
import { useCallback, useRef, useState } from 'react'
import { Upload, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatBytes } from '@/lib/utils/formatBytes'
import { createClient } from '@/lib/supabase/client'

interface UploadItem {
  file:     File
  progress: number  // 0–100
  status:   'uploading' | 'done' | 'error'
  error?:   string
}

interface UploadZoneProps {
  clientId: string
  onUploaded?: () => void
}

export function UploadZone({ clientId, onUploaded }: UploadZoneProps) {
  const [items,     setItems]     = useState<UploadItem[]>([])
  const [dragging,  setDragging]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadFile = useCallback(async (file: File) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const storagePath = `clients/${clientId}/${Date.now()}-${file.name}`

    setItems(prev => [...prev, { file, progress: 0, status: 'uploading' }])

    try {
      // Dynamic import to avoid SSR issues
      const tus = await import('tus-js-client')

      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${session.access_token}`,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName:  'client-media',
            objectName:  storagePath,
            contentType: file.type,
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024,
          onError: reject,
          onProgress: (uploaded, total) => {
            const pct = Math.round((uploaded / total) * 100)
            setItems(prev => prev.map(i => i.file === file ? { ...i, progress: pct } : i))
          },
          onSuccess: async () => {
            await fetch('/api/admin/register-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                client_id:    clientId,
                file_name:    file.name,
                file_type:    file.type.startsWith('video/') ? 'video' : 'photo',
                storage_path: storagePath,
                size_bytes:   file.size,
              }),
            })
            setItems(prev => prev.map(i => i.file === file ? { ...i, status: 'done', progress: 100 } : i))
            onUploaded?.()
            resolve()
          },
        })
        upload.findPreviousUploads().then(prev => {
          if (prev.length > 0) upload.resumeFromPreviousUpload(prev[0])
          upload.start()
        })
      })
    } catch (err) {
      setItems(prev => prev.map(i =>
        i.file === file ? { ...i, status: 'error', error: 'Upload failed' } : i
      ))
    }
  }, [clientId, supabase, onUploaded])

  const addFiles = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach(uploadFile)
  }, [uploadFile])

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragEnter={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={e => { e.preventDefault(); setDragging(false) }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
          dragging
            ? 'border-gold-400 bg-gold-50 scale-[1.01]'
            : 'border-stone-200 bg-cream hover:border-gold-300 hover:bg-gold-50/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 border border-gold-200 flex items-center justify-center">
            <Upload size={20} className="text-gold-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Drop files here or click to browse</p>
            <p className="text-xs text-stone-400 mt-1">Photos &amp; videos · Up to 20 GB per file · Resumable</p>
          </div>
        </div>
      </div>

      {/* Upload progress list */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-cream-dark rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink truncate">{item.file.name}</p>
                <p className="text-xs text-stone-400">{formatBytes(item.file.size)}</p>
                {item.status === 'uploading' && (
                  <div className="mt-1.5 h-1 bg-cream-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-400 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.error && <p className="text-xs text-red-500 mt-1">{item.error}</p>}
              </div>
              {item.status === 'done' && (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              )}
              {item.status === 'uploading' && (
                <span className="text-xs text-stone-400 shrink-0">{item.progress}%</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
