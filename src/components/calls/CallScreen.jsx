import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageCircle, Volume2 } from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'

export default function CallScreen({ user, onEnd, callType = 'voice', remoteStream = null, localStream = null, incoming = false, onAccept = null, onReject = null }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video')
  const [duration, setDuration] = useState(0)
  const remoteVideoRef = useRef(null)
  const localVideoRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Anexa streams aos elementos <video>
  useEffect(() => {
    if (remoteVideoRef.current) {
      try { remoteVideoRef.current.srcObject = remoteStream || null } catch (e) { /* ignore */ }
    }
  }, [remoteStream])

  useEffect(() => {
    if (localVideoRef.current) {
      try { localVideoRef.current.srcObject = localStream || null } catch (e) { /* ignore */ }
    }
  }, [localStream])

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
    <div className='fixed inset-0 z-50'>
      {callType === 'video' ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {/* Remote video as background */}
          {remoteStream ? (
            <video ref={remoteVideoRef} autoPlay playsInline controlsList="nodownload" disablePictureInPicture disableRemotePlayback onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-black/60" />
          )}

          {/* Overlay */}
          <div className="relative z-10 inset-0 flex flex-col h-full">
            <div className="pt-6 flex-0 text-center">
              <h2 className="text-xl font-semibold text-white">{user?.name || 'Utilizador'}</h2>
              <p className="text-sm text-white/80 mt-1">{formatDuration(duration)} • Videochamada</p>
            </div>

            <div className="flex-1" />

            {/* Controls area */}
            <div className="flex flex-col items-center pb-8">
                <div className="flex items-center justify-center gap-6 mb-6">
              {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex flex-col items-center gap-2 focus:outline-none`}
            title={isMuted ? 'Ativar microfone' : 'Desativar microfone'}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-white/10 text-white' : 'bg-white/20 text-white'}`}>
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </div>
            <span className="text-xs text-white/70">Mudo</span>
          </button>

              {/* Alto-falante */}
          <button
            className="flex flex-col items-center gap-2 focus:outline-none"
            title="Alto-falante"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-xs text-white/70">Alto-fal.</span>
          </button>

              {/* Vídeo (se aplicável) */}
              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                  title={isVideoOn ? 'Desativar câmara' : 'Ativar câmara'}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isVideoOn ? 'bg-white/20 text-white' : 'bg-white/10 text-white'}`}>
                    {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </div>
                </button>
              )}

          {/* Chat */}
          <button
            className="flex flex-col items-center gap-2 focus:outline-none"
            title="Abrir chat"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs text-white/70">Chat</span>
          </button>
              {/* Terminar / aceitar */}
              <div>
                {incoming ? (
                  <div className="flex gap-4 items-center justify-center">
                    <button onClick={() => { onReject?.(); onEnd(); }} className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center shadow-md">✖</button>
                    <button onClick={() => { onAccept?.(); setIsVideoOn(true); }} className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-xl transition-transform active:scale-95">✔</button>
                  </div>
                ) : (
                  <button onClick={onEnd} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl transition-transform active:scale-95"><PhoneOff className="w-6 h-6 text-white" /></button>
                )}
              </div>

              <div className="text-white/60 text-sm text-center mt-3">Pressione ESC para sair</div>
            </div>
            </div>
          </div>

          {/* Self-view small */}
          {isVideoOn && localStream && (
            <div className="absolute right-4 bottom-4 w-28 h-40 rounded-lg overflow-hidden ring-2 ring-white/30 bg-black z-20">
              <video ref={localVideoRef} autoPlay muted playsInline controlsList="nodownload" disablePictureInPicture disableRemotePlayback onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-primary-900 to-black opacity-80" />
          <div className="relative z-10 w-full max-w-md mx-auto p-6 flex flex-col items-center text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">{user?.name || 'Utilizador'}</h2>
              <p className="text-sm text-white/80 mt-1">{formatDuration(duration)} • Chamada de voz</p>
            </div>
            <div className="mb-8">
              <div className="mx-auto w-48 h-48 rounded-full overflow-hidden ring-4 ring-white/20 shadow-lg flex items-center justify-center bg-white/5">
                <UserAvatar name={user?.name} size="xl" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button onClick={() => setIsMuted(!isMuted)} className={`flex flex-col items-center gap-2 focus:outline-none`} title={isMuted ? 'Ativar microfone' : 'Desativar microfone'}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-white/10 text-white' : 'bg-white/20 text-white'}`}>
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </div>
              </button>
              <button className="flex flex-col items-center gap-2 focus:outline-none" title="Alto-falante"><div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white"><Volume2 className="w-6 h-6" /></div></button>
              <button className="flex flex-col items-center gap-2 focus:outline-none" title="Abrir chat"><div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white"><MessageCircle className="w-6 h-6" /></div></button>
            </div>

            <div className="mb-2">
              <button onClick={onEnd} className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl transition-transform active:scale-95" title="Terminar chamada"><PhoneOff className="w-8 h-8 text-white" /></button>
            </div>
            <div className="text-white/60 text-sm text-center mt-2"><p>divssione ESC para sair</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
