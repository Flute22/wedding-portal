'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BulkDownloadButton() {
  const [loading, setLoading]   = useState(false)
  const [progress, setProgress] = useState<string | null>(null)

  async function handleDownload() {
    setLoading(true)
    setProgress('Preparing your archive…')

    try {
      const res = await fetch('/api/download-zip')
      if (!res.ok) throw new Error('Download failed')

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'your-wedding-media.zip'
      a.click()
      URL.revokeObjectURL(url)
      setProgress(null)
    } catch (e) {
      setProgress('Something went wrong. Please try again.')
      setTimeout(() => setProgress(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {progress && (
        <span className="text-xs text-stone-500 animate-pulse">{progress}</span>
      )}
      <Button
        variant="outline"
        size="sm"
        loading={loading}
        onClick={handleDownload}
        className="gap-1.5"
      >
        <Download size={14} />
        Download all
      </Button>
    </div>
  )
}
