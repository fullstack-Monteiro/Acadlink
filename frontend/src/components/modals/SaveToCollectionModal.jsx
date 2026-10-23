import { useState } from 'react'
import { X, Plus, Check, Bookmark } from 'lucide-react'
import { usePosts } from '../../context/PostsContext'

const EMOJIS = ['📁', '🎓', '💼', '💡', '🔬', '📚', '🌍', '⭐', '🏆', '❤️']

export default function SaveToCollectionModal({ post, onClose }) {
  const { collections, createCollection, saveToCollection, removeFromCollection } = usePosts()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📁')
  const [saved, setSaved] = useState(false)

  // ids das coleções que já têm este post
  const inCollections = new Set(collections.filter(c => c.postIds.includes(post.id)).map(c => c.id))

  const toggle = (col) => {
    if (inCollections.has(col.id)) {
      removeFromCollection(post.id, col.id)
    } else {
      saveToCollection(post.id, col.id)
      setSaved(true)
    }
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const col = createCollection(newName.trim(), newEmoji)
    saveToCollection(post.id, col.id)
    setNewName('')
    setNewEmoji('📁')
    setCreating(false)
    setSaved(true)
  }

  const handleSaveWithoutCollection = () => {
    saveToCollection(post.id, null)
    setSaved(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full sm:max-w-sm bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl shadow-modal flex flex-col max-h-[80vh] animate-slide-up border border-white/20 dark:border-white/10"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#3a3a3a]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a]">
          <span className="font-semibold text-sm text-neutral-900 dark:text-white">Guardar em coleção</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {/* Guardar sem coleção */}
          {!post.saved && (
            <button
              onClick={handleSaveWithoutCollection}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Guardar sem coleção</span>
            </button>
          )}

          {collections.length === 0 && post.saved && (
            <p className="text-xs text-neutral-400 text-center py-4">Ainda não tens coleções. Cria uma abaixo!</p>
          )}

          {collections.map(col => {
            const active = inCollections.has(col.id)
            return (
              <button
                key={col.id}
                onClick={() => toggle(col)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                  active ? 'bg-primary-50 dark:bg-white/10' : 'hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-[#2a2a2a] flex items-center justify-center flex-shrink-0 text-lg">
                  {col.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{col.name}</p>
                  <p className="text-xs text-neutral-400">{col.postIds.length} post{col.postIds.length !== 1 ? 's' : ''}</p>
                </div>
                {active && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Create new */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-[#2a2a2a]" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-[#3a3a3a] text-sm text-neutral-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova coleção
            </button>
          ) : (
            <div className="space-y-2">
              {/* Emoji picker */}
              <div className="flex gap-1.5 flex-wrap">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => setNewEmoji(e)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                      newEmoji === e ? 'bg-primary-100 dark:bg-white/15 scale-110' : 'hover:bg-neutral-100 dark:hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Nome da coleção..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
                  className="flex-1 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-neutral-50 dark:bg-[#222222] px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Criar
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="px-3 py-2 bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 rounded-xl text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
