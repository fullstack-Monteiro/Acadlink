import { useState } from 'react'
import { X, Check, Bookmark, FolderPlus } from 'lucide-react'

export default function SaveToCollectionModal({ reel, onClose, onSave, existingCollections = [] }) {
  const [collections, setCollections] = useState(existingCollections)
  const [selectedCollections, setSelectedCollections] = useState([])
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDescription, setNewCollectionDescription] = useState('')

  const handleToggleCollection = (collectionId) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return

    const newCollection = {
      id: Date.now(),
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      count: 0,
      createdAt: new Date().toISOString()
    }

    setCollections(prev => [...prev, newCollection])
    setSelectedCollections(prev => [...prev, newCollection.id])
    setNewCollectionName('')
    setNewCollectionDescription('')
    setShowNewCollection(false)
  }

  const handleSave = () => {
    onSave?.(reel.id, selectedCollections)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white dark:bg-[#1e1e1e] rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
        
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#333333]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-[#282828]">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Guardar em coleção
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reel Preview */}
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-[#282828]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-[#282828] flex-shrink-0">
              {reel.thumbnail ? (
                <img 
                  src={reel.thumbnail} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-neutral-300 dark:text-[#636366]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-[#f5f5f7] line-clamp-2">
                {reel.description || 'Reel sem descrição'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-[#636366] mt-0.5">
                {reel.author?.name || reel.creator?.name || 'Autor'}
              </p>
            </div>
          </div>
        </div>

        {/* Collections List */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {/* Botão "Nova Coleção" */}
          {!showNewCollection && (
            <button
              onClick={() => setShowNewCollection(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-200 dark:border-[#333333] hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/10 transition-colors group mb-3"
            >
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-950/30 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                <FolderPlus className="w-5 h-5 text-brand-600 dark:text-brand-400 group-hover:text-white" />
              </div>
              <span className="text-sm font-semibold text-neutral-700 dark:text-[#aeaeb2] group-hover:text-brand-600 dark:group-hover:text-brand-400">
                Nova coleção
              </span>
            </button>
          )}

          {/* Form Nova Coleção */}
          {showNewCollection && (
            <div className="mb-4 p-4 rounded-xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-[#282828]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Criar nova coleção
                </h3>
                <button
                  onClick={() => setShowNewCollection(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-[#aeaeb2]"
                >
                  Cancelar
                </button>
              </div>
              <input
                type="text"
                placeholder="Nome da coleção"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
                className="w-full px-3 py-2 mb-2 rounded-lg bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#333333] text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 dark:placeholder-[#636366] focus:outline-none focus:border-brand-500"
                autoFocus
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={newCollectionDescription}
                onChange={e => setNewCollectionDescription(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
                className="w-full px-3 py-2 mb-3 rounded-lg bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#333333] text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 dark:placeholder-[#636366] focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="w-full py-2 rounded-lg bg-brand-500 disabled:bg-neutral-300 dark:disabled:bg-[#333333] text-white disabled:text-neutral-400 text-sm font-semibold transition-colors"
              >
                Criar coleção
              </button>
            </div>
          )}

          {/* Lista de Coleções Existentes */}
          {collections.length === 0 && !showNewCollection && (
            <div className="py-8 text-center">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-[#333333]" />
              <p className="text-sm text-neutral-500 dark:text-[#636366]">
                Ainda não tens coleções.
              </p>
              <p className="text-xs text-neutral-400 dark:text-[#636366] mt-1">
                Cria a tua primeira coleção acima.
              </p>
            </div>
          )}

          <div className="space-y-2">
            {collections.map(collection => (
              <button
                key={collection.id}
                onClick={() => handleToggleCollection(collection.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  selectedCollections.includes(collection.id)
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                    : 'border-neutral-200 dark:border-[#282828] hover:border-neutral-300 dark:hover:border-[#333333]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  selectedCollections.includes(collection.id)
                    ? 'bg-brand-500'
                    : 'bg-neutral-100 dark:bg-[#282828]'
                }`}>
                  {selectedCollections.includes(collection.id) ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-neutral-400 dark:text-[#636366]" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-[#f5f5f7] truncate">
                    {collection.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-[#636366]">
                    {collection.count || 0} {collection.count === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer com botão Guardar */}
        <div className="px-5 py-4 border-t border-neutral-100 dark:border-[#282828]" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <button
            onClick={handleSave}
            disabled={selectedCollections.length === 0}
            className="w-full py-3 rounded-xl bg-brand-500 disabled:bg-neutral-300 dark:disabled:bg-[#333333] text-white disabled:text-neutral-400 font-semibold transition-all active:scale-95 disabled:cursor-not-allowed"
          >
            {selectedCollections.length === 0 
              ? 'Seleciona uma coleção' 
              : `Guardar em ${selectedCollections.length} ${selectedCollections.length === 1 ? 'coleção' : 'coleções'}`
            }
          </button>
        </div>
      </div>
    </>
  )
}
