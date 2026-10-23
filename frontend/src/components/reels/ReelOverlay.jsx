
import { useState, useRef } from 'react'
import { Hash } from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'
import Button from '../ui/Button'
import { CATEGORIES } from '../../context/ReelsContext'
import { stringifyUniversity } from '../../utils/university'

export default function ReelOverlay({ 
  reel, 
  onCreatorClick, 
  onHashtagClick, 
  onFollowClick, 
  facebookHeaderOnly = false,
  facebookFooterOnly = false
}) {
  // Fallback defensivo para evitar tela branca
  if (!reel) return null;
  
  // Normalizar creator/author para interface unificada
  const creator = reel?.creator || reel?.author || {}
  
  const [showMenu, setShowMenu] = useState(false);
  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowMenu((v) => !v);
  }
  const moreBtnRef = useRef(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const getCategoryConfig = (categoryKey) => {
    return CATEGORIES.find(cat => cat.key === categoryKey) || CATEGORIES[0]
  }

  const shouldTruncateDescription = (text) => {
    return text && text.length > 120
  }

  const getTruncatedDescription = (text) => {
    // ...existing code...
  }

  // Footer Facebook Style
  if (facebookFooterOnly) {
    // Variáveis auxiliares
    const description = reel?.description || '';
    const hashtags = reel?.hashtags || [];
    const shouldTruncate = shouldTruncateDescription(description);
    const displayDescription = shouldTruncate && !showFullDescription
      ? description.slice(0, 120) + '...'
      : description;
    const handleDescriptionToggle = () => setShowFullDescription(v => !v);
    const handleHashtagClick = (hashtag) => (e) => {
      e.stopPropagation();
      if (onHashtagClick) onHashtagClick(hashtag);
    };

    return (
      <div className="w-full pointer-events-auto">
        {/* Description */}
        {description && (
          <div className="mb-2">
            <p className="text-white text-sm leading-snug break-words">
              {displayDescription}
              {shouldTruncate && (
                <button
                  onClick={handleDescriptionToggle}
                  className="ml-1 text-white/70 hover:text-white font-medium transition-colors"
                >
                  {showFullDescription ? 'menos' : 'mais'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Category Badge + Hashtags inline */}
        <div className="flex items-center gap-2 flex-wrap">
          {reel.hashtags && reel.hashtags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {reel.hashtags.slice(0, 2).map((hashtag, index) => (
                <button
                  key={index}
                  onClick={handleHashtagClick(hashtag)}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  {hashtag.replace('#', '')} 
                </button>
              ))}
              {reel.hashtags.length > 2 && (
                <span className="text-white/60 text-sm">+{reel.hashtags.length - 2}</span>
              )}
            </div>
          )}
        </div>

      </div>
    )
  }

    return null
  }
