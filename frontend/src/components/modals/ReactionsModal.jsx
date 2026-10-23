import { X, ThumbsUp, Heart, Laugh, Zap, Frown, Flame } from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'
import { REACTIONS } from '../../data/mock'
import { useState } from 'react'

// Mapeamento de ícones de reação
const REACTION_ICONS = {
  ThumbsUp,
  Heart,
  Laugh,
  Zap,
  Frown,
  Flame,
}

export default function ReactionsModal({ post, onClose }) {
  const [filter, setFilter] = useState('all') // 'all' ou chave de reação
  
  if (!post) return null

  // Gerar lista de quem reagiu (mock data - em produção viria da API)
  const reactions = post.reactions || {}
  const total = Object.values(reactions).reduce((a, b) => a + b, 0)

  // Simular lista de utilizadores que reagiram (mock)
  const generateReactors = () => {
    const mockUsers = [
      { id: 1, name: 'Ana Silva', course: 'Eng. Informática', reaction: 'like' },
      { id: 2, name: 'Carlos Mendes', course: 'Medicina', reaction: 'love' },
      { id: 3, name: 'Beatriz Costa', course: 'Direito', reaction: 'like' },
      { id: 4, name: 'Daniel Santos', course: 'Arquitectura', reaction: 'haha' },
      { id: 5, name: 'Eva Pereira', course: 'Psicologia', reaction: 'wow' },
      { id: 6, name: 'Fernando Lima', course: 'Eng. Civil', reaction: 'like' },
      { id: 7, name: 'Gabriela Ramos', course: 'Economia', reaction: 'love' },
      { id: 8, name: 'Hugo Martins', course: 'Marketing', reaction: 'like' },
    ]
    return mockUsers
  }

  const allReactors = generateReactors()
  const filteredReactors = filter === 'all' 
    ? allReactors 
    : allReactors.filter(u => u.reaction === filter)

  // Tabs de filtro
  const tabs = [
    { key: 'all', label: 'Todos', count: total },
    ...REACTIONS.filter(r => (reactions[r.key] || 0) > 0).map(r => ({
      key: r.key,
      label: r.label,
      count: reactions[r.key],
      icon: r.icon,
      color: r.color,
    }))
  ]

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-[#2c2c2e]">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Reações
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2c2c2e] text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs de filtro */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 dark:border-[#2c2c2e] overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon ? REACTION_ICONS[tab.icon] : null
            const isActive = filter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-neutral-100 dark:bg-[#2c2c2e] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#3a3a3c]'
                }`}
              >
                {Icon && (
                  <Icon 
                    className="w-4 h-4" 
                    style={!isActive ? { color: tab.color } : {}}
                    fill={tab.key === 'love' && !isActive ? 'currentColor' : 'none'}
                    strokeWidth={2}
                  />
                )}
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-neutral-200 dark:bg-[#3a3a3c] text-neutral-600 dark:text-neutral-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Lista de utilizadores */}
        <div className="flex-1 overflow-y-auto">
          {filteredReactors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#2c2c2e] flex items-center justify-center mb-3">
                <ThumbsUp className="w-8 h-8 text-neutral-400 dark:text-[#636366]" />
              </div>
              <p className="text-neutral-500 dark:text-[#636366] text-sm">
                Nenhuma reação deste tipo
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-[#2c2c2e]">
              {filteredReactors.map(user => {
                const reaction = REACTIONS.find(r => r.key === user.reaction)
                const ReactionIcon = reaction ? REACTION_ICONS[reaction.icon] : ThumbsUp
                
                return (
                  <div key={user.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <UserAvatar name={user.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-[#636366] truncate">
                          {user.course}
                        </p>
                      </div>
                    </div>
                    
                    {/* Ícone de reação */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: reaction.color }}
                    >
                      <ReactionIcon 
                        className="w-4.5 h-4.5 text-white" 
                        fill={reaction.key === 'love' ? 'currentColor' : 'none'}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
