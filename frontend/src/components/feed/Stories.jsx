import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Plus, X, ChevronLeft, ChevronRight, MoreHorizontal,
  ThumbsUp, Heart, Laugh, Zap, Frown, Flame, Send,
  Trash2, Eye, Download, ImagePlus, Lock,
  VolumeX, Flag, Share2, UserX,
} from 'lucide-react'
import { STORIES } from '../../data/mock'
import UserAvatar from '../ui/UserAvatar'
import { useAuth } from '../../context/AuthContext'
import { stringifyUniversity } from '../../utils/university'

const STORY_DURATION = 5000

// Definição das reacções — alinhada com o sistema de posts
const STORY_REACTIONS = [
  { key: 'like',  Icon: ThumbsUp, label: 'Gosto',  color: '#1877F2', bg: 'bg-[#1877F2]' },
  { key: 'love',  Icon: Heart,    label: 'Adorei',  color: '#F33E58', bg: 'bg-[#F33E58]' },
  { key: 'haha',  Icon: Laugh,    label: 'Haha',    color: '#F7B125', bg: 'bg-[#F7B125]' },
  { key: 'wow',   Icon: Zap,      label: 'Uau',     color: '#F7B125', bg: 'bg-[#c97d10]' },
  { key: 'sad',   Icon: Frown,    label: 'Triste',  color: '#5890FF', bg: 'bg-[#5890FF]' },
  { key: 'angry', Icon: Flame,    label: 'Grr',     color: '#E9710F', bg: 'bg-[#E9710F]' },
]

// ── Opções do menu contextual ─────────────────────────────────────────────────
const OWNER_ACTIONS = [
  { key: 'views',    Icon: Eye,        label: 'Ver quem viu',       danger: false },
  { key: 'save',     Icon: Download,   label: 'Guardar no dispositivo', danger: false },
  { key: 'add',      Icon: ImagePlus,  label: 'Adicionar à história', danger: false },
  { key: 'privacy',  Icon: Lock,       label: 'Editar privacidade',  danger: false },
  { key: 'mute',     Icon: VolumeX,    label: 'Silenciar respostas', danger: false },
  { key: 'delete',   Icon: Trash2,     label: 'Apagar história',     danger: true  },
]

const VIEWER_ACTIONS = [
  { key: 'share',    Icon: Share2,     label: 'Partilhar história',  danger: false },
  { key: 'mute',     Icon: VolumeX,    label: 'Silenciar histórias', danger: false },
  { key: 'report',   Icon: Flag,       label: 'Denunciar',           danger: false },
  { key: 'block',    Icon: UserX,      label: 'Bloquear utilizador', danger: true  },
]

// ── Partícula flutuante ───────────────────────────────────────────────────────
function FloatingParticle({ reaction, onDone }) {
  const r = STORY_REACTIONS.find(x => x.key === reaction)
  if (!r) return null
  const { Icon, color } = r
  const left = 40 + Math.random() * 20
  return (
    <div
      className="pointer-events-none absolute bottom-20 z-50"
      style={{ left: `${left}%`, animation: 'story-float 1.2s ease-out forwards' }}
      onAnimationEnd={onDone}
    >
      <Icon
        className="w-8 h-8 drop-shadow-lg"
        style={{ color, fill: ['love', 'like'].includes(reaction) ? color : 'none' }}
        strokeWidth={2}
      />
    </div>
  )
}

// ── Modal "Quem viu" ──────────────────────────────────────────────────────────
function WhoViewedModal({ onClose }) {
  // dados simulados
  const viewers = [
    { id: 1, name: 'Amina Machava',     time: '2 min atrás' },
    { id: 2, name: 'Samuel Nhantumbo',  time: '15 min atrás' },
    { id: 3, name: 'Fatima Cossa',      time: '1 h atrás' },
    { id: 4, name: 'João Sitoe',        time: '2 h atrás' },
    { id: 5, name: 'Beatrice Mondlane', time: '3 h atrás' },
  ]
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-2xl">
        {/* cabeçalho */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neutral-100 dark:border-[#2c2c2e]">
          <div>
            <p className="font-semibold text-neutral-900 dark:text-white">Quem viu</p>
            <p className="text-xs text-neutral-500 dark:text-[#636366] mt-0.5">{viewers.length} visualizações</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2c2c2e] text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* lista */}
        <ul className="py-2 max-h-72 overflow-y-auto">
          {viewers.map(v => (
            <li key={v.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-[#2c2c2e] transition-colors">
              <UserAvatar name={v.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{v.name}</p>
                <p className="text-xs text-neutral-400 dark:text-[#636366]">{v.time}</p>
              </div>
              <Eye className="w-4 h-4 text-neutral-300 dark:text-[#48484a] flex-shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Toast simples ─────────────────────────────────────────────────────────────
function StoryToast({ message }) {
  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-xl bg-neutral-900/90 text-white text-xs font-medium shadow-lg animate-fade-in pointer-events-none whitespace-nowrap">
      {message}
    </div>
  )
}

// ── StoryViewer ───────────────────────────────────────────────────────────────
function StoryViewer({ stories, startIndex, onClose, onDelete }) {
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [index, setIndex]       = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [reaction, setReaction] = useState(null)
  const [particles, setParticles] = useState([])
  const [message, setMessage]   = useState('')
  const [paused, setPaused]     = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showWhoViewed, setShowWhoViewed] = useState(false)
  const [toast, setToast]       = useState('')

  const intervalRef = useRef(null)
  const pausedRef   = useRef(false)
  const menuRef     = useRef(null)
  const story       = stories[index]
  const isOwner     = user?.id === story?.user?.id
  const menuActions = isOwner ? OWNER_ACTIONS : VIEWER_ACTIONS

  // sync paused ref
  useEffect(() => { pausedRef.current = paused }, [paused])

  // pausar quando menu ou modal estão abertos
  useEffect(() => {
    pausedRef.current = paused || showMenu || showWhoViewed
  }, [paused, showMenu, showWhoViewed])

  // fechar menu ao clicar fora
  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  // toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2000)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    setProgress(0)
    const step = 100 / (STORY_DURATION / 50)
    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return
      setProgress(p => {
        if (p >= 100) { goNext(); return 0 }
        return p + step
      })
    }, 50)
    return () => clearInterval(intervalRef.current)
  }, [index])

  const goNext = () => {
    if (index < stories.length - 1) setIndex(i => i + 1)
    else onClose()
  }
  const goPrev = () => { if (index > 0) setIndex(i => i - 1) }
  const handlePressStart = () => setPaused(true)
  const handlePressEnd   = () => setPaused(false)

  const handleReaction = (type) => {
    setReaction(prev => prev === type ? null : type)
    const id = Date.now() + Math.random()
    setParticles(prev => [...prev, { id, type }])
  }
  const removeParticle = (id) => setParticles(prev => prev.filter(p => p.id !== id))

  const handleMenuAction = (key) => {
    setShowMenu(false)
    switch (key) {
      case 'views':
        setShowWhoViewed(true)
        break
      case 'save':
        setToast('Média guardada no dispositivo')
        break
      case 'add':
        navigate('/create-story')
        break
      case 'privacy':
        setToast('Privacidade actualizada')
        break
      case 'mute':
        setToast(isOwner ? 'Respostas silenciadas' : 'Histórias silenciadas')
        break
      case 'delete':
        onDelete?.(story.id)
        onClose()
        break
      case 'share':
        setToast('Link copiado')
        break
      case 'report':
        setToast('Denúncia enviada')
        break
      case 'block':
        setToast('Utilizador bloqueado')
        break
      default:
        break
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 animate-fade-in">
      <style>{`
        @keyframes story-float {
          0%   { transform: translateY(0)     scale(1);   opacity: 1; }
          60%  { transform: translateY(-90px)  scale(1.3); opacity: 0.9; }
          100% { transform: translateY(-160px) scale(0.7); opacity: 0; }
        }
        @keyframes menu-slide-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .story-menu-enter { animation: menu-slide-in 0.15s ease-out forwards; }
      `}</style>

      <div className="relative w-full h-full overflow-hidden bg-black">

        {/* Background */}
        {story.image
          ? <img src={story.image} alt={story.text} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-brand-500 to-accent-500" />
        }
        <div className="absolute inset-0 bg-black/20" />

        {/* Partículas */}
        {particles.map(p => (
          <FloatingParticle key={p.id} reaction={p.type} onDone={() => removeParticle(p.id)} />
        ))}

        {/* Barras de progresso */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-40">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white rounded-full ${paused ? '' : 'transition-all duration-100'}`}
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Indicador de pausa */}
        {paused && !showMenu && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <div className="flex gap-[3px] items-center">
                <span className="w-[3px] h-3.5 bg-white rounded-full" />
                <span className="w-[3px] h-3.5 bg-white rounded-full" />
              </div>
              <span className="text-white text-xs font-medium">Em pausa</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="absolute top-4 left-3 right-3 z-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/profile/${story.user.id}`)}
            className="flex items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-white/10"
          >
            <UserAvatar name={story.user.name} size="sm" />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{story.user.name}</p>
              {isOwner && (
                <p className="text-white/60 text-[11px]">A tua história</p>
              )}
            </div>
          </button>

          <div className="flex items-center gap-1" ref={menuRef}>
            {/* Botão três pontinhos */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(o => !o)}
                className={`p-2 rounded-full transition-colors text-white ${showMenu ? 'bg-white/20' : 'hover:bg-white/10'}`}
                aria-label="Mais opções"
                aria-expanded={showMenu}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* Menu dropdown */}
              {showMenu && (
                <div className="story-menu-enter absolute right-0 top-11 w-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#1c1c1e]/95 backdrop-blur-xl z-50">
                  {/* Cabeçalho do menu */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                      {isOwner ? 'A tua história' : story.user.name}
                    </p>
                  </div>

                  {/* Itens */}
                  <div className="py-1">
                    {menuActions.map(({ key, Icon, label, danger }) => (
                      <button
                        key={key}
                        onClick={() => handleMenuAction(key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left
                          ${danger
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-white/90 hover:bg-white/10'
                          }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fechar */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4">
          {/* Reacções */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {STORY_REACTIONS.map(({ key, Icon, label, color, bg }) => {
              const isActive = reaction === key
              return (
                <button
                  key={key}
                  onClick={() => handleReaction(key)}
                  title={label}
                  className={`
                    relative flex flex-col items-center gap-1 group
                    p-2.5 rounded-full transition-all duration-200 active:scale-90
                    ${isActive ? `${bg} shadow-lg scale-110` : 'bg-white/10 hover:bg-white/20 hover:scale-110'}
                  `}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: isActive ? '#ffffff' : color,
                      fill: isActive && ['love', 'like'].includes(key) ? '#ffffff'
                           : !isActive && key === 'love' ? color
                           : 'none',
                    }}
                    strokeWidth={2}
                  />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Input mensagem */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center bg-white/12 backdrop-blur rounded-full px-3 py-2 sm:px-4 sm:py-2.5 transition-colors focus-within:bg-white/20">
                <input
                  type="text"
                  placeholder="Enviar mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent text-white text-sm placeholder-white/60 outline-none min-w-0"
                />
                {message && (
                  <button
                    onClick={() => setMessage('')}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zonas de navegação + pausa */}
        <button
          onClick={goPrev}
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          onPointerCancel={handlePressEnd}
          className="absolute left-0 top-0 w-1/4 h-full z-30 select-none"
        />
        <div
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          onPointerCancel={handlePressEnd}
          className="absolute left-1/4 top-0 w-1/2 h-full z-30 select-none cursor-pointer"
        />
        <button
          onClick={goNext}
          onPointerDown={handlePressStart}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          onPointerCancel={handlePressEnd}
          className="absolute right-0 top-0 w-1/4 h-full z-30 select-none"
        />

        {index > 0 && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-white/60" />
          </div>
        )}
        {index < stories.length - 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <ChevronRight className="w-6 h-6 text-white/60" />
          </div>
        )}
      </div>

      {/* Modal quem viu */}
      {showWhoViewed && <WhoViewedModal onClose={() => setShowWhoViewed(false)} />}

      {/* Toast */}
      {toast && <StoryToast message={toast} />}
    </div>
  )
}

export default function Stories() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stories, setStories] = useState(STORIES)
  const [viewerData, setViewerData] = useState(null)

  const openStory = (idx) => {
    const selected = stories[idx]
    setStories(s => s.map((st, i) => i === idx ? { ...st, seen: true } : st))
    const group = stories.filter(st => st.user.id === selected.user.id)
    const startIndex = group.findIndex(st => st.id === selected.id)
    setViewerData({ group, startIndex })
  }

  const handleDelete = (storyId) => {
    setStories(s => s.filter(st => st.id !== storyId))
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1 py-1">

        {/* Criar publicação */}
        <Link
          to="/create-story"
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
        >
          <div className="relative w-[62px] h-[62px]">
            {/* Avatar do user */}
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-neutral-200 dark:border-[#1e2d4a]">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(user?.name || 'perfil')}&size=128`}
                alt={user?.name || 'Perfil'}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Botão + */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0e1629]"
              style={{ background: 'linear-gradient(135deg, #1D6AFF, #00A3FF)' }}
            >
              <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[11px] text-center text-neutral-700 dark:text-neutral-300 w-16 truncate font-medium">
            Criar
          </span>
        </Link>

        {/* Stories */}
        {stories.map((story, idx) => {
          const hasSeen = story.seen
          return (
            <button
              key={story.id}
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              {/* Anel colorido ou cinzento */}
              <div
                className="w-[62px] h-[62px] rounded-full p-[2.5px]"
                style={{
                  background: hasSeen
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, #1D6AFF, #00A3FF)',
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-[#0e1629]">
                  {story.image ? (
                    <img src={story.image} alt={story.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-900 via-brand-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white text-xl">{story.emoji}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-center text-neutral-700 dark:text-neutral-300 w-16 truncate font-medium">
                {story.user.name.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {viewerData !== null && (
        <StoryViewer
          stories={viewerData.group}
          startIndex={viewerData.startIndex}
          onClose={() => setViewerData(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}


