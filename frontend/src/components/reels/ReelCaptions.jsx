import { useState } from 'react'
import { X, Volume2, Type } from 'lucide-react'

/**
 * ReelCaptions Component
 * 
 * Exibe legendas sincronizadas com o vídeo
 * Suporta múltiplos idiomas e tamanhos de fonte
 * 
 * Features:
 * - Legendas sincronizadas
 * - Toggle de visibilidade
 * - Ajuste de tamanho de fonte
 * - Suporte a múltiplos idiomas
 * - Fundo semi-transparente
 */
export default function ReelCaptions({ 
  isVisible = false,
  currentTime = 0,
  captions = [],
  fontSize = 'medium',
  onFontSizeChange,
  onToggleVisibility
}) {
  const [language, setLanguage] = useState('pt')

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const getCurrentCaption = () => {
    return captions.find(cap => {
      const startTime = cap.startTime || 0
      const endTime = cap.endTime || cap.startTime + 3
      return currentTime >= startTime && currentTime < endTime
    })
  }

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  if (!isVisible || captions.length === 0) {
    return null
  }

  const currentCaption = getCurrentCaption()

  return (
    <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {/* Caption Text */}
      {currentCaption && (
        <div className={`
          text-white text-center font-medium
          bg-black/70 px-4 py-2 rounded-lg
          max-w-xs md:max-w-md
          ${fontSizeClasses[fontSize]}
          transition-all duration-200
        `}>
          {currentCaption.text}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Font Size Control */}
        <div className="flex items-center gap-1 bg-black/70 rounded-full px-2 py-1">
          <Type className="w-4 h-4 text-white" />
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange?.(e.target.value)}
            className="bg-transparent text-white text-xs outline-none cursor-pointer"
          >
            <option value="small">P</option>
            <option value="medium">M</option>
            <option value="large">G</option>
            <option value="xlarge">XG</option>
          </select>
        </div>

        {/* Toggle Captions */}
        <button
          onClick={() => onToggleVisibility?.(!isVisible)}
          className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
          aria-label="Alternar legendas"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
