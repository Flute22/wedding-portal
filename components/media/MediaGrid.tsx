'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Images, Film } from 'lucide-react'
import { MediaCard } from './MediaCard'
import { BulkDownloadButton } from './BulkDownloadButton'
import { createClient } from '@/lib/supabase/client'
import type { MediaFile } from '@/types/database'

type Filter = 'all' | 'photo' | 'video' | 'favorites'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',       label: 'All files'  },
  { key: 'photo',     label: 'Photos'     },
  { key: 'video',     label: 'Videos'     },
  { key: 'favorites', label: 'Favourites' },
]

interface MediaGridProps {
  files: MediaFile[]
}

export function MediaGrid({ files: initialFiles }: MediaGridProps) {
  const [files,  setFiles]  = useState(initialFiles)
  const [filter, setFilter] = useState<Filter>('all')
  const supabase = createClient()

  const displayed = files.filter(f => {
    if (filter === 'photo')     return f.file_type === 'photo'
    if (filter === 'video')     return f.file_type === 'video'
    if (filter === 'favorites') return f.is_favorite
    return true
  })

  const handleFavoriteToggle = useCallback(async (id: string, value: boolean) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, is_favorite: value } : f))
    await supabase.from('media_files').update({ is_favorite: value }).eq('id', id)
  }, [supabase])

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-gold-100 border border-gold-200 flex items-center justify-center mb-4">
          <Images size={24} className="text-gold-400" strokeWidth={1.3} />
        </div>
        <h2 className="text-xl font-serif text-ink mb-1">Your gallery is coming soon</h2>
        <p className="text-sm text-stone-500 max-w-xs">
          Your photos and videos will appear here once your editor has delivered them.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-cream-dark px-8 py-4 flex items-center justify-between gap-4">
        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(({ key, label }) => {
            const count = key === 'all'       ? files.length
                        : key === 'photo'     ? files.filter(f => f.file_type === 'photo').length
                        : key === 'video'     ? files.filter(f => f.file_type === 'video').length
                        : files.filter(f => f.is_favorite).length
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === key
                    ? 'bg-gold-400 text-white shadow-sm'
                    : 'bg-white border border-cream-dark text-stone-600 hover:border-gold-300'
                }`}
              >
                {label}
                <span className={`ml-1.5 ${filter === key ? 'text-white/70' : 'text-stone-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bulk download */}
        {files.length > 0 && <BulkDownloadButton />}
      </div>

      {/* Grid */}
      <div className="px-8 py-8">
        {displayed.length === 0 ? (
          <p className="text-stone-400 text-sm py-12 text-center">No files in this filter.</p>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          >
            <AnimatePresence mode="popLayout">
              {displayed.map(file => (
                <MediaCard
                  key={file.id}
                  file={file}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
