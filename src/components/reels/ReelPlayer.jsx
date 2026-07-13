import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react'
import ReelOverlay from './ReelOverlay'
import ProgressBar from './ProgressBar'
import ReelActions from './ReelActions'
import { CATEGORIES } from '../../context/ReelsContext'
import useReelPlayer from '../../hooks/useReelPlayer'

export default function ReelPlayer({ 
  reel, 
  onNext, 
  onPrevious, 
  onClose, 
  autoPlay = true,
  onCreatorClick,
  onHashtagClick,
  onFollowClick,
  onLike,
  onComment,
  onShare,
  onSave,
  onMore,
  followingStates = {}
}) {
  // Normalizar creator/author para interface unificada
  const creator = reel?.creator || reel?.author || {}
  const videoRef = useRef(null)
  const [showControls, setShowControls] = useState(false)
  const [showMicIndicator, setShowMicIndicator] = useState(false)
  const micTimeoutRef = useRef(null)

  // Usar o hook useReelPlayer para gerenciar a lógica de reprodução
  const {
    playing,
    progress,
    buffering,
    muted,
    duration,
    currentTime,
    error,
    play,
    pause,
    togglePlay,
    seek,
    toggleMute,
    formatTime,
    hasError
  } = useReelPlayer(videoRef, {
    autoPlay,
    autoAdvance: true,
    onNext,
    autoAdvanceDelay: 500
  })

  // ══════════════════════════════════════════════════════════════════════════════
  // VIDEO LIFECYCLE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════════

  // Configurar vídeo quando o reel muda
  useEffect(() => {
    const video = videoRef.current
    if (!video || !reel) return

    // Definir source do vídeo
    video.src = reel.videoUrl
    video.muted = muted

    return () => {
      // Cleanup: pausar vídeo e resetar
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    }
  }, [reel, muted])

  // ══════════════════════════════════════════════════════════════════════════════
  // INTERACTION HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleVideoClick = (e) => {
    // Prevent event bubbling to container
    e.stopPropagation()
    
    // Toggle play/pause on tap
    togglePlay()
    
    // Show controls briefly
    setShowControls(true)
    setTimeout(() => setShowControls(false), 2000)
  }

  const handleContainerClick = (e) => {
    // Só alterna o som ao clicar no container (não em elementos filhos)
    if (e.target === e.currentTarget) {
      toggleMute();
      // Mostrar indicador de microfone temporariamente
      setShowMicIndicator(true)
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current)
      micTimeoutRef.current = setTimeout(() => setShowMicIndicator(false), 1000)
    }
  }

  // limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current)
    }
  }, [])

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ══════════════════════════════════════════════════════════════════════════════

  const getCategoryConfig = (categoryKey) => {
    return CATEGORIES.find(cat => cat.key === categoryKey) || CATEGORIES[0]
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // LOADING AND ERROR STATES
  // ══════════════════════════════════════════════════════════════════════════════

  if (!reel) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Carregando reel...</span>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white text-center px-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-xl">⚠</span>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Erro ao carregar vídeo</h3>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden cursor-pointer flex flex-col justify-between"
      onClick={handleContainerClick}
      style={{maxHeight: '100dvh'}}
    >
      {/* Video Background */}
      <img
        src={reel.thumbnail || '/placeholder.jpg'}
        alt={reel.title || 'Reel'}
        className="absolute inset-0 w-full h-full object-cover bg-white z-0"
        style={{objectFit: 'cover'}}
        onError={e => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
          e.target.style.background = '#eee';
        }}
      />

      {/* Container para Layout - Ações na Direita + Footer na Base */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        
        {/* Espaço do Video (topo) */}
        <div className="flex-1" />

        {/* Footer: Posicionado no bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-3 px-3 pb-0 md:pb-3">
          
          {/* Informações (Esquerda) */}
          <div className="flex-1 min-w-0 flex flex-col gap-2 pb-3">
            {/* Description + Hashtags */}
            <ReelOverlay
              reel={reel}
              onCreatorClick={onCreatorClick}
              onHashtagClick={onHashtagClick}
              onFollowClick={onFollowClick}
              facebookFooterOnly
            />
          </div>
          
          {/* Ações (Direita) */}
          <div className="ml-auto pb-3">
            <ReelActions
              reel={reel}
              onLike={onLike}
              onComment={onComment}
              onShare={onShare}
              onSave={onSave}
              onMore={onMore}
            />
          </div>
        </div>

        {/* Creator overlay removed for photo/video posts (profile bubble hidden) */}
      </div>

      {/* Mensagem caso a imagem não carregue */}
      {!reel.thumbnail && (
        <div className="absolute inset-0 flex items-center justify-center text-black bg-white/80 text-lg font-bold z-10">
          Imagem não disponível
        </div>
      )}

      {/* Play/Pause Indicator */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            {playing ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </div>
      )}

      {/* Sound Indicator */}
      {showMicIndicator && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center">
            {muted ? (
              <VolumeX className="w-10 h-10 text-white" />
            ) : (
              <Volume2 className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
