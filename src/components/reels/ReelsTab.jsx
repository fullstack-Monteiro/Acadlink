import { useState, useMemo } from 'react'
import { Trash2 } from 'lucide-react'
import ReelCard from './ReelCard'
import { CATEGORIES } from '../../context/ReelsContext'

/**
 * ReelsTab Component
 * 
 * Exibe reels do criador em grid com filtros por categoria
 * Integrado na página de Profile
 * 
 * Features:
 * - Grid de reels (3 colunas)
 * - Filtro por categoria
 * - Delete para criador
 * - Contador de reels
 * - Total de visualizações
 */
export default function ReelsTab({ 
  reels = [],
  isOwnProfile = false,
  onReelClick,
  onDeleteReel,
  loading = false
}) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  // ══════════════════════════════════════════════════════════════════════════════
  // FILTERING
  // ══════════════════════════════════════════════════════════════════════════════

  const filteredReels = useMemo(() => {
    if (!selectedCategory) return reels

    return reels.filter(r => r.category === selectedCategory)
  }, [reels, selectedCategory])

  // ══════════════════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const totalViews = useMemo(() => {
    return reels.reduce((sum, r) => sum + (r.views || 0), 0)
  }, [reels])

  const totalReels = reels.length

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleDeleteReel = async (reel) => {
    if (window.confirm(`Tem certeza que deseja deletar este reel?`)) {
      await onDeleteReel?.(reel.id)
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="w-full py-8 flex items-center justify-center">
        <div className="text-neutral-500 dark:text-[#b0b3b8]">
          Carregando reels...
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header com Contadores */}
      <div className="px-4 py-3 bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {totalReels} {totalReels === 1 ? 'Reel' : 'Reels'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-[#b0b3b8]">
              {totalViews.toLocaleString('pt-BR')} visualizações
            </p>
          </div>
          {totalReels > 0 && (
            <div className="text-right">
              <p className="text-xs text-neutral-500 dark:text-[#b0b3b8]">
                Média: {Math.round(totalViews / totalReels).toLocaleString('pt-BR')} views/reel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {totalReels > 0 && (
        <div className="px-4 py-3 space-y-2">
          <p className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
            Filtrar por categoria
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 dark:bg-[#3a3b3c] text-neutral-700 dark:text-[#b0b3b8] hover:bg-neutral-300 dark:hover:bg-[#4a4b4c]'
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                  selectedCategory === cat.key
                    ? 'text-white'
                    : 'bg-neutral-200 dark:bg-[#3a3b3c] text-neutral-700 dark:text-[#b0b3b8] hover:bg-neutral-300 dark:hover:bg-[#4a4b4c]'
                }`}
                style={
                  selectedCategory === cat.key
                    ? { backgroundColor: cat.color }
                    : {}
                }
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reels Grid */}
      {filteredReels.length === 0 ? (
        <div className="w-full py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p className="text-neutral-500 dark:text-[#b0b3b8] text-sm">
              {selectedCategory
                ? 'Nenhum reel nesta categoria'
                : 'Nenhum reel ainda'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 px-4">
          {filteredReels.map(reel => (
            <div key={reel.id} className="relative group">
              <ReelCard
                reel={reel}
                onClick={onReelClick}
              />
              
              {/* Delete Button (for own profile) */}
              {isOwnProfile && (
                <button
                  onClick={() => handleDeleteReel(reel)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Deletar reel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
