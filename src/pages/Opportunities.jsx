import { useState } from 'react'
import { Search, PenSquare, ChevronLeft } from 'lucide-react'
import { usePosts } from '../context/PostsContext'
import Navbar from '../components/layout/Navbar'
import PostCard from '../components/feed/PostCard'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import BackButton from '../components/layout/BackButton'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserAvatar from '../components/ui/UserAvatar'

const FILTERS = [
  { key: 'todos',        label: 'Todos' },
  { key: 'oportunidade', label: '💼 Vagas, Estágios & Bolsas' },
  { key: 'evento',       label: '📅 Eventos' },
  { key: 'académico',    label: '📚 Académico' },
]

export default function Opportunities() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { posts, toggleSave } = usePosts()
  const [filter, setFilter] = useState('todos')
  const [query, setQuery] = useState('')
  const hasError = !Array.isArray(posts)

  const filtered = posts.filter(p => {
    const matchCat = filter === 'todos' || p.category === filter
    const matchQ = !query || p.content.toLowerCase().includes(query.toLowerCase()) ||
      p.author.name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="-ml-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">Oportunidades</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Partilhadas por estudantes de todas as universidades</p>
          </div>
        </div>

        {/* Caixa de partilha rápida */}
        <div className="bg-white dark:bg-[#242526] rounded-2xl border border-neutral-100 dark:border-[#3a3b3c] shadow-card p-3 mb-4 flex items-center gap-3">
          <UserAvatar name={user?.name} size="sm" />
          <Link to="/create-post" className="flex-1">
            <div className="w-full bg-neutral-100 dark:bg-[#222222] hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] rounded-full px-4 py-2.5 text-sm text-neutral-400 dark:text-[#b0b3b8] cursor-pointer transition-colors select-none">
              Partilha uma bolsa, vaga ou evento...
            </div>
          </Link>
          <Link to="/create-post">
            <button className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors flex-shrink-0">
              <PenSquare className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Pesquisa */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#b0b3b8] w-4 h-4" />
          <input type="text" placeholder="Pesquisar oportunidades partilhadas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                filter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-[#e4e6ea]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {hasError ? (
            <ErrorState
              scope="opportunities.page"
              title="Erro ao carregar oportunidades"
              subtitle="Nao foi possivel carregar as publicacoes desta tela."
              meta={{ filter, query }}
              onRetry={() => window.location.reload()}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="💼"
              title="Nenhuma oportunidade encontrada"
              subtitle="Sê o primeiro a partilhar uma bolsa, vaga ou evento!"
              action={
                <Link to="/create-post" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                  Partilhar oportunidade
                </Link>
              }
            />
          ) : (
            filtered.map(p => <PostCard key={p.id} post={p} onSaveToggle={toggleSave} />)
          )}
        </div>
      </div>
    </div>
  )
}
