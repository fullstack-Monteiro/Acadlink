import { useState } from 'react'
import { Bookmark, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import PostCard from '../components/feed/PostCard'
import EmptyState from '../components/ui/EmptyState'
import { usePosts } from '../context/PostsContext'
import { Link, useNavigate } from 'react-router-dom'

// coleção virtual "Todos os guardados"
const ALL_COL = { id: '__all__', name: 'Todos os guardados', emoji: '🔖' }

function CollectionView({ col, colPosts, onBack, onDelete }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#222222] text-neutral-500 dark:text-[#e4e6ea] transition-colors"
          aria-label="Voltar"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <span className="text-2xl select-none">{col.emoji}</span>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white truncate">{col.name}</h2>
          <p className="text-xs text-neutral-500 dark:text-[#b0b3b8]">{colPosts.length} post{colPosts.length !== 1 ? 's' : ''}</p>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 dark:text-[#b0b3b8] hover:text-red-500 transition-colors"
            aria-label="Apagar coleção"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {colPosts.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Coleção vazia"
          subtitle="Guarda posts nesta coleção a partir do feed."
        />
      ) : (
        <div className="space-y-3">
          {colPosts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  )
}

function ColCard({ col, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-neutral-100 dark:border-[#2a2a2a] hover:border-primary-300 dark:hover:border-primary-700 transition-all text-left shadow-card w-full"
    >
      <span className="text-2xl select-none">{col.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{col.name}</p>
        <p className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{count} post{count !== 1 ? 's' : ''}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
    </button>
  )
}

export default function Saved() {
  const navigate = useNavigate()
  const { savedPosts, collections, deleteCollection } = usePosts()
  const [activeCol, setActiveCol] = useState(null)

  // normaliza ids para string para evitar mismatch number/string após localStorage
  const getColPosts = (col) => {
    if (col.id === '__all__') return savedPosts
    const ids = new Set(col.postIds.map(String))
    return savedPosts.filter(p => ids.has(String(p.id)))
  }

  if (activeCol) {
    const colPosts = getColPosts(activeCol)
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">
          <CollectionView
            col={activeCol}
            colPosts={colPosts}
            onBack={() => setActiveCol(null)}
            onDelete={activeCol.id !== '__all__' ? () => { deleteCollection(activeCol.id); setActiveCol(null) } : null}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Posts guardados</h1>
            <p className="text-sm text-neutral-500 dark:text-[#b0b3b8]">{savedPosts.length} post{savedPosts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {savedPosts.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="Nenhum post guardado"
            subtitle="Guarda posts interessantes para os rever mais tarde."
            action={
              <Link to="/dashboard" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                Explorar feed
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {/* Todos os guardados — sempre visível */}
            <ColCard
              col={ALL_COL}
              count={savedPosts.length}
              onClick={() => setActiveCol(ALL_COL)}
            />

            {/* Coleções criadas pelo utilizador */}
            {collections.map(col => (
              <ColCard
                key={col.id}
                col={col}
                count={getColPosts(col).length}
                onClick={() => setActiveCol(col)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
