import { useState, useEffect, useMemo } from 'react'
import { Search, X, Filter, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReelPlayer from '../components/reels/ReelPlayer'
import { useReels } from '../context/ReelsContext'
import { CATEGORIES } from '../context/ReelsContext'

/**
 * ReelSearch Page
 * 
 * Página de busca de reels com filtros avançados
 * Suporta busca por hashtags, descrição e filtros
 * 
 * Features:
 * - Busca com mínimo 2 caracteres
 * - Filtro por categoria
 * - Filtro por data
 * - Filtro por visualizações mínimas
 * - Histórico de buscas
 * - Player full-screen como Facebook Reels
 */

// ══════════════════════════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════════════════════════

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export default function ReelSearch() {
  const navigate = useNavigate()
  const { searchReels, reels, likeReel, unlikeReel, saveReel, unsaveReel, reportReel } = useReels()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [followingStates, setFollowingStates] = useState({})
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('acadlink_search_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ══════════════════════════════════════════════════════════════════════════════
  // FILTERS
  // ══════════════════════════════════════════════════════════════════════════════

  const [filters, setFilters] = useState({
    categories: [],
    minViews: 0,
    sortBy: 'recent' // recent, views, engagement
  })

  // ══════════════════════════════════════════════════════════════════════════════
  // SEARCH LOGIC
  // ══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const performSearch = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        // Filtrar reels localmente
        const lowerQuery = query.toLowerCase()
        let filteredReels = reels.filter(reel => {
          const matchesQuery = 
            reel.description?.toLowerCase().includes(lowerQuery) ||
            reel.author?.name?.toLowerCase().includes(lowerQuery) ||
            reel.creator?.name?.toLowerCase().includes(lowerQuery)
          
          const matchesCategory = 
            filters.categories.length === 0 || 
            filters.categories.includes(reel.category)
          
          return matchesQuery && matchesCategory
        })

        // Ordenar resultados
        if (filters.sortBy === 'views') {
          filteredReels = filteredReels.sort((a, b) => 
            (b.views || b.views_count || 0) - (a.views || a.views_count || 0)
          )
        } else if (filters.sortBy === 'engagement') {
          filteredReels = filteredReels.sort((a, b) => {
            const engA = (a.likes_count || 0) + (a.comments_count || 0)
            const engB = (b.likes_count || 0) + (b.comments_count || 0)
            return engB - engA
          })
        } else {
          // recent - manter ordem original
        }

        setResults(filteredReels)

        // Add to history
        if (!searchHistory.includes(query)) {
          const newHistory = [query, ...searchHistory].slice(0, 10)
          setSearchHistory(newHistory)
          localStorage.setItem('acadlink_search_history', JSON.stringify(newHistory))
        }
      } catch (error) {
        console.error('Erro ao buscar reels:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, filters, reels, searchHistory])

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleClearSearch = () => {
    setQuery('')
    setResults([])
  }

  const handleSearchHistoryClick = (historyQuery) => {
    setQuery(historyQuery)
  }

  const handleClearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('acadlink_search_history')
  }

  const handleCategoryToggle = (categoryKey) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryKey)
        ? prev.categories.filter(c => c !== categoryKey)
        : [...prev.categories, categoryKey]
    }))
  }

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }

  const handleReelClick = (index) => {
    setCurrentReelIndex(index)
    setShowPlayer(true)
  }

  const handleClosePlayer = () => {
    setShowPlayer(false)
  }

  const handleLike = async (reelId) => {
    const reel = results.find(r => r.id === reelId)
    if (!reel) return
    if (reel.is_liked) {
      await unlikeReel(reelId)
    } else {
      await likeReel(reelId)
    }
  }

  const handleComment = (reel) => {
    // TODO: Implementar comentários
    console.log('comment', reel)
  }

  const handleShare = async (reel) => {
    const url = `${window.location.origin}/reels?id=${reel.id}`
    if (navigator.share) {
      await navigator.share({ title: 'AcadLink Reel', url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleSave = async (reel) => {
    if (reel.is_bookmarked) {
      await unsaveReel(reel.id)
    } else {
      await saveReel(reel.id)
    }
  }

  const handleMore = (reel) => {
    console.log('more', reel)
  }

  const handleFollowClick = (creator) => {
    const id = creator?.id || creator?.username || ''
    setFollowingStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCreatorClick = (creator) => {
    if (creator?.id) navigate(`/profile/${creator.id}`)
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  // Renderizar player em tela cheia
  if (showPlayer && results.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div
          className="w-full h-full overflow-y-scroll"
          style={{
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
            overscrollBehavior: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {results.map((reel, idx) => (
            <div
              key={reel.id ?? idx}
              className="w-full relative"
              style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
            >
              <ReelPlayer
                reel={reel}
                onNext={() => {
                  if (idx < results.length - 1) {
                    setCurrentReelIndex(idx + 1)
                  }
                }}
                onPrevious={() => {
                  if (idx > 0) {
                    setCurrentReelIndex(idx - 1)
                  }
                }}
                onClose={handleClosePlayer}
                autoPlay={idx === currentReelIndex}
                onCreatorClick={() => handleCreatorClick(reel.creator || reel.author)}
                onHashtagClick={() => {}}
                onFollowClick={() => handleFollowClick(reel.creator || reel.author)}
                onLike={() => handleLike(reel.id)}
                onComment={() => handleComment(reel)}
                onShare={() => handleShare(reel)}
                onSave={() => handleSave(reel)}
                onMore={() => handleMore(reel)}
                isFollowing={followingStates[reel.creator?.id || reel.author?.id]}
              />
            </div>
          ))}
        </div>

        {/* Botão Fechar */}
        <button
          onClick={handleClosePlayer}
          className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/30 border border-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/15 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#141414] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1e1e] border-b border-neutral-200 dark:border-[#282828] px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-900 dark:text-white transition-colors flex-shrink-0"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Barra de Busca */}
          <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-[#282828] rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-neutral-500 dark:text-[#636366]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar reels, hashtags..."
              maxLength={50}
              autoFocus
              className="flex-1 bg-transparent text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-500 dark:placeholder-[#636366] outline-none text-sm"
            />
            {query && (
              <button
                onClick={handleClearSearch}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-[#333333] rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600 dark:text-[#636366]" />
              </button>
            )}
          </div>

          {/* Botão Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${
              showFilters
                ? 'bg-brand-500 text-white'
                : 'bg-neutral-100 dark:bg-[#282828] text-neutral-600 dark:text-[#636366] hover:bg-neutral-200 dark:hover:bg-[#333333]'
            }`}
            aria-label="Filtros"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-neutral-50 dark:bg-[#282828] border-b border-neutral-200 dark:border-[#333333] px-4 py-4 space-y-4">
          {/* Categories */}
          <div>
            <p className="text-xs font-medium text-neutral-600 dark:text-[#aeaeb2] mb-2">
              Categorias
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryToggle(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    filters.categories.includes(cat.key)
                      ? 'text-white'
                      : 'bg-white dark:bg-[#333333] text-neutral-700 dark:text-[#aeaeb2]'
                  }`}
                  style={
                    filters.categories.includes(cat.key)
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

          {/* Sort */}
          <div>
            <p className="text-xs font-medium text-neutral-600 dark:text-[#aeaeb2] mb-2">
              Ordenar por
            </p>
            <div className="flex gap-2">
              {[
                { key: 'recent', label: 'Recentes' },
                { key: 'views', label: 'Mais Visualizados' },
                { key: 'engagement', label: 'Mais Engajados' }
              ].map(sort => (
                <button
                  key={sort.key}
                  onClick={() => handleSortChange(sort.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filters.sortBy === sort.key
                      ? 'bg-brand-500 text-white'
                      : 'bg-white dark:bg-[#333333] text-neutral-700 dark:text-[#aeaeb2] hover:bg-neutral-100 dark:hover:bg-[#3a3a3a]'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Views */}
          <div>
            <p className="text-xs font-medium text-neutral-600 dark:text-[#aeaeb2] mb-2">
              Visualizações mínimas: {filters.minViews}
            </p>
            <input
              type="range"
              min="0"
              max="1000"
              step="100"
              value={filters.minViews}
              onChange={(e) => setFilters(prev => ({ ...prev, minViews: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search History (when no query) */}
        {!query && searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-900 dark:text-[#f5f5f7]">
                Buscas Recentes
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-neutral-500 dark:text-[#636366] hover:text-neutral-700 dark:hover:text-[#aeaeb2] transition-colors"
              >
                Limpar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((historyQuery, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchHistoryClick(historyQuery)}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-[#3a3b3c] text-neutral-700 dark:text-[#b0b3b8] rounded-full text-sm hover:bg-neutral-200 dark:hover:bg-[#4a4b4c] transition-colors"
                >
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <>
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-[#aeaeb2]">
                {loading ? 'Buscando...' : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-neutral-500 dark:text-[#636366]">
                  Carregando resultados...
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Search className="w-12 h-12 mb-3 mx-auto text-neutral-300 dark:text-[#333333]" />
                  <p className="text-neutral-500 dark:text-[#636366]">
                    Nenhum reel encontrado para <span className="font-semibold">"{query}"</span>
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-[#636366] mt-2">
                    Tenta pesquisar por outro termo ou ajusta os filtros
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {results.map((reel, index) => (
                  <button
                    key={reel.id}
                    onClick={() => handleReelClick(index)}
                    className="relative aspect-[9/16] rounded-lg overflow-hidden bg-[#282828] hover:scale-[1.02] active:scale-[0.98] transition-transform group"
                  >
                    {/* Thumbnail */}
                    {reel.thumbnailUrl || reel.thumbnail_url || reel.video_url ? (
                      <img
                        src={reel.thumbnailUrl || reel.thumbnail_url || reel.video_url}
                        alt={reel.description || 'Reel'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e]">
                        <Search className="w-8 h-8 text-[#636366]" />
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-white text-xs font-medium line-clamp-2 mb-1.5">
                        {reel.description}
                      </p>
                      <div className="flex items-center gap-2 text-white/80 text-[11px]">
                        <span>{formatNumber(reel.views_count || reel.viewsCount || 0)} views</span>
                        <span>•</span>
                        <span>{formatNumber(reel.likes_count || reel.likesCount || 0)} likes</span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!query && searchHistory.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Search className="w-12 h-12 mb-3 mx-auto text-neutral-300 dark:text-[#333333]" />
              <p className="text-base font-semibold text-neutral-900 dark:text-[#f5f5f7] mb-1">
                Descobre reels académicos
              </p>
              <p className="text-sm text-neutral-500 dark:text-[#636366]">
                Pesquisa por tópicos, criadores ou hashtags
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
