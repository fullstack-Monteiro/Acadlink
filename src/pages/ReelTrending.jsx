import { useState, useEffect } from 'react'
import { Flame, TrendingUp } from 'lucide-react'
import ReelCard from '../components/reels/ReelCard'
import { useReels } from '../context/ReelsContext'
import { CATEGORIES } from '../context/ReelsContext'

/**
 * ReelTrending Page
 * 
 * Exibe reels em alta agrupados por categoria
 * Baseado em engajamento (likes, comments, shares)
 * 
 * Features:
 * - Reels em alta por categoria
 * - Cálculo de trending score
 * - Filtro por categoria
 * - Indicador de tendência
 */
export default function ReelTrending() {
  const { getTrendingReels } = useReels()
  const [trendingReels, setTrendingReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // ══════════════════════════════════════════════════════════════════════════════
  // LOAD TRENDING
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true)
      try {
        const reels = await getTrendingReels()
        setTrendingReels(reels)
      } catch (error) {
        console.error('Erro ao carregar trending:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTrending()
  }, [getTrendingReels])

  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP BY CATEGORY
  // ══════════════════════════════════════════════════════════════════════════════

  const groupedByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category.key] = {
      ...category,
      reels: trendingReels.filter(r => r.category === category.key)
    }
    return acc
  }, {})

  const filteredCategories = selectedCategory
    ? [groupedByCategory[selectedCategory]].filter(Boolean)
    : Object.values(groupedByCategory).filter(cat => cat.reels.length > 0)

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#000000] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#242526] border-b border-neutral-200 dark:border-[#3a3b3c] px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Em Alta
          </h1>
        </div>
        <p className="text-sm text-neutral-600 dark:text-[#b0b3b8]">
          Reels mais engajados agora
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-neutral-50 dark:bg-[#3a3b3c] border-b border-neutral-200 dark:border-[#4a4b4c] px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-min">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-[#4a4b4c] text-neutral-700 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#5a5b5c]'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.key
                  ? 'text-white'
                  : 'bg-white dark:bg-[#4a4b4c] text-neutral-700 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#5a5b5c]'
              }`}
              style={
                selectedCategory === cat.key
                  ? { backgroundColor: cat.color }
                  : {}
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-neutral-500 dark:text-[#b0b3b8]">
              Carregando reels em alta...
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-neutral-500 dark:text-[#b0b3b8]">
                Nenhum reel em alta nesta categoria
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map(category => (
              <div key={category.key}>
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {category.label}
                  </h2>
                  <span className="text-xs font-medium text-neutral-500 dark:text-[#b0b3b8] bg-neutral-100 dark:bg-[#3a3b3c] px-2 py-1 rounded-full">
                    {category.reels.length} reels
                  </span>
                </div>

                {/* Reels Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {category.reels.map((reel, idx) => (
                    <div key={reel.id} className="relative group">
                      {/* Trending Badge */}
                      {idx < 3 && (
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          <Flame className="w-3 h-3" />
                          #{idx + 1}
                        </div>
                      )}

                      <ReelCard
                        reel={reel}
                        onClick={() => {
                          // TODO: Navigate to reel player
                          console.log('Open reel:', reel.id)
                        }}
                      />

                      {/* Engagement Score */}
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>
                            {(reel.likes + reel.comments * 2 + reel.shares * 1.5).toFixed(0)} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
