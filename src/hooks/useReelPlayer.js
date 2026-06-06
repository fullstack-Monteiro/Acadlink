import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook para gerenciar a lógica de reprodução de vídeos Reel
 * 
 * @param {React.RefObject} videoRef - Referência para o elemento de vídeo
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.autoPlay - Se deve reproduzir automaticamente
 * @param {boolean} options.autoAdvance - Se deve avançar automaticamente no final
 * @param {Function} options.onNext - Callback para avançar para o próximo reel
 * @param {number} options.autoAdvanceDelay - Delay em ms antes do auto-advance (padrão: 500)
 * 
 * @returns {Object} Estado e funções de controle do player
 */
export default function useReelPlayer(videoRef, options = {}) {
  const {
    autoPlay = true,
    autoAdvance = true,
    onNext,
    autoAdvanceDelay = 500
  } = options

  // ══════════════════════════════════════════════════════════════════════════════
  // ESTADO DE REPRODUÇÃO
  // ══════════════════════════════════════════════════════════════════════════════

  const [playing, setPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [buffering, setBuffering] = useState(false)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState(null)

  // Ref para controlar timeouts
  const autoAdvanceTimeoutRef = useRef(null)

  // ══════════════════════════════════════════════════════════════════════════════
  // FUNÇÕES DE CONTROLE
  // ══════════════════════════════════════════════════════════════════════════════

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      await video.play()
      setPlaying(true)
      setError(null)
    } catch (err) {
      console.error('Erro ao reproduzir vídeo:', err)
      setError(err.message)
      setPlaying(false)
    }
  }, [videoRef])

  const pause = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    setPlaying(false)
  }, [videoRef])

  const togglePlay = useCallback(() => {
    if (playing) {
      pause()
    } else {
      play()
    }
  }, [playing, play, pause])

  const seek = useCallback((percentage) => {
    const video = videoRef.current
    if (!video || !duration || percentage < 0 || percentage > 100) return

    const newTime = (percentage / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
    setProgress(percentage)
  }, [videoRef, duration])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const newMuted = !muted
    setMuted(newMuted)
    video.muted = newMuted
  }, [videoRef, muted])

  const reset = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
    setProgress(0)
    setPlaying(false)
    setError(null)
  }, [videoRef])

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleLoadStart = useCallback(() => {
    setBuffering(true)
    setError(null)
  }, [])

  const handleCanPlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    setBuffering(false)
    setDuration(video.duration)
    
    // Auto-play se habilitado
    if (autoPlay && !playing) {
      play()
    }
  }, [videoRef, autoPlay, playing, play])

  const handleWaiting = useCallback(() => {
    setBuffering(true)
  }, [])

  const handlePlaying = useCallback(() => {
    setBuffering(false)
    setPlaying(true)
  }, [])

  const handlePause = useCallback(() => {
    setPlaying(false)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const current = video.currentTime
    const total = video.duration

    setCurrentTime(current)

    if (total > 0) {
      const newProgress = (current / total) * 100
      setProgress(newProgress)
    }
  }, [videoRef])

  const handleEnded = useCallback(() => {
    setPlaying(false)
    setProgress(100)

    // Auto-advance se habilitado
    if (autoAdvance && onNext) {
      // Limpar timeout anterior se existir
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current)
      }

      // Configurar novo timeout para auto-advance
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        onNext()
      }, autoAdvanceDelay)
    }
  }, [autoAdvance, onNext, autoAdvanceDelay])

  const handleError = useCallback((event) => {
    const video = videoRef.current
    if (!video) return

    const error = video.error
    let errorMessage = 'Erro desconhecido ao carregar vídeo'

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Reprodução foi abortada'
          break
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Erro de rede ao carregar vídeo'
          break
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Erro ao decodificar vídeo'
          break
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Formato de vídeo não suportado'
          break
        default:
          errorMessage = 'Erro desconhecido ao carregar vídeo'
      }
    }

    console.error('Erro no vídeo:', errorMessage, event)
    setError(errorMessage)
    setBuffering(false)
    setPlaying(false)
  }, [videoRef])

  // ══════════════════════════════════════════════════════════════════════════════
  // SETUP DE EVENT LISTENERS
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Adicionar event listeners
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      // Cleanup event listeners
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)

      // Limpar timeout de auto-advance
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current)
      }
    }
  }, [
    videoRef,
    handleLoadStart,
    handleCanPlay,
    handleWaiting,
    handlePlaying,
    handlePause,
    handleTimeUpdate,
    handleEnded,
    handleError
  ])

  // ══════════════════════════════════════════════════════════════════════════════
  // CLEANUP ON UNMOUNT
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    return () => {
      // Limpar timeout ao desmontar
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current)
      }
    }
  }, [])

  // ══════════════════════════════════════════════════════════════════════════════
  // RETURN API
  // ══════════════════════════════════════════════════════════════════════════════

  return {
    // Estado de reprodução
    playing,
    progress,
    buffering,
    muted,
    duration,
    currentTime,
    error,

    // Funções de controle
    play,
    pause,
    togglePlay,
    seek,
    toggleMute,
    reset,

    // Utilitários
    formatTime: (seconds) => {
      if (!seconds || isNaN(seconds)) return '0:00'
      
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    // Estado calculado
    progressPercentage: progress,
    isEnded: progress >= 100,
    hasError: !!error,
    canPlay: duration > 0 && !error
  }
}
