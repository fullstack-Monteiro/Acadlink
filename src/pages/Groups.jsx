import { useState } from 'react'
import { Users, Plus, Search, Globe, ChevronLeft, Send, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GROUPS, ALL_USERS } from '../data/mock'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import UniversityTag from '../components/profile/UniversityTag'
import UserAvatar from '../components/ui/UserAvatar'
import PostCard from '../components/feed/PostCard'
import EmptyState from '../components/ui/EmptyState'

// ── Vista de detalhe de um grupo ──────────────────────────────────────────────
function GroupDetail({ group, joined, onToggle, onBack }) {
  const { user } = useAuth()
  const { posts, addPost } = usePosts()
  const [tab, setTab] = useState('posts')
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)

  // posts do grupo (p.ex. groupId) ou fallback por universidade
  const groupPosts = posts.filter(p =>
    p.groupId ? p.groupId === group.id
      : group.university ? p.author.university === group.university
      : true
  )

  const members = ALL_USERS.filter(u =>
    group.university ? u.university === group.university : true
  ).slice(0, 8)

  const admins = ALL_USERS.filter(u => group.adminIds?.includes(u.id))
  const moderators = ALL_USERS.filter(u => group.moderatorIds?.includes(u.id))
  const groupType = group.university ? 'Grupo fechado' : 'Grupo público'
  const groupPostsCount = groupPosts.length

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Cover */}
      <div className="rounded-3xl overflow-hidden mb-4 shadow-xl">
        <div className="relative h-40 sm:h-56 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-400">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{group.name}</h2>
                  <p className="text-sm text-white/80 mt-1">{group.memberCount} membros · {groupType}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onToggle}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    joined
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-white text-primary-600 hover:bg-primary-50'
                  }`}>
                  {joined ? 'Sair do grupo' : 'Participar'}
                </button>
                <button
                  onClick={() => setTab('membros')}
                  className="px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> Membros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-[#b0b3b8] mb-3">Sobre</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">{group.description}</p>
            {group.university && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Globe className="w-4 h-4" />
                <span>{group.university}</span>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-[#b0b3b8] mb-3">Administradores</p>
            <div className="space-y-3">
              {admins.map(admin => (
                <div key={admin.id} className="flex items-center gap-3">
                  <UserAvatar name={admin.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{admin.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] truncate">{admin.course}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-[#b0b3b8] mb-3">Atividade</p>
            <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center justify-between">
                <span>Publicações</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{groupPostsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Membros ativos</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{group.memberCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Moderadores</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{moderators.length}</span>
              </div>
            </div>
          </Card>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#242526] rounded-2xl border border-neutral-100 dark:border-[#2a2a2a] p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">{tab === 'posts' ? 'Publicações' : 'Membros'}</span>
              <span className="text-xs text-neutral-500 dark:text-[#b0b3b8]">{groupType} · {groupPostsCount} publicações</span>
            </div>
            <div className="flex gap-2">
              {['posts', 'membros'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    tab === t ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-600 dark:text-[#e4e6ea] hover:bg-neutral-200 dark:hover:bg-[#2a2a2a]'
                  }`}>
                  {t === 'posts' ? 'Publicações' : 'Membros'}
                </button>
              ))}
            </div>
          </div>

          {tab === 'posts' && (
            <div className="space-y-3">
              {joined && (
                <Card className="p-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <UserAvatar name={user?.name} size="sm" />
                    <textarea
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                      placeholder="Publica no grupo..."
                      className="flex-1 min-h-[96px] bg-neutral-100 dark:bg-[#222222] rounded-2xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all resize-none"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-xs text-neutral-500 dark:text-[#b0b3b8]">A tua publicação será vista pelos membros do grupo.</span>
                    <button
                      onClick={async () => {
                        if (!newPost.trim()) return
                        setPosting(true)
                        await addPost({
                          id: Date.now(),
                          content: newPost.trim(),
                          author: user,
                          category: 'académico',
                          time: 'Agora mesmo',
                          likes_count: 0,
                          comments_count: 0,
                          commentCount: 0,
                          shares: 0,
                          reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
                          myReaction: null,
                          is_liked: false,
                          is_saved: false,
                          saved: false,
                          comments: [],
                          groupId: group.id,
                        })
                        setNewPost('')
                        setPosting(false)
                      }}
                      className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                      disabled={!newPost.trim() || posting}
                    >
                      {posting ? 'A publicar...' : 'Publicar'}
                    </button>
                  </div>
                </Card>
              )}

              {groupPosts.length === 0
                ? <EmptyState icon="📝" title="Sem publicações" subtitle="Sê o primeiro a publicar neste grupo." />
                : groupPosts.map(p => <PostCard key={p.id} post={p} />)
              }
            </div>
          )}

          {tab === 'membros' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map(u => (
                <Card key={u.id} className="p-3 flex items-center gap-3" hover>
                  <UserAvatar name={u.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                    <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] truncate">{u.course}</p>
                  </div>
                  {group.adminIds?.includes(u.id) && (
                    <span className="ml-auto text-xs bg-primary-100 dark:bg-white/10 text-primary-600 px-2 py-0.5 rounded-full flex-shrink-0">Admin</span>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Lista de grupos ────────────────────────────────────────────────────────────
function GroupCard({ group, joined, onToggle, onClick }) {
  return (
    <Card className="p-4 flex items-center gap-3 cursor-pointer" hover onClick={onClick}>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center flex-shrink-0">
        <Users className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{group.name}</p>
          {!group.university && <Lock className="w-3 h-3 text-neutral-400 dark:text-[#b0b3b8] flex-shrink-0" />}
        </div>
        <p className="text-xs text-neutral-500 dark:text-white line-clamp-1 mt-0.5">{group.description}</p>
        <div className="flex items-center gap-2 mt-1">
          {group.university && <UniversityTag university={group.university} size="xs" />}
          <span className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{group.memberCount} membros</span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          joined
            ? 'bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-[#e4e6ea] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {joined ? 'Sair' : 'Entrar'}
      </button>
    </Card>
  )
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function Groups() {
  const [query, setQuery] = useState('')
  const [joined, setJoined] = useState(new Set([1, 4]))
  const [activeGroup, setActiveGroup] = useState(null)

  const filtered = GROUPS.filter(g =>
    !query ||
    g.name.toLowerCase().includes(query.toLowerCase()) ||
    g.description.toLowerCase().includes(query.toLowerCase())
  )

  const myGroups = filtered.filter(g => joined.has(g.id))
  const discover = filtered.filter(g => !joined.has(g.id))

  const toggleJoin = (e, id) => {
    e?.stopPropagation()
    setJoined(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000] pb-24 md:pb-6">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4">

        {activeGroup ? (
          <GroupDetail
            group={activeGroup}
            joined={joined.has(activeGroup.id)}
            onToggle={() => toggleJoin(null, activeGroup.id)}
            onBack={() => setActiveGroup(null)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link 
                  to="/dashboard" 
                  className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
                  aria-label="Voltar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Grupos</h1>
                  <p className="text-sm text-neutral-500 mt-0.5">Comunidades académicas</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Criar
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#b0b3b8] w-4 h-4" />
              <input type="text" placeholder="Pesquisar grupos..." value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            {myGroups.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-neutral-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-2 px-1">Os meus grupos</p>
                <div className="space-y-2">
                  {myGroups.map(g => (
                    <GroupCard key={g.id} group={g} joined onClick={() => setActiveGroup(g)} onToggle={e => toggleJoin(e, g.id)} />
                  ))}
                </div>
              </div>
            )}

            {discover.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-2 px-1">Descobrir</p>
                <div className="space-y-2">
                  {discover.map(g => (
                    <GroupCard key={g.id} group={g} joined={false} onClick={() => setActiveGroup(g)} onToggle={e => toggleJoin(e, g.id)} />
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <EmptyState icon="👥" title="Nenhum grupo encontrado" subtitle="Tenta outro termo ou cria um novo grupo." />
            )}
          </>
        )}
      </div>
    </div>
  )
}
