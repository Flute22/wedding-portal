'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, Heart, Play, Film, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatBytes } from '@/lib/utils/formatBytes'
import type { MediaFile } from '@/types/database'

interface MediaCardProps {
  file: MediaFile
  onFavoriteToggle?: (id: string, value: boolean) => void
}

export function MediaCard({ file, onFavoriteToggle }: MediaCardProps) {
  const [isFav, setIsFav] = useState(file.is_favorite)
  const [favLoading, setFavLoading] = useState(false)

  const isVideo = file.file_type === 'video'

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation()
    if (favLoading) return
    setFavLoading(true)
    const next = !isFav
    setIsFav(next)
    onFavoriteToggle?.(file.id, next)
    setFavLoading(false)
  }

  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation()
    if (!file.url) return
    const res = await fetch(file.url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = file.file_name
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden bg-cream-dark aspect-square cursor-pointer"
    >
      {/* Thumbnail */}
      {file.url && !isVideo ? (
        <Image
          src={file.url}
          alt={file.file_name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-ink/5">
          {isVideo ? (
            <Film size={32} className="text-stone-400" strokeWidth={1.2} />
          ) : (
            <ImageIcon size={32} className="text-stone-400" strokeWidth={1.2} />
          )}
          <span className="text-xs text-stone-400 px-3 text-center truncate max-w-full">{file.file_name}</span>
        </div>
      )}

      {/* Video play badge */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
        <p className="text-white text-xs font-medium truncate">{file.file_name}</p>
        <p className="text-white/60 text-xs">{formatBytes(file.size_bytes)}</p>
      </div>

      {/* Top-right action buttons */}
      <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Favorite */}
        <button
          onClick={toggleFavorite}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all',
            isFav
              ? 'bg-red-500/90 text-white'
              : 'bg-black/30 text-white/80 hover:bg-black/50'
          )}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={14} fill={isFav ? 'white' : 'none'} />
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 transition-all"
          title="Download"
        >
          <Download size={14} />
        </button>
      </div>

      {/* Type badge top-left */}
      <div className="absolute top-2.5 left-2.5">
        <span className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm',
          isVideo
            ? 'bg-ink/70 text-gold-300'
            : 'bg-white/20 text-white'
        )}>
          {isVideo ? 'VIDEO' : 'PHOTO'}
        </span>
      </div>
    </motion.div>
  )
}
