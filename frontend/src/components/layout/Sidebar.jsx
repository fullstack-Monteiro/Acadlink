import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePosts } from '../../context/PostsContext'
import { SUGGESTIONS } from '../../data/mock'
import UserAvatar from '../ui/UserAvatar'
import UniversityTag from '../profile/UniversityTag'
import VerificationBadge from '../profile/VerificationBadge'
import { stringifyUniversity } from '../../utils/university'

// ─── Bloco reutilizável ───────────────────────────────────────────────────────
function SideCard({ label, title, children }) {
  return (
    <div className="
      rounded-2xl p-4
      bg-white dark:bg-[#1e1e1e]
      border border-neutral-200 dark:border-[#282828]
    ">
      {label && (
        <p className="text-[11px] uppercase tracking-widest font-medium text-neutral-400 dark:text-[#636366] mb-1">
          {label}
        </p>
      )}
      {title && (
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-[#f5f5f7] mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default function Sidebar() {
  const { user }   = useAuth()
  const { posts }  = usePosts()
  const navigate   = useNavigate()

  const userPostCount = posts.filter(p => p.author.id === user?.id).length
  const displayPosts  = userPostCount > 0 ? userPostCount : (user?.posts ?? 0)

  return (
    <aside className="space-y-3">

      {/* ── Perfil mini ── */}
      <SideCard label="O teu perfil">
        <Link to="/profile" className="flex items-center gap-3 group">
          <UserAvatar name={user?.name} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-neutral-900 dark:text-[#f5f5f7] group-hover:text-[#1D6AFF] transition-colors truncate">
              {user?.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-[#aeaeb2] truncate">{user?.course}</p>
            <p className="text-xs text-neutral-400 dark:text-[#636366] truncate">{stringifyUniversity(user?.university)}</p>
          </div>
        </Link>

        <div className="flex gap-6 mt-3 pt-3 border-t border-neutral-100 dark:border-[#282828]">
          <div>
            <p className="font-bold text-sm text-neutral-900 dark:text-[#f5f5f7]">{displayPosts}</p>
            <p className="text-xs text-neutral-400 dark:text-[#636366]">Posts</p>
          </div>
          <div>
            <p className="font-bold text-sm text-neutral-900 dark:text-[#f5f5f7]">{user?.connections ?? 0}</p>
            <p className="text-xs text-neutral-400 dark:text-[#636366]">Conexões</p>
          </div>
        </div>
      </SideCard>

      {/* ── Sugestões ── */}
      <SideCard label="Sugestões" title="Pessoas que podes conhecer">
        <div className="space-y-3">
          {SUGGESTIONS.map(s => (
            <div key={s.id} className="flex items-center gap-2.5">
              <UserAvatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-[#f5f5f7] truncate">{s.name}</p>
                  {s.verified && <VerificationBadge university={s.verifiedUniversity} showLabel={false} />}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <UniversityTag university={s.university} size="xs" />
                  <p className="text-xs text-neutral-400 dark:text-[#636366]">{s.mutual} mútuos</p>
                </div>
              </div>
              <button
                onClick={() => {}}
                className="
                  flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                  bg-neutral-100 dark:bg-[#282828]
                  text-neutral-500 dark:text-[#aeaeb2]
                  hover:bg-[#1D6AFF]/10 hover:text-[#1D6AFF]
                  transition-all
                "
                aria-label={`Conectar com ${s.name}`}
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SideCard>

      {/* ── Tópicos em alta ── */}
      <SideCard label="Descoberta" title="Tópicos em alta">
        <div className="flex flex-wrap gap-1.5">
          {['#UEM2026', '#Hackathon', '#Bolsas', '#Estágios', '#TI', '#Medicina', '#Direito'].map(tag => (
            <button
              key={tag}
              onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
              className="
                px-2.5 py-1 rounded-full text-xs font-medium
                bg-neutral-100 dark:bg-[#282828]
                text-neutral-600 dark:text-[#aeaeb2]
                hover:bg-[#1D6AFF]/10 hover:text-[#1D6AFF]
                dark:hover:bg-[#1D6AFF]/15 dark:hover:text-[#1D6AFF]
                transition-all
              "
            >
              {tag}
            </button>
          ))}
        </div>
      </SideCard>

    </aside>
  )
}
