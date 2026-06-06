import { useState } from 'react'
import { Play, Eye } from 'lucide-react'
import Badge from '../ui/Badge'
import { CATEGORIES } from '../../context/ReelsContext'

/**
 * ReelCard Component
 * 
 * Exibe um reel em formato de card com thumbnail, duração, visualizações e categoria
 * Usado em grids de reels (perfil, busca, trending, etc)
 * 
 * Features:
 * - Thumbnail com overlay de duração
 * - Badge de categoria
 * - Contador de visualizações
 * - Hover effect com preview animation
 * - Click handler para abrir player
 */
export default function ReelCard({ 
  reel, 
  onClick,
  className = ''
}) {
  const [isHovering, setIsHovering] = useState(false)

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (!views || views === 0) return '0'
    
    if (views < 1000) {
      return views.toString()
    } else if (views < 1000000) {
      return `${(views / 1000).toFixed(1)}k`
    } else {
      return `${(views / 1000000).toFixed(1)}M`
    }
  }

  const getCategoryConfig = (categoryKey) => {
    return CATEGORIES.find(cat => cat.key === categoryKey) || CATEGORIES[0]
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleClick = () => {
    onClick?.(reel)
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  if (!reel) return null

  const categoryConfig = getCategoryConfig(reel.category)
  const duration = formatDuration(reel.duration)
  const views = formatViews(reel.views)

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        relative w-full aspect-video bg-black rounded-lg overflow-hidden
        group cursor-pointer transition-all duration-200 transform
        hover:scale-105 hover:shadow-lg
        ${className}
      `}
    >
      {/* Thumbnail */}
      <img
        src={reel.thumbnailUrl || 'https://via.placeholder.com/300x400?text=Reel'}
        alt={reel.description || 'Reel'}
        className="w-full h-full object-cover"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
          <Play className="w-6 h-6 text-black fill-black ml-1" />
        </div>
      </div>

      {/* Duration Badge */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
        {duration}
      </div>

      {/* Category Badge */}
      {reel.category && (
        <div 
          className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1"
          style={{ backgroundColor: categoryConfig.color }}
        >
          <span className="text-sm">{categoryConfig.icon}</span>
          <span className="hidden sm:inline">{categoryConfig.label}</span>
        </div>
      )}

      {/* Views Counter */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
        <Eye className="w-3 h-3" />
        <span>{views}</span>
      </div>

      {/* Creator Info (on hover) */}
      {isHovering && reel.creator && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {reel.creator.avatar ? (
            <img 
              src={reel.creator.avatar}
              alt={reel.creator.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-xs font-semibold">
              {reel.creator.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </div>
          )}
          <span className="truncate max-w-[100px]">{reel.creator.name}</span>
        </div>
      )}
    </button>
  )
}
