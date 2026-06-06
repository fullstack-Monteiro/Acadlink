import { useState, useEffect, useMemo } from 'react'
import { Search, X, Filter } from 'lucide-react'
import ReelCard from '../components/reels/ReelCard'
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
 * - Resultados em grid
 */
export default function ReelSearch() {
  const { searchReels } = useReels()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
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
        const searchResults = await searchReels(query, filters)
        setResults(searchResults)

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
  }, [query, filters, searchReels, searchHistory])

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

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#000000] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#242526] border-b border-neutral-200 dark:border-[#3a3b3c] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-[#3a3b3c] rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-neutral-500 dark:text-[#b0b3b8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar reels, hashtags..."
              maxLength={50}
              className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-[#b0b3b8] outline-none"
            />
            {query && (
              <button
                onClick={handleClearSearch}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-[#4a4b4c] rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600 dark:text-[#b0b3b8]" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full transition-colors ${
              showFilters
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 dark:bg-[#3a3b3c] text-neutral-600 dark:text-[#b0b3b8] hover:bg-neutral-200 dark:hover:bg-[#4a4b4c]'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-neutral-50 dark:bg-[#3a3b3c] border-b border-neutral-200 dark:border-[#4a4b4c] px-4 py-4 space-y-4">
          {/* Categories */}
          <div>
            <p className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8] mb-2">
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
                      : 'bg-white dark:bg-[#4a4b4c] text-neutral-700 dark:text-[#b0b3b8]'
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
            <p className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8] mb-2">
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
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-[#4a4b4c] text-neutral-700 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#5a5b5c]'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Views */}
          <div>
            <p className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8] mb-2">
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
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Buscas Recentes
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-neutral-500 dark:text-[#b0b3b8] hover:text-neutral-700 dark:hover:text-white transition-colors"
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
              <p className="text-sm text-neutral-600 dark:text-[#b0b3b8]">
                {loading ? 'Buscando...' : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-neutral-500 dark:text-[#b0b3b8]">
                  Carregando resultados...
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-neutral-500 dark:text-[#b0b3b8]">
                    Nenhum reel encontrado para "{query}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {results.map(reel => (
                  <ReelCard
                    key={reel.id}
                    reel={reel}
                    onClick={() => {
                      // TODO: Navigate to reel player
                      console.log('Open reel:', reel.id)
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!query && searchHistory.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-neutral-500 dark:text-[#b0b3b8]">
                Digite algo para buscar reels
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
