import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePosts } from '../../context/PostsContext'
import { SUGGESTIONS } from '../../data/mock'
import UserAvatar from '../ui/UserAvatar'
import Card from '../ui/Card'
import Button from '../ui/Button'
import UniversityTag from '../profile/UniversityTag'
import VerificationBadge from '../profile/VerificationBadge'
import { stringifyUniversity } from '../../utils/university'

export default function Sidebar() {
  const { user } = useAuth()
  const { posts } = usePosts()
  const navigate = useNavigate()

  const userPostCount = posts.filter(p => p.author.id === user?.id).length
  const displayPosts = userPostCount > 0 ? userPostCount : (user?.posts ?? 0)

  return (
    <aside className="space-y-4">
      {/* My profile mini */}
      <Card className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-neutral-400 mb-3">O teu perfil</p>
        <Link to="/profile" className="flex items-center gap-3 group">
          <UserAvatar name={user?.name} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors truncate">
              {user?.name}
            </p>
            <p className="text-xs text-neutral-600 truncate">{user?.course}</p>
            <p className="text-xs text-neutral-500 truncate">{stringifyUniversity(user?.university)}</p>
          </div>
        </Link>
        <div className="flex gap-4 mt-3 pt-3 border-t border-neutral-100 dark:border-[#2a2a2a]">
          <div className="text-center">
            <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{displayPosts}</p>
            <p className="text-xs text-neutral-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{user?.connections ?? 0}</p>
            <p className="text-xs text-neutral-600">Conexões</p>
          </div>
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">Sugestoes</p>
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-3">
          Sugestões para ti
        </h3>
        <div className="space-y-3">
          {SUGGESTIONS.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <UserAvatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{s.name}</p>
                  {s.verified && <VerificationBadge university={s.verifiedUniversity} showLabel={false} />}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <UniversityTag university={s.university} size="xs" />
                    <p className="text-xs text-neutral-600">{s.mutual} mútuos</p>
                </div>
              </div>
              <button
                onClick={() => {}}
                className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-150 bg-neutral-100 dark:bg-[#222222] text-neutral-600 hover:bg-primary-50 hover:text-primary-600"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Trending tags */}
      <Card className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">Descoberta</p>
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-3">
          Tópicos em alta
        </h3>
        <div className="flex flex-wrap gap-2">
          {['#UEM2026', '#Hackathon', '#Bolsas', '#Estágios', '#TI', '#Medicina', '#Direito'].map(tag => (
            <span key={tag} onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)} className="px-2.5 py-1 bg-neutral-100 dark:bg-[#222222] text-neutral-600 dark:text-white rounded-full text-xs hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </aside>
  )
}
