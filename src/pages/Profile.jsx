import { useState } from 'react'
import { MapPin, GraduationCap, Edit3, MessageCircle, Camera, ExternalLink, UserPlus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import { ALL_USERS, ACHIEVEMENTS } from '../data/mock'
import Navbar from '../components/layout/Navbar'
import UserAvatar from '../components/ui/UserAvatar'
import PostCard from '../components/feed/PostCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import UniversityTag from '../components/profile/UniversityTag'
import VerificationBadge from '../components/profile/VerificationBadge'
import PortfolioModal from '../components/profile/PortfolioModal'
import UsersListModal from '../components/profile/UsersListModal'
import { Link, useNavigate } from 'react-router-dom'

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

// Sugestões inteligentes: mesmo curso diferente universidade, ou conexões em comum
function getSmartSuggestions(me, connections) {
  const connIds = new Set(connections.map(c => c.id))
  return ALL_USERS.filter(u => u.id !== me?.id && !connIds.has(u.id)).map(u => {
    const reasons = []
    if (u.course === me?.course && u.university !== me?.university) reasons.push('Mesmo curso, outra universidade')
    const mutual = connections.filter(c => c.university === u.university).length
    if (mutual > 0) reasons.push(`${mutual} conexão${mutual > 1 ? 'ões' : ''} em comum`)
    return { ...u, reasons }
  }).filter(u => u.reasons.length > 0).slice(0, 4)
}

export default function Profile() {
  const { user, toggleConnect, isConnected, portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useAuth()
  const { posts, toggleSave } = usePosts()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Posts')
  const [portfolioModal, setPortfolioModal] = useState(null)
  const [statsTab, setStatsTab] = useState(null) // null | 'followers' | 'following'

  // Posts do utilizador autenticado
  const userPosts = posts.filter(p => p.author.id === user?.id)
  const connections = ALL_USERS.filter(u => u.id !== user?.id).slice(0, 6)
  const suggestions = getSmartSuggestions(user, connections)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000] pb-24 md:pb-6">
      <Navbar />

      {/* Cover */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-500">
        <input id="cape-upload" type="file" accept="image/*" className="hidden" onChange={() => {}} />
        <button onClick={() => document.getElementById('cape-upload')?.click()} className="absolute bottom-2 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-black/30 hover:bg-black/50 text-white text-xs rounded-xl transition-colors">
          <Camera className="w-3 h-3" /> Editar capa
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-2 sm:px-4 w-full">
        {/* Header */}
        <div className="relative -mt-8 sm:-mt-14 mb-4">
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className="ring-4 ring-white dark:ring-[#0d0d0d] rounded-full">
                <UserAvatar name={user?.name} size="xl" />
              </div>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={() => {}} />
              <button onClick={() => document.getElementById('avatar-upload')?.click()} className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="pb-2">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#222222] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Editar perfil</span>
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">{user?.name}</h1>
              <span className="text-sm text-neutral-400">@{user?.username}</span>
              {user?.verified && (
                <VerificationBadge university={user.verifiedUniversity} showLabel={true} size="sm" />
              )}
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 line-clamp-2">{user?.bio}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                <UniversityTag university={user?.university} size="sm" />
                <span className="truncate">{user?.course} · {user?.year}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary-500 flex-shrink-0" />
                Maputo, Moçambique
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 mt-4 pt-4 border-t border-neutral-100 dark:border-[#2a2a2a]">
            {[
              { key: 'posts',       label: 'Posts',     value: userPosts.length || user?.posts },
              { key: 'connections', label: 'Conexões',  value: user?.connections ?? 0 },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => s.key === 'connections' && setStatsTab('connections')}
                className={`text-left group transition-colors ${s.key === 'connections' ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className={`font-bold text-neutral-900 dark:text-white ${s.key === 'connections' ? 'group-hover:text-primary-600' : ''} transition-colors`}>{s.value}</span>
                <span className={`text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm ml-1 ${s.key === 'connections' ? 'group-hover:text-primary-600' : ''} transition-colors`}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs — scroll horizontal */}
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
            <div className="space-y-3">
              {userPosts.map(p => <PostCard key={p.id} post={p} onSaveToggle={toggleSave} />)}
            </div>
          )}

          {/* ── PORTFÓLIO ── */}
          {tab === 'Portfólio' && (
            <div className="space-y-3">
              {portfolio.length === 0 && (
                <p className="text-sm text-neutral-400 text-center py-6">Ainda não adicionaste nada ao teu portfólio.</p>
              )}
              {portfolio.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-white/10 text-primary-600 font-medium capitalize">
                          {item.type}
                        </span>
                        <span className="text-xs text-neutral-400">{item.year}</span>
                      </div>
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                      {item.description ? (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{item.description}</p>
                      ) : null}
                      {item.links?.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {item.links.map(l => (
                            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
                              <ExternalLink className="w-3 h-3" /> {l.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setPortfolioModal(item)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 hover:text-primary-600 transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePortfolioItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 transition-colors"
                        aria-label="Apagar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
              <button
                onClick={() => setPortfolioModal('new')}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-[#2a2a2a] text-sm text-neutral-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + Adicionar projecto ou publicação
              </button>
            </div>
          )}

          {/* ── CONQUISTAS ── */}
          {tab === 'Conquistas' && (
            <div className="space-y-3">
              {['prémio', 'certificado', 'reconhecimento'].map(type => {
                const items = ACHIEVEMENTS.filter(a => a.type === type)
                if (!items.length) return null
                const labels = { prémio: '🏆 Prémios', certificado: '📜 Certificados', reconhecimento: '🎖️ Reconhecimentos' }
                return (
                  <div key={type}>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-1">{labels[type]}</p>
                    <Card className="overflow-hidden divide-y divide-neutral-100 dark:divide-[#2a2a2a]">
                      {items.map(a => (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                          <span className="text-xl flex-shrink-0">{a.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{a.title}</p>
                            <p className="text-xs text-neutral-400">{a.date}</p>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </div>
                )
              })}
              <button
                onClick={() => navigate('/create-post')}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-[#2a2a2a] text-sm text-neutral-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + Adicionar conquista
              </button>
            </div>
          )}

          {/* ── CONEXÕES ── */}
          {tab === 'Conexões' && (
            <div className="space-y-5">
              {/* Conexões actuais */}
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                  As tuas conexões ({connections.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {connections.map(u => {
                    const connType = getConnectionType(user, u)
                    const typeInfo = CONNECTION_TYPE_LABEL[connType]
                    return (
                      <Card key={u.id} className="p-3 sm:p-4 flex items-center gap-3" hover>
                        <UserAvatar name={u.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                            {u.verified && <VerificationBadge university={u.verifiedUniversity} showLabel={false} />}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <UniversityTag university={u.university} size="xs" />
                            <span className="text-xs text-neutral-400">{typeInfo.icon} {typeInfo.label}</span>
                            <span className="text-xs text-neutral-300 dark:text-neutral-600">·</span>
                            <span className="text-xs text-neutral-400">{typeInfo.degree}º grau</span>
                          </div>
                        </div>
                        <Link to="/messages">
                          <button className="p-2 rounded-xl bg-neutral-100 dark:bg-[#222222] text-neutral-500 dark:text-[#e4e6ea] hover:bg-primary-50 hover:text-primary-600 transition-colors flex-shrink-0">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </Link>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Sugestões inteligentes */}
              {suggestions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                    Sugestões para ti
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestions.map(u => (
                      <Card key={u.id} className="p-3 sm:p-4 flex items-center gap-3" hover>
                        <UserAvatar name={u.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                            {u.verified && <VerificationBadge university={u.verifiedUniversity} showLabel={false} />}
                          </div>
                          <UniversityTag university={u.university} size="xs" />
                          {u.reasons.map(r => (
                            <p key={r} className="text-xs text-neutral-400 mt-0.5">{r}</p>
                          ))}
                        </div>
                        <button
                          onClick={() => toggleConnect(u.id)}
                          className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                            isConnected(u.id)
                              ? 'bg-primary-100 dark:bg-white/10 text-primary-600'
                              : 'bg-neutral-100 dark:bg-[#222222] text-neutral-500 dark:text-[#e4e6ea] hover:bg-primary-50 hover:text-primary-600'
                          }`}>
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {statsTab && (
        <UsersListModal
          title={`Conexões · ${user?.connections ?? 0}`}
          users={ALL_USERS.filter(u => u.id !== user?.id).slice(0, 6)}
          onClose={() => setStatsTab(null)}
        />
      )}

      {portfolioModal && (
        <PortfolioModal
          item={portfolioModal === 'new' ? null : portfolioModal}
          onSave={(data) => {
            if (portfolioModal === 'new') addPortfolioItem(data)
            else updatePortfolioItem(portfolioModal.id, data)
          }}
          onClose={() => setPortfolioModal(null)}
        />
      )}
    </div>
  )
}
