import { useState, useEffect } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageCircle } from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'

export default function CallScreen({ user, onEnd, callType = 'voice' }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video')
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onEnd()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEnd])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary-900 to-primary-950 z-50 flex flex-col items-center justify-center">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-400 rounded-full blur-3xl" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Avatar e informações do utilizador */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <UserAvatar name={user?.name} size="xl" />
              {isVideoOn && callType === 'video' && (
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse" />
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">{user?.name || 'Utilizador'}</h2>
          {callType === 'video' && <p className="text-white/80 mb-4">Videochamada em curso</p>}
          {callType === 'voice' && <p className="text-white/80 mb-4">Chamada de voz em curso</p>}

          <p className="text-2xl font-semibold text-white">{formatDuration(duration)}</p>
        </div>

        {/* Botões de controlo */}
        <div className="flex gap-4 justify-center mb-8">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={isMuted ? 'Ativar microfone' : 'Desativar microfone'}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* Video (apenas em videochamadas) */}
          {callType === 'video' && (
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isVideoOn
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isVideoOn ? 'Desativar câmara' : 'Ativar câmara'}
            >
              {isVideoOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Chat */}
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white transition-all"
            title="Enviar mensagem"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Terminar chamada */}
          <button
            onClick={onEnd}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-all"
            title="Terminar chamada"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Dicas */}
        <div className="text-white/60 text-sm text-center max-w-xs">
          <p>Pressione ESC para sair</p>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
