import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Loader2, Search, User } from 'lucide-react'
import ReelPlayer from '../components/reels/ReelPlayer'
import { useReels } from '../context/ReelsContext'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import useSwipeGesture from '../hooks/useSwipeGesture'

/**
 * ReelFeed Page Component - TikTok/Instagram Reels Style
 * 
 * Layout:
 * ┌─────────────────────────┐
 * │ Header (Reels | 🔍 | 👤)│  ← Search, Profile
 * ├─────────────────────────┤
 * │                         │
 * │    Video em Full       │
 * │    Screen              │  ← Main content
 * │                         │
 * ├─────────────────────────┤
 * │ Ações (Dir) | Info (Esq)│  ← Like, Comment, Share + Creator info
 * └─────────────────────────┘
 */
export default function ReelFeed({ onClose }) {
  const { reels, loadMoreReels, refreshReels, loading, hasMore } = useReels()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [followingStates, setFollowingStates] = useState({})
  const containerRef = useRef(null)
  const isTransitioningRef = useRef(false)

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return
    if (currentIndex < reels.length - 1) {
      isTransitioningRef.current = true
      setCurrentIndex(prev => prev + 1)
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 300)
    }
  }, [currentIndex, reels.length])

  const handlePrevious = useCallback(() => {
    if (isTransitioningRef.current) return
    if (currentIndex > 0) {
      isTransitioningRef.current = true
      setCurrentIndex(prev => prev - 1)
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 300)
    }
  }, [currentIndex])

  // Wheel and touch handlers
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout = null

    const onWheel = (e) => {
      if (isTransitioningRef.current) return
      e.preventDefault()
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
      }, 400)
      if (e.deltaY > 30) {
        handleNext()
      } else if (e.deltaY < -30) {
        handlePrevious()
      }
    }

    let touchStartY = null
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
      }
    }
    const onTouchEnd = (e) => {
      if (touchStartY === null) return
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY
      if (Math.abs(diff) > 40) {
        if (diff > 0) handleNext()
        else handlePrevious()
      }
      touchStartY = null
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: false })
    container.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleNext, handlePrevious])

  // Pull-to-refresh
  const { isPulling, pullDistance } = usePullToRefresh(containerRef, async () => {
    setRefreshing(true)
    try {
      await refreshReels()
      setCurrentIndex(0)
      setError(null)
    } catch (err) {
      console.error('Erro ao atualizar feed:', err)
      setError('Erro ao atualizar feed')
    } finally {
      setRefreshing(false)
    }
  })

  // Swipe gestures
  useSwipeGesture(containerRef, {
    onSwipeUp: () => handleNext(),
    onSwipeDown: () => handlePrevious(),
    threshold: 50,
    velocityThreshold: 0.5
  })

  // Load more when near the end
  useEffect(() => {
    if (reels.length > 0 && currentIndex >= reels.length - 3) {
      loadMore()
    }
  }, [currentIndex, reels.length])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || loading) return
    setIsLoadingMore(true)
    try {
      await loadMoreReels()
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar mais reels:', err)
      setError('Erro ao carregar mais reels')
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, loading, loadMoreReels])

  // Interaction handlers
  const handleLike = async (reelId) => {
    alert(`❤️ Like no reel: ${reelId}`)
    console.log('Like reel:', reelId)
  }

  const handleComment = (reelId) => {
    alert(`💬 Comentário no reel: ${reelId}`)
    console.log('Comment reel:', reelId)
  }

  const handleShare = (reelId) => {
    alert(`↗️ Compartilhar reel: ${reelId}`)
    console.log('Share reel:', reelId)
  }

  const handleSave = async (reelId) => {
    alert(`🔖 Salvar reel: ${reelId}`)
    console.log('Save reel:', reelId)
  }

  const handleMore = (reelId) => {
    alert(`⋯ Mais opções para reel: ${reelId}`)
    console.log('More options for reel:', reelId)
  }

  const handleCreatorClick = (creator) => {
    console.log('Navigate to creator profile:', creator)
    // TODO: Navegar para perfil do criador
  }

  const handleHashtagClick = (hashtag) => {
    console.log('Navigate to hashtag feed:', hashtag)
    // TODO: Navegar para feed de hashtag
  }

  const handleFollowClick = (creator) => {
    if (!creator?.id && !creator?.username) {
      alert('❌ Erro: Creator ID não encontrado')
      return
    }
    
    const creatorId = creator.id || creator.username || ''
    setFollowingStates(prev => {
      const newState = {
        ...prev,
        [creatorId]: !prev[creatorId]
      }
      const isFollowing = newState[creatorId]
      alert(`${isFollowing ? '✅ Seguindo' : '❌ Deixou de seguir'}: ${creator.name}`)
      console.log('Toggle follow for creator:', creator.name, '- Following:', isFollowing)
      return newState
    })
  }

  // Loading state
  if (loading && reels.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center md:hidden">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Carregando reels...</span>
        </div>
      </div>
    )
  }

  // Empty state
  if (reels.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center md:hidden">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="text-4xl">📹</div>
          <h2 className="text-xl font-semibold">Nenhum reel disponível</h2>
          <p className="text-white/60 text-sm">Volte mais tarde para ver novos reels</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col md:hidden fixed inset-0 z-50">
      {/* Main Content - Full Screen Video */}
      <div
        ref={containerRef}
        className="w-full h-full relative bg-black overflow-hidden touch-pan-y"
        style={{
          overscrollBehavior: 'none',
          WebkitOverscrollBehavior: 'none',
        }}
      >
        {/* Pull-to-Refresh Indicator */}
        {isPulling && (
          <div className="fixed top-16 left-0 right-0 z-50 flex items-center justify-center h-16 bg-black/50">
            <div className="flex items-center gap-2 text-white">
              <Loader2 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                style={{
                  transform: `rotate(${Math.min(pullDistance * 3, 360)}deg)`
                }}
              />
              <span className="text-xs">
                {refreshing ? 'Atualizando...' : 'Solte para atualizar'}
              </span>
            </div>
          </div>
        )}

        {/* Reel Player Container - Fullscreen */}
        <div className="relative w-full h-full flex items-center justify-center bg-black" style={{overflow: 'hidden', touchAction: 'none'}}>
          {reels.length > 0 && (
            <ReelPlayer
              reel={reels[currentIndex]}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onClose={onClose}
              autoPlay={true}
              onCreatorClick={handleCreatorClick}
              onHashtagClick={handleHashtagClick}
              onFollowClick={handleFollowClick}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
              onMore={handleMore}
              followingStates={followingStates}
            />
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-50 text-white hover:text-gray-300 transition-colors"
          aria-label="Fechar feed de reels"
        >
          <X className="w-7 h-7 stroke-2" />
        </button>

        {/* Title - Reels */}
        <h1 className="fixed top-4 left-20 z-50 text-white text-2xl font-bold">
          Reels
        </h1>

        {/* Top Right Icons - Search and Profile */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-6">
          {/* Search Icon */}
          <button
            onClick={() => console.log('Abrir busca de reels')}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Pesquisar reels"
          >
            <Search className="w-7 h-7 stroke-2" />
          </button>

          {/* Profile Icon */}
          <button
            onClick={() => console.log('Abrir perfil')}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Abrir perfil"
          >
            <User className="w-7 h-7 stroke-2" />
          </button>
        </div>

        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/70 text-white text-xs px-3 py-2 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Carregando mais...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-6 left-4 right-4 z-20 bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
