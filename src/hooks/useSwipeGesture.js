import { useEffect, useRef } from 'react'

/**
 * Custom hook para detectar gestos de swipe vertical
 * 
 * @param {React.RefObject} elementRef - Referência para o elemento que detectará swipes
 * @param {Object} options - Opções de configuração
 * @param {Function} options.onSwipeUp - Callback quando swipe para cima
 * @param {Function} options.onSwipeDown - Callback quando swipe para baixo
 * @param {number} options.threshold - Distância mínima em pixels para considerar swipe (padrão: 50)
 * @param {number} options.velocityThreshold - Velocidade mínima em pixels/ms (padrão: 0.5)
 * 
 * @returns {Object} Estado do swipe (isDetecting, direction, distance, velocity)
 */
export default function useSwipeGesture(elementRef, options = {}) {
  const {
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.5
  } = options

  // ══════════════════════════════════════════════════════════════════════════════
  // REFS PARA TRACKING
  // ══════════════════════════════════════════════════════════════════════════════

  const touchStartRef = useRef(null)
  const touchStartTimeRef = useRef(null)
  const isSwipingRef = useRef(false)

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Calcula a velocidade do swipe em pixels/ms
   * @param {number} distance - Distância em pixels
   * @param {number} time - Tempo em ms
   * @returns {number} Velocidade em pixels/ms
   */
  const calculateVelocity = (distance, time) => {
    if (time === 0) return 0
    return Math.abs(distance) / time
  }

  /**
   * Detecta se o swipe atende aos critérios
   * @param {number} distance - Distância do swipe
   * @param {number} velocity - Velocidade do swipe
   * @returns {boolean} Se é um swipe válido
   */
  const isValidSwipe = (distance, velocity) => {
    const meetsDistanceThreshold = Math.abs(distance) >= threshold
    const meetsVelocityThreshold = velocity >= velocityThreshold
    
    // Swipe é válido se atende ao threshold de distância OU velocidade
    return meetsDistanceThreshold || meetsVelocityThreshold
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleTouchStart = (e) => {
    // Ignorar multi-touch
    if (e.touches.length > 1) return

    touchStartRef.current = e.touches[0].clientY
    touchStartTimeRef.current = Date.now()
    isSwipingRef.current = true
  }

  const handleTouchEnd = (e) => {
    if (!isSwipingRef.current || touchStartRef.current === null) return

    const touchEnd = e.changedTouches[0].clientY
    const touchDuration = Date.now() - touchStartTimeRef.current
    const distance = touchStartRef.current - touchEnd // Negativo = swipe down, Positivo = swipe up
    const velocity = calculateVelocity(distance, touchDuration)

    // Validar swipe
    if (isValidSwipe(distance, velocity)) {
      if (distance > 0) {
        // Swipe up (próximo)
        onSwipeUp?.({
          distance: Math.abs(distance),
          velocity,
          duration: touchDuration
        })
      } else {
        // Swipe down (anterior)
        onSwipeDown?.({
          distance: Math.abs(distance),
          velocity,
          duration: touchDuration
        })
      }
    }

    // Cleanup
    touchStartRef.current = null
    touchStartTimeRef.current = null
    isSwipingRef.current = false
  }

  const handleTouchCancel = () => {
    touchStartRef.current = null
    touchStartTimeRef.current = null
    isSwipingRef.current = false
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // SETUP EVENT LISTENERS
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Adicionar event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      // Cleanup event listeners
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [onSwipeUp, onSwipeDown, threshold, velocityThreshold])

  // ══════════════════════════════════════════════════════════════════════════════
  // RETURN API
  // ══════════════════════════════════════════════════════════════════════════════

  return {
    isDetecting: isSwipingRef.current,
    threshold,
    velocityThreshold
  }
}
