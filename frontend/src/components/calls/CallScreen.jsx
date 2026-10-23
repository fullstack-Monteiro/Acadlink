import { useState, useEffect } from 'react'
import {
  PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX,
  Maximize2, Minimize2, Users, MessageSquare, MoreVertical, X,
  Phone, Settings, Grid, Maximize
} from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'
import clsx from 'clsx'

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function CallTimer({ seconds }) {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  const format = (n) => String(n).padStart(2, '0')
  
  if (hours > 0) {
    return `${format(hours)}:${format(mins)}:${format(secs)}`
  }
  return `${format(mins)}:${format(secs)}`
}

function ControlButton({ icon: Icon, label, active, disabled, variant = 'default', size = 'md', onClick }) {
  const variants = {
    default: active 
      ? 'bg-white/25 hover:bg-white/35 border-white/30' 
      : 'bg-white/10 hover:bg-white/20 border-white/20',
    danger: 'bg-red-500 hover:bg-red-600 border-red-600 shadow-lg shadow-red-500/30',
    success: 'bg-green-500 hover:bg-green-600 border-green-600 shadow-lg shadow-green-500/30'
  }

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-16 h-16 md:w-20 md:h-20'
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7 md:w-8 md:h-8'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          sizes[size],
          'rounded-full flex items-center justify-center transition-all duration-200',
          'backdrop-blur-xl border-2',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'active:scale-90 transform',
          variants[variant]
        )}
      >
        <Icon className={clsx(iconSizes[size], 'text-white')} strokeWidth={2.5} />
      </button>
      {label && (
        <span className="text-white/90 text-xs md:text-sm font-medium drop-shadow-lg">
          {label}
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE CALL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function VoiceCallScreen({ user, duration, onEnd }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex flex-col overflow-hidden">
      {/* Background decoration - Responsivo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 md:-top-40 -left-20 md:-left-40 w-48 h-48 md:w-96 md:h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 md:-bottom-40 -right-20 md:-right-40 w-48 h-48 md:w-96 md:h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-[500px] h-64 md:h-[500px] bg-accent-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      {/* Header - Responsivo */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 safe-top">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-[10px] md:text-xs font-medium uppercase tracking-wider">Chamada de Voz</p>
            <p className="text-white font-semibold text-sm md:text-base">AcadLink</p>
          </div>
        </div>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
        >
          <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </button>
      </div>

      {/* Main content - Responsivo */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12">
        {/* Avatar with pulse effect - Tamanhos responsivos */}
        <div className="relative mb-6 md:mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 md:w-56 h-48 md:h-56 rounded-full bg-primary-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 md:w-48 h-40 md:h-48 rounded-full bg-primary-500/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 md:ring-6 ring-white/20 shadow-2xl">
            <UserAvatar name={user?.name || 'Utilizador'} size="xl" className="w-full h-full" />
          </div>
        </div>

        {/* User info - Responsivo */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 text-center px-4">{user?.name || 'Utilizador'}</h2>
        <div className="flex items-center gap-2 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          <p className="text-white/90 text-base md:text-lg font-medium tabular-nums">
            <CallTimer seconds={duration} />
          </p>
        </div>

        {/* Status indicators - Responsivo */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
          {isMuted && (
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30 animate-fade-in">
              <MicOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-xs md:text-sm font-medium">Microfone desligado</span>
            </div>
          )}
          {!isSpeakerOn && (
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
              <VolumeX className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs md:text-sm font-medium">Alto-falante desligado</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls - Responsivo */}
      <div className="relative z-10 px-4 md:px-6 pb-6 md:pb-8 safe-bottom">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl md:rounded-3xl px-4 md:px-8 py-5 md:py-6 shadow-2xl border border-white/10">
          <div className="flex items-center justify-around gap-2 md:gap-4 max-w-2xl mx-auto">
            <ControlButton
              icon={isSpeakerOn ? Volume2 : VolumeX}
              label="Alto-falante"
              active={isSpeakerOn}
              size="md"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            />
            <ControlButton
              icon={isMuted ? MicOff : Mic}
              label="Microfone"
              active={!isMuted}
              size="md"
              onClick={() => setIsMuted(!isMuted)}
            />
            <ControlButton
              icon={MessageSquare}
              label="Chat"
              size="md"
              onClick={() => {}}
            />
            <ControlButton
              icon={PhoneOff}
              variant="danger"
              size="lg"
              onClick={onEnd}
            />
          </div>
        </div>
      </div>

      {/* Menu overlay - Responsivo */}
      {showMenu && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowMenu(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Opções</h3>
              <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left">
                <Users className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-neutral-900 dark:text-white font-medium">Adicionar participante</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left">
                <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-neutral-900 dark:text-white font-medium">Definições de áudio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CALL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function VideoCallScreen({ user, duration, onEnd }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!showControls) return
    const timer = setTimeout(() => setShowControls(false), 4000)
    return () => clearTimeout(timer)
  }, [showControls])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden cursor-none"
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Remote video (fullscreen) */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        {/* Placeholder for remote video */}
        <div className="flex flex-col items-center gap-4 md:gap-6 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-600/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl">
              <UserAvatar name={user?.name || 'Utilizador'} size="xl" className="w-full h-full" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{user?.name || 'Utilizador'}</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="text-white/60 text-sm md:text-base">A aguardar vídeo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header - Responsivo */}
      <div className={clsx(
        'absolute top-0 inset-x-0 z-20 transition-all duration-300 safe-top',
        showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      )}>
        <div className="bg-gradient-to-b from-black/90 via-black/60 to-transparent px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-600 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm md:text-base">{user?.name || 'Utilizador'}</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                  <p className="text-white/70 text-xs md:text-sm tabular-nums">
                    <CallTimer seconds={duration} />
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleFullscreen}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                ) : (
                  <Maximize className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
              </button>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10"
              >
                <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Self view (Picture-in-Picture) - Responsivo */}
      {isVideoOn && (
        <div className={clsx(
          'absolute z-30 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-2xl ring-2 md:ring-4 ring-white/10 transition-all duration-300',
          showControls ? 'top-16 md:top-20 right-4 md:right-6' : 'top-4 right-4',
          'w-24 h-32 sm:w-28 sm:h-36 md:w-36 md:h-48 lg:w-40 lg:h-56'
        )}>
          <div className="w-full h-full flex items-center justify-center">
            <UserAvatar name="Tu" size="lg" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-[10px] md:text-xs font-medium drop-shadow-lg">Tu</span>
              {isMuted && (
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                  <MicOff className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls - Responsivo */}
      <div className={clsx(
        'absolute bottom-0 inset-x-0 z-20 transition-all duration-300 safe-bottom',
        showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}>
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 md:px-6 py-4 md:py-6">
          <div className="bg-black/50 backdrop-blur-2xl rounded-2xl md:rounded-3xl px-4 md:px-8 py-4 md:py-6 shadow-2xl border border-white/10 max-w-3xl mx-auto">
            <div className="flex items-center justify-around gap-2 md:gap-4">
              <ControlButton
                icon={isMuted ? MicOff : Mic}
                label="Mic"
                active={!isMuted}
                size="md"
                onClick={() => setIsMuted(!isMuted)}
              />
              <ControlButton
                icon={isVideoOn ? Video : VideoOff}
                label="Vídeo"
                active={isVideoOn}
                size="md"
                onClick={() => setIsVideoOn(!isVideoOn)}
              />
              <ControlButton
                icon={Grid}
                label="Layout"
                size="md"
                onClick={() => {}}
              />
              <ControlButton
                icon={PhoneOff}
                variant="danger"
                size="lg"
                onClick={onEnd}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      {!isVideoOn && showControls && (
        <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
          <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <p className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
              <VideoOff className="w-4 h-4" />
              Câmara desligada
            </p>
          </div>
        </div>
      )}

      {/* Menu overlay */}
      {showMenu && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowMenu(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Opções de Vídeo</h3>
              <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left">
                <Users className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-neutral-900 dark:text-white font-medium">Participantes</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left">
                <MessageSquare className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-neutral-900 dark:text-white font-medium">Chat</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left">
                <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-neutral-900 dark:text-white font-medium">Definições</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// INCOMING CALL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function IncomingCallScreen({ user, callType, onAccept, onReject }) {
  const [ringing, setRinging] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRinging(r => (r + 1) % 4)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex flex-col items-center justify-between p-4 md:p-6 lg:p-12 overflow-hidden">
      {/* Background decoration - Responsivo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-primary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-brand-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-accent-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
      </div>

      {/* Header - Responsivo */}
      <div className="relative z-10 w-full flex flex-col items-center gap-2 md:gap-3 pt-4 safe-top">
        <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
          {callType === 'video' ? (
            <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
          )}
          <p className="text-white/90 text-xs md:text-sm font-semibold uppercase tracking-wider">
            {callType === 'video' ? 'Videochamada' : 'Chamada de Voz'} a entrar
            <span className="inline-block w-8 text-left">{'.'.repeat(ringing)}</span>
          </p>
        </div>
        <div className="px-4 py-1.5 bg-brand-600/20 backdrop-blur-sm rounded-full border border-brand-400/30">
          <p className="text-brand-200 text-xs md:text-sm font-medium">AcadLink</p>
        </div>
      </div>

      {/* Main content - Responsivo */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center">
        {/* Avatar with multiple ring animations */}
        <div className="relative mb-6 md:mb-8">
          {/* Outer rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 md:w-72 lg:w-80 h-56 md:h-72 lg:h-80 rounded-full border-4 border-white/15 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 md:w-64 lg:w-72 h-48 md:h-64 lg:h-72 rounded-full border-4 border-white/25 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 md:w-56 lg:w-64 h-40 md:h-56 lg:h-64 rounded-full border-4 border-white/35 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          </div>
          
          {/* Avatar */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden ring-6 md:ring-8 ring-white/20 shadow-2xl animate-scale-in">
            <UserAvatar name={user?.name || 'Utilizador'} size="xl" className="w-full h-full" />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary-500/30 to-transparent blur-2xl" />
        </div>

        {/* User info - Responsivo */}
        <div className="text-center space-y-2 md:space-y-3 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
            {user?.name || 'Utilizador'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            <p className="text-white/70 text-base md:text-lg font-medium">Chamando...</p>
          </div>
        </div>
      </div>

      {/* Action buttons - Responsivo */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-around gap-8 md:gap-12 lg:gap-16 pb-4 safe-bottom">
        {/* Reject */}
        <div className="flex flex-col items-center gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={onReject}
            className="group relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-red-500 hover:bg-red-600 active:scale-90 flex items-center justify-center shadow-2xl shadow-red-500/40 transition-all duration-200 border-4 border-red-400/30"
          >
            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" style={{ animationDuration: '1.5s' }} />
            <PhoneOff className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white rotate-[135deg]" strokeWidth={2.5} />
          </button>
          <span className="text-white/90 font-semibold text-sm md:text-base drop-shadow-lg">Recusar</span>
        </div>

        {/* Accept */}
        <div className="flex flex-col items-center gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onAccept}
            className="group relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-green-500 hover:bg-green-600 active:scale-90 flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all duration-200 border-4 border-green-400/30 animate-pulse"
            style={{ animationDuration: '2s' }}
          >
            <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" style={{ animationDuration: '1.5s' }} />
            <Phone className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
          </button>
          <span className="text-white/90 font-semibold text-sm md:text-base drop-shadow-lg">Aceitar</span>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-50">
        <div className="w-24 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CallScreen({
  user,
  callType = 'voice',
  incoming = false,
  onAccept,
  onReject,
  onEnd
}) {
  const [duration, setDuration] = useState(0)
  const [callActive, setCallActive] = useState(!incoming)

  useEffect(() => {
    if (!callActive) return
    const interval = setInterval(() => {
      setDuration(d => d + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [callActive])

  const handleAccept = () => {
    setCallActive(true)
    onAccept?.()
  }

  const handleReject = () => {
    onReject?.()
    onEnd?.()
  }

  const handleEnd = () => {
    setCallActive(false)
    onEnd?.()
  }

  if (incoming && !callActive) {
    return (
      <IncomingCallScreen
        user={user}
        callType={callType}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    )
  }

  if (callType === 'video') {
    return (
      <VideoCallScreen
        user={user}
        duration={duration}
        onEnd={handleEnd}
      />
    )
  }

  return (
    <VoiceCallScreen
      user={user}
      duration={duration}
      onEnd={handleEnd}
    />
  )
}
