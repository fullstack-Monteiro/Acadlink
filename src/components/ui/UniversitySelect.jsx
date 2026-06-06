import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import api from '../../services/api'

export default function UniversitySelect({ value, onChange, error, status, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [universities, setUniversities] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  // Carregar universidades do backend
  useEffect(() => {
    api.get('/universities/')
      .then(res => {
        setUniversities(res.data)
        setFiltered(res.data)
      })
      .catch(err => {
        console.error('Erro ao carregar universidades:', err)
        setUniversities([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filtrar universidades conforme digita
  useEffect(() => {
    const filtered = universities.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(filtered)
  }, [search, universities])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = () => {
    if (status === 'valid') return 'border-green-500'
    if (status === 'invalid') return 'border-red-500'
    if (status === 'warning') return 'border-yellow-500'
    return 'border-neutral-200 dark:border-[#3a3b3c]'
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-medium text-neutral-700 dark:text-[#e4e6ea]">
        Universidade
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full rounded-xl border ${getStatusColor()} bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] px-4 py-2.5 flex items-center justify-between transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
        >
          <span className={value ? 'text-neutral-900 dark:text-[#e4e6ea]' : 'text-neutral-400'}>
            {value ? value.name : 'Selecciona a universidade'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#242526] border border-neutral-200 dark:border-[#3a3b3c] rounded-xl shadow-lg z-50">
            {/* Search */}
            <div className="p-3 border-b border-neutral-200 dark:border-[#3a3b3c]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Busca universidade..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  Carregando universidades...
                </div>
              ) : filtered.length > 0 ? (
                filtered.map(uni => (
                  <button
                    key={uni.id}
                    type="button"
                    onClick={() => {
                      onChange(uni)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors ${
                      value?.id === uni.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-900 dark:text-[#e4e6ea]'
                    }`}
                  >
                    {uni.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  Nenhuma universidade encontrada
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  )
}
