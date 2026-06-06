import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, GraduationCap, MessageCircle, UserPlus, UserCheck, ChevronLeft, ExternalLink } from 'lucide-react'
import { ALL_USERS, ACHIEVEMENTS } from '../data/mock'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import { useMessages } from '../context/MessagesContext'
import Navbar from '../components/layout/Navbar'
import UserAvatar from '../components/ui/UserAvatar'
import PostCard from '../components/feed/PostCard'
import Card from '../components/ui/Card'
import UniversityTag from '../components/profile/UniversityTag'
import VerificationBadge from '../components/profile/VerificationBadge'
import UsersListModal from '../components/profile/UsersListModal'
import EmptyState from '../components/ui/EmptyState'

const TABS = ['Posts', 'Portfólio', 'Conquistas', 'Conexões']

const CONNECTION_TYPE_LABEL = {
  colega:        { icon: '🔗', label: 'Colega',        degree: 1 },
  universitario: { icon: '🏛️', label: 'Universitário', degree: 1 },
  academico:     { icon: '🌍', label: 'Académico',     degree: 2 },
  mentor:        { icon: '👨‍🏫', label: 'Mentor',       degree: 1 },
}

function getConnectionType(me, other) {
  if (me?.course === other.course && me?.university === other.university) return 'colega'
  if (me?.university === other.university) return 'universitario'
  return 'academico'
}

export default function PublicProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: me, toggleConnect, isConnected } = useAuth()
  const { posts } = usePosts()
  const { getOrCreateConversation } = useMessages()
  const [tab, setTab] = useState('Posts')
  const [statsTab, setStatsTab] = useState(null)

  const profileUser = ALL_USERS.find(u => String(u.id) === String(userId))

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
        <Navbar />
        <EmptyState icon="👤" title="Perfil não encontrado" subtitle="Este utilizador não existe ou foi removido."
          action={<button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium">Voltar</button>}
        />
      </div>
    )
  }

  if (me?.id === profileUser.id) {
    navigate('/profile', { replace: true })
    return null
  }

  const userPosts = posts.filter(p => p.author.id === profileUser.id)
  const following = isConnected(profileUser.id)

  // conexões do perfil visitado
  const connections = ALL_USERS.filter(u => u.id !== profileUser.id && u.id !== me?.id).slice(0, 6)

  // portfólio mock do utilizador (vazio para outros utilizadores — só o próprio tem portfólio real)
  const portfolio = []
  const achievements = ACHIEVEMENTS.filter(a => a.userId === profileUser.id)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000] pb-24 md:pb-6">
      <Navbar />

      {/* Cover */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-500" />

      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="relative -mt-12 sm:-mt-14 mb-4">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-10 left-0 flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Voltar
          </button>

          <div className="flex items-end justify-between">
            <div className="ring-4 ring-white dark:ring-[#0d0d0d] rounded-full">
              <UserAvatar name={profileUser.name} size="xl" />
            </div>
            <div className="pb-2 flex gap-2">
              <button
                onClick={async () => {
                  const convId = await getOrCreateConversation(profileUser.id)
                  if (convId) {
                    navigate(`/messages?conv=${convId}`)
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#222222] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Mensagem</span>
              </button>
              <button
                onClick={() => toggleConnect(profileUser.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  following
                    ? 'border border-neutral-200 dark:border-[#2a2a2a] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#222222]'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {following ? <UserCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />}
                {following ? 'Conectado' : 'Conectar'}
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">{profileUser.name}</h1>
              <span className="text-sm text-neutral-400 dark:text-[#b0b3b8]">@{profileUser.username}</span>
              {profileUser.verified && (
                <VerificationBadge university={profileUser.verifiedUniversity} showLabel size="sm" />
              )}
            </div>
            <p className="text-neutral-600 dark:text-[#b0b3b8] text-sm mt-1 line-clamp-2">{profileUser.bio}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-neutral-500 dark:text-[#b0b3b8]">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                <UniversityTag university={profileUser.university} size="sm" />
                <span className="truncate">{profileUser.course} · {profileUser.year}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary-500 flex-shrink-0" />
                Moçambique
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 mt-4 pt-4 border-t border-neutral-100 dark:border-[#2a2a2a]">
            {[
              { key: 'posts',       label: 'Posts',    value: profileUser.posts },
              { key: 'connections', label: 'Conexões', value: profileUser.connections },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => s.key === 'connections' && setStatsTab('connections')}
                className={`text-left group transition-colors ${s.key === 'connections' ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className={`font-bold text-neutral-900 dark:text-white ${s.key === 'connections' ? 'group-hover:text-primary-600' : ''} transition-colors`}>{s.value}</span>
                <span className={`text-neutral-500 dark:text-[#b0b3b8] text-xs sm:text-sm ml-1 ${s.key === 'connections' ? 'group-hover:text-primary-600' : ''} transition-colors`}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-neutral-100 dark:border-[#2a2a2a] mb-4 gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-neutral-500 dark:text-[#e4e6ea] hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pb-6">

          {/* ── POSTS ── */}
          {tab === 'Posts' && (
            userPosts.length === 0
              ? <EmptyState icon="📝" title="Sem publicações" subtitle="Este utilizador ainda não publicou nada." />
              : <div className="space-y-3">{userPosts.map(p => <PostCard key={p.id} post={p} />)}</div>
          )}

          {/* ── PORTFÓLIO ── */}
          {tab === 'Portfólio' && (
            <div className="space-y-3">
              {portfolio.length === 0
                ? <EmptyState icon="💼" title="Portfólio vazio" subtitle="Este utilizador ainda não adicionou projectos." />
                : portfolio.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-white/10 text-primary-600 font-medium capitalize">{item.type}</span>
                      <span className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{item.year}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                    {item.description && <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mt-1 leading-relaxed">{item.description}</p>}
                    {item.links?.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.links.map(l => (
                          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
                            <ExternalLink className="w-3 h-3" /> {l.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </Card>
                ))
              }
            </div>
          )}

          {/* ── CONQUISTAS ── */}
          {tab === 'Conquistas' && (
            <div className="space-y-3">
              {achievements.length === 0
                ? <EmptyState icon="🏆" title="Sem conquistas" subtitle="Este utilizador ainda não adicionou conquistas." />
                : ['prémio', 'certificado', 'reconhecimento'].map(type => {
                    const items = achievements.filter(a => a.type === type)
                    if (!items.length) return null
                    const labels = { prémio: '🏆 Prémios', certificado: '📜 Certificados', reconhecimento: '🎖️ Reconhecimentos' }
                    return (
                      <div key={type}>
                        <p className="text-xs font-semibold text-neutral-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-2 px-1">{labels[type]}</p>
                        <Card className="overflow-hidden divide-y divide-neutral-100 dark:divide-[#2a2a2a]">
                          {items.map(a => (
                            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                              <span className="text-xl flex-shrink-0">{a.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{a.title}</p>
                                <p className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{a.date}</p>
                              </div>
                            </div>
                          ))}
                        </Card>
                      </div>
                    )
                  })
              }
            </div>
          )}

          {/* ── CONEXÕES ── */}
          {tab === 'Conexões' && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-neutral-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-3 px-1">
                Conexões ({connections.length})
              </p>
              {connections.length === 0
                ? <EmptyState icon="👥" title="Sem conexões" subtitle="Este utilizador ainda não tem conexões." />
                : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {connections.map(u => {
                      const connType = getConnectionType(profileUser, u)
                      const typeInfo = CONNECTION_TYPE_LABEL[connType]
                      return (
                        <Card key={u.id} className="p-3 sm:p-4 flex items-center gap-3" hover>
                          <button onClick={() => navigate(`/profile/${u.id}`)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                            <UserAvatar name={u.name} size="md" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                                {u.verified && <VerificationBadge university={u.verifiedUniversity} showLabel={false} />}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <UniversityTag university={u.university} size="xs" />
                                <span className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{typeInfo.icon} {typeInfo.label}</span>
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => toggleConnect(u.id)}
                            className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                              isConnected(u.id)
                                ? 'bg-primary-100 dark:bg-white/10 text-primary-600'
                                : 'bg-neutral-100 dark:bg-[#222222] text-neutral-500 dark:text-[#e4e6ea] hover:bg-primary-50 hover:text-primary-600'
                            }`}
                          >
                            {isConnected(u.id) ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          </button>
                        </Card>
                      )
                    })}
                  </div>
              }
            </div>
          )}

        </div>
      </div>

      {statsTab && (
        <UsersListModal
          title={`Conexões · ${profileUser.connections}`}
          users={connections}
          onClose={() => setStatsTab(null)}
        />
      )}
    </div>
  )
}
