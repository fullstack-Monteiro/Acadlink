import { useState, useRef } from 'react'

export default function ProgressBar({ 
  progress = 0, 
  duration = 0, 
  currentTime = 0,
  onSeek,
  interactive = false,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const progressBarRef = useRef(null)

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateProgressFromEvent = (e) => {
    const rect = progressBarRef.current?.getBoundingClientRect()
    if (!rect) return 0

    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    return percentage
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleMouseDown = (e) => {
    if (!interactive || !onSeek) return

    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    const newProgress = calculateProgressFromEvent(e)
    setDragProgress(newProgress)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !interactive) return

    e.preventDefault()
    const newProgress = calculateProgressFromEvent(e)
    setDragProgress(newProgress)
  }

  const handleMouseUp = (e) => {
    if (!isDragging || !interactive || !onSeek) return

    e.preventDefault()
    e.stopPropagation()
    
    const finalProgress = calculateProgressFromEvent(e)
    onSeek(finalProgress)
    
    setIsDragging(false)
    setDragProgress(0)
  }

  const handleClick = (e) => {
    if (!interactive || !onSeek) return

    e.preventDefault()
    e.stopPropagation()
    
    const newProgress = calculateProgressFromEvent(e)
    onSeek(newProgress)
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MOUSE EVENT LISTENERS
  // ══════════════════════════════════════════════════════════════════════════════

  // Add global mouse event listeners when dragging
  if (typeof window !== 'undefined' && isDragging) {
    const handleGlobalMouseMove = (e) => handleMouseMove(e)
    const handleGlobalMouseUp = (e) => handleMouseUp(e)

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)

    // Cleanup function
    const cleanup = () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }

    // This will be called when component unmounts or isDragging changes
    setTimeout(cleanup, 0)
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  const displayProgress = isDragging ? dragProgress : progress
  const displayTime = isDragging ? (dragProgress / 100) * duration : currentTime

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className={`
          relative h-1 bg-white/20 overflow-hidden
          ${interactive ? 'cursor-pointer hover:h-1.5 transition-all duration-200' : ''}
        `}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* Progress Fill */}
        <div 
          className={`
            h-full bg-white transition-all duration-100 ease-linear
            ${isDragging ? 'bg-primary-400' : 'bg-white'}
          `}
          style={{ width: `${Math.max(0, Math.min(100, displayProgress))}%` }}
        />

        {/* Scrubber Handle (only visible when interactive and hovering/dragging) */}
        {interactive && (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg
              transition-all duration-200 transform
              ${isDragging ? 'scale-125 opacity-100' : 'scale-0 opacity-0 hover:scale-100 hover:opacity-100'}
            `}
            style={{ 
              left: `${Math.max(0, Math.min(100, displayProgress))}%`,
              marginLeft: '-6px' // Half of width to center
            }}
          />
        )}
      </div>

      {/* Time Display (optional, for interactive mode) */}
      {interactive && duration > 0 && (
        <div className="flex justify-between items-center mt-1 text-xs text-white/70">
          <span>{formatTime(displayTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}

      {/* Buffering Indicator (optional) */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
          {formatTime(displayTime)}
        </div>
      )}
    </div>
  )
}
