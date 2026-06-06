import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react'

export default function ReelActions({ 
  reel,
  onLike,
  onComment,
  onShare,
  onSave,
  onMore,
  className = ''
}) {
  const [isLiking, setIsLiking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)

  // ══════════════════════════════════════════════════════════════════════════════
  // ANIMATION EFFECTS
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (likeAnimation) {
      const timer = setTimeout(() => setLikeAnimation(false), 300)
      return () => clearTimeout(timer)
    }
  }, [likeAnimation])

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleLike = async (e) => {
    e.stopPropagation()
    
    if (isLiking) return
    
    setIsLiking(true)
    setLikeAnimation(true)
    
    try {
      await onLike?.(reel.id)
    } catch (error) {
      console.error('Error liking reel:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = (e) => {
    e.stopPropagation()
    onComment?.(reel.id)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    onShare?.(reel.id)
  }

  const handleSave = async (e) => {
    e.stopPropagation()
    
    if (isSaving) return
    
    setIsSaving(true)
    
    try {
      await onSave?.(reel.id)
    } catch (error) {
      console.error('Error saving reel:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleMore = (e) => {
    e.stopPropagation()
    onMore?.(reel.id)
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const formatCount = (count) => {
    if (!count || count === 0) return ''
    
    if (count < 1000) {
      return count.toString()
    } else if (count < 1000000) {
      return `${(count / 1000).toFixed(1)}k`
    } else {
      return `${(count / 1000000).toFixed(1)}M`
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  if (!reel) return null

  // Normalizar nomes de propriedades (API vs Mock)
  const likes = reel.likes || reel.likes_count || 0
  const comments = reel.comments || reel.comments_count || 0
  const shares = reel.shares || reel.shares_count || 0
  const saves = reel.saves || reel.is_bookmarked ? 1 : 0
  const isLiked = reel.isLiked || reel.is_liked || false
  const isSaved = reel.isSaved || reel.is_bookmarked || false

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Like Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-200 transform
            ${isLiked 
              ? 'bg-red-500/30 text-red-400' 
              : 'text-white hover:scale-110'
            }
            ${likeAnimation ? 'animate-pulse' : ''}
            ${isLiking ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
          `}
        >
          <Heart 
            className={`w-7 h-7 transition-all duration-200 stroke-2 ${
              isLiked ? 'fill-current' : ''
            }`}
          />
        </button>
        
        {likes > 0 && (
          <span className="text-white text-xs font-medium">
            {formatCount(likes)}
          </span>
        )}
      </div>

      {/* Comment Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleComment}
          className="
            w-12 h-12 rounded-full text-white flex items-center justify-center
            hover:scale-110 active:scale-95
            transition-all duration-200 transform
          "
        >
          <MessageCircle className="w-7 h-7 stroke-2" />
        </button>
        
        {comments > 0 && (
          <span className="text-white text-xs font-medium">
            {formatCount(comments)}
          </span>
        )}
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleShare}
          className="
            w-12 h-12 rounded-full text-white flex items-center justify-center
            hover:scale-110 active:scale-95
            transition-all duration-200 transform
          "
        >
          <Share className="w-7 h-7 stroke-2" />
        </button>
        
        {shares > 0 && (
          <span className="text-white text-xs font-medium">
            {formatCount(shares)}
          </span>
        )}
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-200 transform
            ${isSaved 
              ? 'text-yellow-400' 
              : 'text-white hover:scale-110'
            }
            ${isSaving ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
          `}
        >
          <Bookmark 
            className={`w-7 h-7 transition-all duration-200 stroke-2 ${
              isSaved ? 'fill-current' : ''
            }`}
          />
        </button>
        
        {saves > 0 && (
          <span className="text-white text-xs font-medium">
            {formatCount(saves)}
          </span>
        )}
      </div>

      {/* More Options Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleMore}
          className="
            w-12 h-12 rounded-full text-white flex items-center justify-center
            hover:scale-110 active:scale-95
            transition-all duration-200 transform
          "
        >
          <MoreHorizontal className="w-7 h-7 stroke-2" />
        </button>
      </div>
    </div>
  )
}
