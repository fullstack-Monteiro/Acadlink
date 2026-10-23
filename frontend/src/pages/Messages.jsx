import { useState, useEffect, useRef } from 'react'
import {
  Send, ChevronLeft, Search, Phone, Video, Users, Plus,
  Image, Smile, ThumbsUp, Info, Reply, Pin, Trash2, X, Settings,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMessages } from '../context/MessagesContext'
import UserAvatar from '../components/ui/UserAvatar'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import CallScreen from '../components/calls/CallScreen'
import clsx from 'clsx'
import Skeleton, { SkeletonGroup } from '../components/ui/Skeleton'

// ─── helpers ──────────────────────────────────────────────────────────────────

const statusColor = {
  online: 'bg-green-500',
  away: 'bg-yellow-400',
  offline: 'bg-neutral-400',
}

const MESSAGE_FILTERS = [
  { key: 'all',      label: 'Todas'     },
  { key: 'unread',   label: 'Não lidas' },
  { key: 'groups',   label: 'Grupos'    },
]

const MESSAGE_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡']

function getStatusText(u) {
  if (!u) return ''
  if (u.status === 'online') return 'Online'
  if (!u.lastSeen) return 'Offline'
  const diff  = Date.now() - u.lastSeen
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'visto agora mesmo'
  if (mins  < 60) return `visto há ${mins} min`
  if (hours < 24) return `visto às ${new Date(u.lastSeen).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}`
  if (days === 1) return `visto ontem às ${new Date(u.lastSeen).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}`
  return `visto em ${new Date(u.lastSeen).toLocaleDateString('pt', { day: '2-digit', month: 'short' })}`
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in pointer-events-none">
      {msg}
    </div>
  )
}

// ─── ConvItem ─────────────────────────────────────────────────────────────────

function ConvItem({ conv, isActive, onClick }) {
  const name   = conv.isGroup ? conv.name : conv.user?.name ?? '?'
  const status = conv.isGroup ? null : conv.user?.status

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 transition-colors text-left',
        isActive ? 'bg-neutral-100 dark:bg-[#2a2a2a]' : 'hover:bg-neutral-50 dark:hover:bg-[#252525]'
      )}
    >
      {/* avatar */}
      <div className="relative flex-shrink-0">
        {conv.isChannel ? (
          <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl">🎓</div>
        ) : conv.isGroup ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        ) : (
          <UserAvatar name={name} size="md" />
        )}
        {status && (
          <span className={clsx('absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e1e1e]', statusColor[status] ?? 'bg-neutral-400')} />
        )}
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={clsx('text-sm truncate', conv.unread > 0 ? 'font-bold text-neutral-900 dark:text-white' : 'font-semibold text-neutral-700 dark:text-neutral-200')}>
            {name}
          </p>
          <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">{conv.time}</span>
        </div>
        <p className={clsx('text-xs truncate', conv.unread > 0 ? 'font-semibold text-neutral-700 dark:text-neutral-300' : 'text-neutral-500 dark:text-neutral-400')}>
          {conv.lastMessage}
        </p>
      </div>

      {/* badge */}
      {conv.unread > 0 && (
        <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-primary-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold">
          {conv.unread}
        </span>
      )}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function Messages() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { convs, isReady, error, sendMessage, markRead, deleteMessage, addBotReply } = useMessages()
  const [searchParams] = useSearchParams()

  /* ── ui state ── */
  const [active,          setActive]          = useState(null)
  const [mobileView,      setMobileView]      = useState('list')   // 'list' | 'chat'
  const [searchQ,         setSearchQ]         = useState('')
  const [searchFocused,   setSearchFocused]   = useState(false)
  const [msgFilter,       setMsgFilter]       = useState('all')

  /* ── chat state ── */
  const [input,           setInput]           = useState('')
  const [chatSearch,      setChatSearch]      = useState('')
  const [showChatSearch,  setShowChatSearch]  = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showTyping,      setShowTyping]      = useState(false)
  const [replyTo,         setReplyTo]         = useState(null)
  const [contextMenu,     setContextMenu]     = useState(null)
  const [likedMsgs,       setLikedMsgs]       = useState([])
  const [pinnedMsgs,      setPinnedMsgs]      = useState([])
  const [attachments,     setAttachments]     = useState([])
  const [toast,           setToast]           = useState(null)
  const [showInfoPanel,   setShowInfoPanel]   = useState(false)
  const [mutedConvs,      setMutedConvs]      = useState([])
  const [callActive,      setCallActive]      = useState(false)
  const [callType,        setCallType]        = useState(null)
  const [incomingCall,    setIncomingCall]    = useState(false)

  const imageInputRef  = useRef(null)
  const messagesEndRef = useRef(null)

  const safeConvs  = Array.isArray(convs) ? convs : []
  const activeConv = safeConvs.find(c => c.id === active)

  /* ── effects ── */
  useEffect(() => {
    if (!isReady || safeConvs.length === 0) return
    const p = searchParams.get('conv')
    if (p) {
      const c = safeConvs.find(c => String(c.id) === String(p))
      if (c) openConv(c.id)
    }
  }, [isReady, safeConvs.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages?.length, showTyping])

  useEffect(() => {
    const close = () => setContextMenu(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  /* ── actions ── */
  const showToast = (msg) => setToast(msg)

  const openConv = (id) => {
    setActive(id); setMobileView('chat')
    setShowChatSearch(false); setChatSearch('')
    markRead(id)
  }

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || !active) return
    const text = input.trim() || `📎 ${attachments.map(f => f.name).join(', ')}`
    setInput(''); setAttachments([])
    sendMessage(active, user.id, user.name, text, replyTo ? { id: replyTo.id, text: replyTo.text, fromName: replyTo.fromName || 'Tu' } : null)
    setReplyTo(null); setShowTyping(true)
    setTimeout(() => { setShowTyping(false); addBotReply(active, '❤️') }, 2200)
  }

  const toggleLike = (id) => setLikedMsgs(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id])
  const togglePin  = (id) => setPinnedMsgs(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id])
  const openCtx    = (e, msg) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ msgId: msg.id, msg }) }
  
  const startCall = (type) => {
    if (!activeConv?.user) return
    setCallType(type)
    setCallActive(true)
    setIncomingCall(false)
  }
  
  const simulateIncomingCall = (type) => {
    if (!activeConv?.user) return
    setCallType(type)
    setIncomingCall(true)
    setCallActive(true)
  }

  const toggleMute = () => {
    if (!activeConv) return
    const muted = mutedConvs.includes(activeConv.id)
    setMutedConvs(muted ? mutedConvs.filter(id => id !== activeConv.id) : [...mutedConvs, activeConv.id])
    showToast(muted ? 'Notificações ativadas' : 'Conversa silenciada')
  }

  const clearConv = async () => {
    if (!activeConv?.messages?.length) return showToast('Conversa já vazia')
    await Promise.all(activeConv.messages.map(m => deleteMessage(activeConv.id, m.id)))
    showToast('Conversa limpa')
  }

  /* ── derived ── */
  const filteredConvs = safeConvs.filter(c => {
    const name = c.isGroup ? c.name : c.user?.name ?? ''
    const q    = searchQ.toLowerCase()
    const matchSearch = !q || name.toLowerCase().includes(q) || (c.lastMessage || '').toLowerCase().includes(q)
    const matchFilter = msgFilter === 'all'
      || (msgFilter === 'unread' && c.unread > 0)
      || (msgFilter === 'groups' && c.isGroup)
    return matchSearch && matchFilter
  })

  const filteredMessages = activeConv?.messages?.filter(m =>
    !chatSearch || String(m?.text || '').toLowerCase().includes(chatSearch.toLowerCase())
  ) ?? []

  const pinnedList = activeConv?.messages?.filter(m => pinnedMsgs.includes(m.id)) ?? []

  /* ── MessageBubble ── */
  const MessageBubble = ({ msg, idx }) => {
    const isMe       = msg.from === user.id
    const prevMsg    = filteredMessages[idx - 1]
    const nextMsg    = filteredMessages[idx + 1]
    const samePrev   = prevMsg?.from === msg.from
    const sameNext   = nextMsg?.from === msg.from
    const isLiked    = likedMsgs.includes(msg.id)
    const isPinned   = pinnedMsgs.includes(msg.id)
    const isHit      = chatSearch && msg.text?.toLowerCase().includes(chatSearch.toLowerCase())
    const startX     = useRef(0)
    const dragging   = useRef(false)
    const [tx, setTx] = useState(0)

    return (
      <div className={clsx('flex items-end gap-2 group', isMe ? 'justify-end' : 'justify-start', samePrev ? 'mt-0.5' : 'mt-3')}>
        {!isMe && (
          <div className="w-7 flex-shrink-0 self-end mb-1">
            {!sameNext && <UserAvatar name={activeConv.isGroup ? (msg.fromName || '?') : activeConv.user?.name} size="xs" />}
          </div>
        )}
        <div className={clsx('flex flex-col max-w-[70%]', isMe ? 'items-end' : 'items-start')}>
          {!isMe && activeConv.isGroup && !samePrev && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 ml-1">{msg.fromName}</span>
          )}
          {msg.replyTo && (
            <div className="text-xs px-3 py-1.5 rounded-xl mb-1 border-l-2 border-primary-400 bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-500 max-w-full truncate">
              <span className="font-medium text-primary-600">{msg.replyTo.fromName}</span>: {msg.replyTo.text}
            </div>
          )}
          <div
            className="relative group/bubble"
            onContextMenu={e => openCtx(e, msg)}
            onPointerDown={e => { startX.current = e.clientX; dragging.current = true; e.target.setPointerCapture?.(e.pointerId) }}
            onPointerMove={e => { if (!dragging.current) return; const dx = e.clientX - startX.current; setTx(dx > 0 ? Math.min(dx, 120) : 0) }}
            onPointerUp={e => {
              dragging.current = false
              if (tx > 80) { setReplyTo({ id: msg.id, text: msg.text, fromName: msg.fromName || (isMe ? 'Tu' : activeConv.user?.name) }); showToast('A responder…') }
              setTx(0); e.target.releasePointerCapture?.(e.pointerId)
            }}
            onPointerCancel={() => { dragging.current = false; setTx(0) }}
          >
            <div
              className={clsx(
                'px-4 py-2.5 text-sm leading-relaxed break-words cursor-pointer select-none',
                isMe ? 'bg-primary-600 text-white' : 'bg-white dark:bg-[#1e1e1e] text-neutral-900 dark:text-[#f5f5f7]',
                isHit    && 'ring-2 ring-amber-400',
                isPinned && 'ring-1 ring-amber-300',
                isMe
                  ? ['rounded-3xl', sameNext ? 'rounded-br-lg' : 'rounded-br-3xl', samePrev ? 'rounded-tr-lg' : 'rounded-tr-3xl']
                  : ['rounded-3xl', sameNext ? 'rounded-bl-lg' : 'rounded-bl-3xl', samePrev ? 'rounded-tl-lg' : 'rounded-tl-3xl']
              )}
              style={{ transform: `translateX(${tx}px)`, transition: dragging.current ? 'none' : 'transform 180ms ease' }}
            >
              {msg.text}
            </div>
            {/* hover quick actions */}
            <div className={clsx('absolute top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity', isMe ? '-left-20' : '-right-20')}>
              <button onClick={() => setReplyTo(msg)} className="p-1.5 rounded-full bg-white dark:bg-[#333] shadow text-neutral-500 hover:text-primary-600"><Reply className="w-3.5 h-3.5" /></button>
              <button onClick={() => toggleLike(msg.id)} className={`p-1.5 rounded-full shadow transition-all ${isLiked ? 'bg-[#1877F2]' : 'bg-white dark:bg-[#333] text-neutral-500 hover:bg-[#1877F2] hover:text-white'}`}><ThumbsUp className={clsx('w-3.5 h-3.5', isLiked ? 'fill-white text-white' : '')} strokeWidth={isLiked ? 0 : 2} /></button>
            </div>
          </div>
          {!sameNext && <span className="text-xs text-neutral-400 mt-1 px-1">{msg.time}</span>}
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════
     CONVERSATION LIST PANEL
  ══════════════════════════════════════════════════════════ */
  const ListPanel = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e]">
      {/* header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-600 dark:text-[#aeaeb2] transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Mensagens</h2>
          </div>
          <div className="flex gap-1">
            <button onClick={() => navigate('/settings')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-500 dark:text-neutral-400 transition-colors"><Settings className="w-4.5 h-4.5" /></button>
            <button onClick={() => navigate('/explore')}  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-500 dark:text-neutral-400 transition-colors"><Plus className="w-4.5 h-4.5" /></button>
          </div>
        </div>

        {/* search */}
        <div className={clsx('flex items-center gap-2 bg-neutral-100 dark:bg-[#2a2a2a] rounded-2xl px-4 py-2.5 mb-3', searchFocused && 'ring-2 ring-primary-500')}>
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar mensagens"
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQ && <button onClick={() => setSearchQ('')}><X className="w-4 h-4 text-neutral-400" /></button>}
        </div>

        {/* filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
          {MESSAGE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setMsgFilter(f.key)}
              className={clsx(
                'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors',
                msgFilter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#333]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto">
        {!isReady ? (
          <SkeletonGroup className="px-4 py-3 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton circle className="w-12 h-12 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded-full" />
                  <Skeleton className="h-3 w-44 rounded-full" />
                </div>
                {i % 3 === 0 && <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />}
              </div>
            ))}
          </SkeletonGroup>
        ) : error ? (
          <ErrorState title="Erro" subtitle={error} onRetry={() => window.location.reload()} scope="messages.list" />
        ) : filteredConvs.length === 0 ? (
          <EmptyState icon="💬" title="Sem conversas" subtitle="Inicia uma nova conversa." />
        ) : (
          filteredConvs.map(conv => (
            <ConvItem key={conv.id} conv={conv} isActive={active === conv.id} onClick={() => openConv(conv.id)} />
          ))
        )}
      </div>
    </div>
  )

  /* ══════════════════════════════════════════════════════════
     CHAT PANEL
  ══════════════════════════════════════════════════════════ */
  const ChatPanel = ({ onBack }) => (
    <div className="flex-1 flex overflow-hidden">
      {/* main chat */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5] dark:bg-[#141414] min-w-0 overflow-hidden">
        {!isReady ? (
          <SkeletonGroup className="flex-1 p-6 space-y-4">
            {/* Header fake */}
            <div className="flex items-center gap-3 mb-2">
              <Skeleton circle className="w-10 h-10" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            </div>
            {/* Mensagens recebidas */}
            <div className="flex items-end gap-2">
              <Skeleton circle className="w-7 h-7 flex-shrink-0" />
              <Skeleton className="h-14 w-56 rounded-3xl rounded-bl-lg" />
            </div>
            <div className="flex items-end gap-2">
              <Skeleton circle className="w-7 h-7 flex-shrink-0" />
              <Skeleton className="h-10 w-40 rounded-3xl rounded-bl-lg" />
            </div>
            {/* Mensagens enviadas */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-48 rounded-3xl rounded-br-lg" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-14 w-64 rounded-3xl rounded-br-lg" />
            </div>
            <div className="flex items-end gap-2">
              <Skeleton circle className="w-7 h-7 flex-shrink-0" />
              <Skeleton className="h-10 w-52 rounded-3xl rounded-bl-lg" />
            </div>
          </SkeletonGroup>
        ) : error ? (
          <ErrorState title="Erro" subtitle={error} onRetry={() => window.location.reload()} scope="messages.chat" />
        ) : activeConv ? (
          <>
            {/* chat header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1e1e1e] border-b border-neutral-100 dark:border-[#282828]">
              <button onClick={onBack} className="p-2 -ml-1 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative flex-shrink-0">
                {activeConv.isChannel ? (
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl">🎓</div>
                ) : activeConv.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
                ) : (
                  <Link to={`/profile/${activeConv.user.id}`}><UserAvatar name={activeConv.user.name} size="md" /></Link>
                )}
                {!activeConv.isGroup && !activeConv.isChannel && (
                  <span className={clsx('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1e1e]', statusColor[activeConv.user.status] ?? 'bg-neutral-400')} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {activeConv.isGroup || activeConv.isChannel ? (
                  <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">{activeConv.name}</p>
                ) : (
                  <Link to={`/profile/${activeConv.user.id}`} className="font-bold text-sm text-neutral-900 dark:text-white truncate hover:text-primary-600 transition-colors block">
                    {activeConv.user.name}
                  </Link>
                )}
                <p className={clsx('text-xs font-medium', !activeConv.isGroup && !activeConv.isChannel && activeConv.user?.status === 'online' ? 'text-green-500' : 'text-neutral-400')}>
                  {activeConv.isGroup || activeConv.isChannel ? `${activeConv.members} membros` : getStatusText(activeConv.user)}
                </p>
              </div>

              <div className="flex items-center gap-0.5 flex-shrink-0">
                {!activeConv.isGroup && !activeConv.isChannel && (
                  <>
                    <button 
                      onClick={() => startCall('voice')} 
                      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"
                      title="Chamada de voz"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => startCall('video')} 
                      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"
                      title="Videochamada"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button onClick={() => setShowChatSearch(s => !s)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"><Search className="w-4 h-4" /></button>
                <button onClick={() => setShowInfoPanel(s => !s)} className="hidden md:flex p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"><Info className="w-4 h-4" /></button>
              </div>
            </div>

            {/* in-chat search */}
            {showChatSearch && (
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-neutral-100 dark:border-[#2a2a2a] animate-slide-up">
                <Search className="w-4 h-4 text-neutral-400" />
                <input autoFocus type="text" placeholder="Pesquisar nesta conversa…"
                  className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                  value={chatSearch} onChange={e => setChatSearch(e.target.value)} />
                <button onClick={() => { setShowChatSearch(false); setChatSearch('') }}><X className="w-4 h-4 text-neutral-400" /></button>
              </div>
            )}

            {/* pinned */}
            {pinnedList.length > 0 && (
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-neutral-100 dark:border-[#2a2a2a] bg-amber-50 dark:bg-amber-900/10">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-xs text-amber-700 dark:text-amber-400 truncate">📌 {pinnedList[pinnedList.length - 1].text}</p>
              </div>
            )}

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0" onClick={() => setContextMenu(null)}>
              {/* separador de data */}
              <div className="flex items-center justify-center my-3">
                <span className="px-3 py-1 rounded-full text-xs text-neutral-500 dark:text-[#636366] bg-white dark:bg-[#1e1e1e]">
                  Hoje
                </span>
              </div>
              {filteredMessages.map((msg, idx) => (
                <MessageBubble key={msg.id} msg={msg} idx={idx} />
              ))}
              {showTyping && (
                <div className="flex items-end gap-2 mt-3 animate-fade-in">
                  <div className="w-7"><UserAvatar name={activeConv.isGroup ? 'G' : activeConv.user?.name} size="xs" /></div>
                  <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl rounded-bl-lg px-4 py-3 flex gap-1 items-center">
                    {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* context menu */}
            {contextMenu && (
              <div className="fixed z-50 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-2xl shadow-modal py-1 min-w-[160px] animate-fade-in"
                style={{ bottom: 80, right: 20 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setReplyTo(contextMenu.msg); setContextMenu(null) }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]"><Reply className="w-4 h-4" /> Responder</button>
                <button onClick={() => { togglePin(contextMenu.msgId); setContextMenu(null) }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]"><Pin className="w-4 h-4" /> {pinnedMsgs.includes(contextMenu.msgId) ? 'Desafixar' : 'Fixar'}</button>
                {contextMenu.msg.from === user.id && (
                  <button onClick={() => { deleteMessage(active, contextMenu.msgId); setContextMenu(null) }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"><Trash2 className="w-4 h-4" /> Apagar</button>
                )}
              </div>
            )}

            {/* reply bar */}
            {replyTo && (
              <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2 border-t border-neutral-100 dark:border-[#282828] bg-white dark:bg-[#1e1e1e] animate-slide-up">
                <button onClick={() => setReplyTo(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-[#333] text-neutral-700 dark:text-neutral-200 text-sm font-semibold flex-shrink-0">
                  <ChevronLeft className="w-4 h-4" /> Recuar
                </button>
                <Reply className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary-600">{replyTo.fromName || 'Tu'}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{replyTo.text}</p>
                </div>
              </div>
            )}

            {/* input */}
            <div className="flex-shrink-0 px-4 py-3 bg-white dark:bg-[#1e1e1e] border-t border-neutral-100 dark:border-[#282828]"
              style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
              <input ref={imageInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden"
                onChange={e => {
                  const files = Array.from(e.target.files || [])
                  if (files.length) { setAttachments(p => [...p, ...files]); showToast(`📎 ${files.length} anexo(s)`) }
                  e.target.value = ''
                }} />
              {attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachments.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-100 dark:bg-[#2a2a2a] text-xs text-neutral-600 dark:text-neutral-300">
                      {f.name}
                      <button onClick={() => setAttachments(p => p.filter((_, j) => j !== i))}><X className="w-3 h-3 text-neutral-400" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button onClick={() => imageInputRef.current?.click()} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-500 transition-colors flex-shrink-0">
                  <Image className="w-5 h-5" />
                </button>
                <div className="relative flex-1 flex items-end bg-neutral-100 dark:bg-[#2a2a2a] rounded-2xl px-4 py-2 gap-2">
                  <textarea
                    placeholder="Mensagem…"
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none resize-none max-h-24"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  />
                  {showEmojiPicker && (
                    <div className="absolute right-2 bottom-full mb-2 flex items-center gap-1 p-2 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2a2a2a] shadow-modal animate-slide-up z-20">
                      {MESSAGE_EMOJIS.map(em => (
                        <button key={em} onClick={() => { setInput(c => c + em); setShowEmojiPicker(false) }}
                          className="w-9 h-9 text-xl rounded-xl flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-[#2a2a2a]">
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setShowEmojiPicker(s => !s)} className={clsx('flex-shrink-0', showEmojiPicker ? 'text-primary-600' : 'text-neutral-400 hover:text-neutral-600')}>
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                {(input.trim() || attachments.length > 0)
                  ? <button onClick={handleSend} className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors flex-shrink-0 active:scale-95"><Send className="w-4 h-4" /></button>
                  : <button disabled className="p-2.5 bg-neutral-200 dark:bg-[#2a2a2a] text-neutral-400 rounded-xl flex-shrink-0 cursor-not-allowed"><Send className="w-4 h-4" /></button>
                }
              </div>
            </div>
          </>
        ) : (
          /* empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
              <Send className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
            </div>
            <div>
              <p className="font-bold text-lg text-neutral-900 dark:text-white">As tuas mensagens</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Selecciona uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* info panel — desktop only */}
      {showInfoPanel && activeConv && (
        <div className="hidden md:flex w-72 flex-col border-l border-neutral-100 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] overflow-y-auto flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-[#2a2a2a]">
            <h3 className="font-bold text-neutral-900 dark:text-white">Informações</h3>
            <button onClick={() => setShowInfoPanel(false)} className="p-2 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4 space-y-4">
            {!activeConv.isGroup && !activeConv.isChannel && activeConv.user && (
              <div className="flex flex-col items-center text-center">
                <UserAvatar name={activeConv.user.name} size="lg" />
                <p className="mt-3 font-bold text-sm text-neutral-900 dark:text-white">{activeConv.user.name}</p>
                <span className={clsx('inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium', activeConv.user.status === 'online' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-600 dark:bg-[#2a2a2a] dark:text-neutral-400')}>
                  {activeConv.user.status === 'online' ? '🟢 Online' : '🔘 Offline'}
                </span>
                <Link to={`/profile/${activeConv.user.id}`} className="mt-3 w-full py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-semibold rounded-xl hover:bg-primary-100 transition-colors text-center block">Ver perfil</Link>
              </div>
            )}
            {(activeConv.isGroup || activeConv.isChannel) && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                  {activeConv.isChannel ? <span className="text-2xl">🎓</span> : <Users className="w-7 h-7 text-white" />}
                </div>
                <p className="mt-3 font-bold text-sm text-neutral-900 dark:text-white">{activeConv.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{activeConv.members} membros</p>
              </div>
            )}
            <div className="space-y-2 pt-2">
              <button onClick={toggleMute} className="w-full py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-[#2a2a2a] rounded-xl hover:bg-neutral-200 dark:hover:bg-[#333] transition-colors">
                {mutedConvs.includes(activeConv.id) ? '🔔 Ativar notificações' : '🔕 Silenciar'}
              </button>
              <button onClick={clearConv} className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">🗑️ Limpar conversa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  /* ══════════════════════════════════════════════════════════
     ROOT RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#1e1e1e]">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* ── MOBILE: list ── */}
      <div className={clsx('flex flex-col w-full h-full md:hidden', mobileView === 'chat' && 'hidden')}>
        <ListPanel />
        {/* FAB */}
        <button
          onClick={() => navigate('/explore')}
          className="absolute bottom-6 right-5 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors active:scale-95 z-20"
          aria-label="Nova conversa"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* ── MOBILE: chat ── */}
      <div className={clsx('flex w-full h-full md:hidden', mobileView !== 'chat' && 'hidden')}>
        <ChatPanel onBack={() => { setMobileView('list'); setActive(null) }} />
      </div>

      {/* ── DESKTOP: split ── */}
      <div className="hidden md:flex w-full h-full overflow-hidden">
        {/* left panel — fixed width */}
        <div className="w-80 flex-shrink-0 border-r border-neutral-100 dark:border-[#2a2a2a] overflow-hidden">
          <ListPanel />
        </div>
        {/* right panel — chat */}
        <ChatPanel onBack={() => setActive(null)} />
      </div>

      {/* Call overlay */}
      {callActive && activeConv?.user && (
        <CallScreen 
          user={activeConv.user} 
          callType={callType}
          incoming={incomingCall}
          onAccept={() => setIncomingCall(false)}
          onReject={() => {
            setCallActive(false)
            setIncomingCall(false)
            setCallType(null)
          }}
          onEnd={() => {
            setCallActive(false)
            setIncomingCall(false)
            setCallType(null)
          }}
        />
      )}
    </div>
  )
}
