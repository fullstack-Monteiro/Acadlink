import { useEffect, useRef, useState } from 'react'

export function usePullToRefresh(onRefresh, options = {}) {
  const { threshold = 80, resistance = 2.5 } = options
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let touchStartY = 0
    let currentY = 0

    const handleTouchStart = (e) => {
      // Só ativa se estiver no topo da página
      if (window.scrollY > 0) return
      touchStartY = e.touches[0].clientY
      startY.current = touchStartY
    }

    const handleTouchMove = (e) => {
      if (window.scrollY > 0 || refreshing) return
      
      currentY = e.touches[0].clientY
      const distance = currentY - touchStartY

      if (distance > 0) {
        setPulling(true)
        // Aplica resistência para efeito mais natural
        const adjustedDistance = Math.min(distance / resistance, threshold * 1.5)
        setPullDistance(adjustedDistance)
        
        // Previne scroll nativo quando puxando
        if (distance > 10) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = () => {
      if (pullDistance >= threshold && !refreshing) {
        setRefreshing(true)
        setPullDistance(threshold)
        
        // Executa o refresh
        Promise.resolve(onRefresh()).finally(() => {
          setTimeout(() => {
            setRefreshing(false)
            setPulling(false)
            setPullDistance(0)
          }, 500)
        })
      } else {
        setPulling(false)
        setPullDistance(0)
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh, threshold, resistance, pullDistance, refreshing])

  return {
    containerRef,
    pulling,
    refreshing,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1),
  }
}
