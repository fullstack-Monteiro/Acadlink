import { useState, useEffect } from 'react'
import { Search, UserPlus, UserCheck, TrendingUp, X, ChevronLeft } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ALL_USERS, HASHTAGS, UNIVERSITIES } from '../data/mock'
import { usePosts } from '../context/PostsContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import UserAvatar from '../components/ui/UserAvatar'
import PostCard from '../components/feed/PostCard'
import Card from '../components/ui/Card'
import UniversityTag from '../components/profile/UniversityTag'
import VerificationBadge from '../components/profile/VerificationBadge'
import EmptyState from '../components/ui/EmptyState'
import { filterByUniversity } from '../utils/university'

const TABS = ['Pessoas', 'Posts', 'Hashtags']
const UNI_FILTERS = ['Todas', ...UNIVERSITIES]

export default function Explore() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState('Pessoas')
  const [query, setQuery] = useState('')
  const [uniFilter, setUniFilter] = useState('Todas')
  const { posts } = usePosts()
  const { toggleConnect, isConnected } = useAuth()

  // Ler query param ao montar
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      // se começa com #, vai para tab Hashtags; senão Posts
      if (q.startsWith('#')) setTab('Hashtags')
      else setTab('Posts')
    }
  }, [])

  const filteredUsers = filterByUniversity(ALL_USERS, uniFilter === 'Todas' ? null : uniFilter).filter(u => {
    return !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.course.toLowerCase().includes(query.toLowerCase())
  })

  const filteredPosts = posts.filter(p =>
    !query || p.content.toLowerCase().includes(query.toLowerCase()) || p.author.name.toLowerCase().includes(query.toLowerCase())
  )
  const filteredHashtags = HASHTAGS.filter(h =>
    !query || h.tag.toLowerCase().includes(query.toLowerCase())
  )
  const resultsCount = tab === 'Pessoas' ? filteredUsers.length : tab === 'Posts' ? filteredPosts.length : filteredHashtags.length

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white -ml-2">Explorar</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#b0b3b8] w-4 h-4" />
          <input type="text" placeholder="Pesquisar pessoas, posts, hashtags..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={query} onChange={e => setQuery(e.target.value)} />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              aria-label="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-[#242526] rounded-2xl border border-neutral-100 dark:border-[#3a3b3c] p-1 mb-4">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-primary-600 text-white' : 'text-neutral-500 dark:text-[#e4e6ea] hover:bg-neutral-100 dark:hover:bg-[#2a2a2a]'}`}>
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mb-3">
          {resultsCount} resultado{resultsCount !== 1 ? 's' : ''} em {tab.toLowerCase()}
        </p>

        {/* Pessoas */}
        {tab === 'Pessoas' && (
          <>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
              {UNI_FILTERS.map(u => (
                <button key={u} onClick={() => setUniFilter(u)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${uniFilter === u ? 'bg-primary-600 text-white' : 'bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400'}`}>
                  {u === 'Todas' ? 'Todas' : u.split(' — ')[0]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredUsers.map(u => (
                <Card key={u.id} className="p-3 sm:p-4 flex items-center gap-3" hover>
                  <UserAvatar name={u.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                      {u.verified && <VerificationBadge university={u.verifiedUniversity} showLabel={false} />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <UniversityTag university={u.university} size="xs" />
                      <p className="text-xs text-neutral-400 truncate">{u.course}</p>
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-neutral-500">
                      <span>{u.connections} conexões</span>
                      <span>{u.posts} posts</span>
                    </div>
                  </div>
                  <button onClick={() => toggleConnect(u.id)}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${isConnected(u.id) ? 'bg-primary-100 dark:bg-white/10 text-primary-600' : 'bg-neutral-100 dark:bg-[#222222] text-neutral-600 dark:text-neutral-400'}`}>
                    {isConnected(u.id)
                      ? <><UserCheck className="w-3.5 h-3.5" /><span className="hidden sm:inline"> Conectado</span></>
                      : <><UserPlus className="w-3.5 h-3.5" /><span className="hidden sm:inline"> Conectar</span></>}
                  </button>
                </Card>
              ))}
            </div>
            {filteredUsers.length === 0 && (
              <EmptyState
                icon="🧭"
                title="Nenhum estudante encontrado"
                subtitle="Tenta outro nome, curso ou universidade para descobrir novas ligações."
              />
            )}
          </>
        )}

        {/* Posts */}
        {tab === 'Posts' && (
          <div className="space-y-3">
            {filteredPosts.length === 0
              ? <EmptyState icon="📝" title="Nenhum post encontrado" subtitle="Tenta outra palavra-chave ou explora a aba de pessoas." />
              : filteredPosts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}

        {/* Hashtags */}
        {tab === 'Hashtags' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredHashtags.length === 0
              ? <EmptyState icon="#️⃣" title="Sem hashtags em alta" subtitle="Ainda nao ha topicos suficientes nesta comunidade." />
              : filteredHashtags.map((h, i) => (
              <Card key={h.tag} className="p-3 sm:p-4 flex items-center gap-3 cursor-pointer" hover>
                <div className="w-10 h-10 bg-primary-100 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{h.tag}</p>
                  <p className="text-xs text-neutral-500">{h.count} posts</p>
                </div>
                <span className="text-xs text-neutral-400 flex-shrink-0">#{i + 1}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
