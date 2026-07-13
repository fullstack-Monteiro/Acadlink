import { useState, useEffect, useRef } from 'react'
import {
  Send, ChevronLeft, Search, Phone, Video, Users, Plus,
  Image, Smile, Heart, Info, Reply, Pin, Trash2, X, Clock
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMessages } from '../context/MessagesContext'
import Navbar from '../components/layout/Navbar'
import UserAvatar from '../components/ui/UserAvatar'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import CallScreen from '../components/calls/CallScreen'
import clsx from 'clsx'

const statusColor = { online: 'bg-secondary-500', offline: 'bg-neutral-400' }

function getStatusText(user) {
  if (!user) return ''
  if (user.status === 'online') return 'Online'
  if (!user.lastSeen) return 'Offline'
  const diff = Date.now() - user.lastSeen
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'visto agora mesmo'
  if (mins < 60) return `visto há ${mins} min`
  if (hours < 24) return `visto às ${new Date(user.lastSeen).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}`
  if (days === 1) return `visto ontem às ${new Date(user.lastSeen).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}`
  return `visto em ${new Date(user.lastSeen).toLocaleDateString('pt', { day: '2-digit', month: 'short' })}`
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
      {msg}
    </div>
  )
}

export default function Messages() {
  const { user } = useAuth()
  const { convs, isReady, error, sendMessage, markRead, deleteMessage, addBotReply } = useMessages()
  const [searchParams] = useSearchParams()
  const [active, setActive]         = useState(null)
  const [input, setInput]           = useState('')
  const [mobileView, setMobileView] = useState('list')
  const [searchQ, setSearchQ]       = useState('')
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [chatSearch, setChatSearch] = useState('')
  const [showChatSearch, setShowChatSearch] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [tab, setTab]               = useState('Directo')
  const [likedMsgs, setLikedMsgs]   = useState([])
  const [pinnedMsgs, setPinnedMsgs] = useState([])
  const [replyTo, setReplyTo]       = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [toast, setToast]           = useState(null)
  const [attachments, setAttachments] = useState([])
  const [callActive, setCallActive]   = useState(false)
  const [callType, setCallType]       = useState(null) // 'voice' ou 'video'
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const imageInputRef               = useRef(null)
  const messagesEndRef = useRef(null)

  const safeConvs = Array.isArray(convs) ? convs : []
  const activeConv = safeConvs.find(c => c.id === active)

  // abrir conversa via query param (?conv=ID)
  useEffect(() => {
    if (!isReady || safeConvs.length === 0) return
    const convParam = searchParams.get('conv')
    if (convParam) {
      const id = parseInt(convParam) || convParam
      const conv = safeConvs.find(c => c.id === id || String(c.id) === String(convParam))
      if (conv) openConv(conv.id)
    }
  }, [isReady, safeConvs.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages?.length, showTyping])

  // Fechar context menu ao clicar fora
  useEffect(() => {
    const close = () => setContextMenu(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || !active) return
    const text = input.trim() || `📎 ${attachments.map(f => f.name).join(', ')}`
    setInput('')
    setAttachments([])
    sendMessage(active, user.id, user.name, text, replyTo ? { id: replyTo.id, text: replyTo.text, fromName: replyTo.fromName || 'Tu' } : null)
    setReplyTo(null)
    setShowTyping(true)
    setTimeout(() => {
      setShowTyping(false)
      addBotReply(active, '❤️')
    }, 2200)
  }

  const openConv = (id) => {
    setActive(id)
    setMobileView('chat')
    setShowChatSearch(false)
    setChatSearch('')
    markRead(id)
  }

  const showToast = (msg) => setToast(msg)

  const toggleInfoPanel = () => {
    setShowInfoPanel(prev => !prev)
  }

  const startCall = (type) => {
    if (!activeConv?.user) return
    setCallType(type)
    setCallActive(true)
  }

  const endCall = () => {
    setCallActive(false)
    setCallType(null)
  }

  const handleImageAttach = () => imageInputRef.current?.click()

  const toggleLike = (msgId) =>
    setLikedMsgs(l => l.includes(msgId) ? l.filter(x => x !== msgId) : [...l, msgId])

  const togglePin = (msgId) =>
    setPinnedMsgs(l => l.includes(msgId) ? l.filter(x => x !== msgId) : [...l, msgId])

  const handleDelete = (msgId) => deleteMessage(active, msgId)

  const openContextMenu = (e, msg) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ msgId: msg.id, msg })
  }

  const directConvs = safeConvs.filter(c => !c.isGroup)
  const groupConvs  = safeConvs.filter(c => c.isGroup)
  const totalUnread = safeConvs.reduce((sum, c) => sum + (c.unread || 0), 0)
  const displayConvs = (tab === 'Directo' ? directConvs : groupConvs).filter(c => {
    const name = c.isGroup ? c.name : c.user?.name || ''
    const q = searchQ.toLowerCase()
    return !q || name.toLowerCase().includes(q) || (c.lastMessage || '').toLowerCase().includes(q)
  })

  const filteredMessages = activeConv?.messages?.filter(m => {
    const text = String(m?.text || m?.content || '')
    return !chatSearch || text.toLowerCase().includes(chatSearch.toLowerCase())
  }) ?? []

  const pinnedList = activeConv?.messages?.filter(m => pinnedMsgs.includes(m.id)) ?? []

  // Componente interno para cada bolha de mensagem (suporta arrastar para a direita para responder)
  const MessageBubble = ({ msg, idx }) => {
    const isMe = msg.from === user.id
    const prevMsg = filteredMessages[idx - 1]
    const nextMsg = filteredMessages[idx + 1]
    const sameAsPrev = prevMsg?.from === msg.from
    const sameAsNext = nextMsg?.from === msg.from
    const isLiked = likedMsgs.includes(msg.id)
    const isPinned = pinnedMsgs.includes(msg.id)
    const isHighlighted = chatSearch && msg.text.toLowerCase().includes(chatSearch.toLowerCase())

    const startX = useRef(0)
    const [translate, setTranslate] = useState(0)
    const dragging = useRef(false)

    const handlePointerDown = (e) => {
      // só escuta left/touch
      startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0
      dragging.current = true
      e.target.setPointerCapture?.(e.pointerId)
    }

    const handlePointerMove = (e) => {
      if (!dragging.current) return
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
      const dx = x - startX.current
      if (dx > 0) {
        // arrastar para a direita
        setTranslate(Math.min(dx, 140))
      } else {
        setTranslate(0)
      }
    }

    const handlePointerUp = (e) => {
      dragging.current = false
      // se arrastou o suficiente, responder
      if (translate > 80) {
        setReplyTo({ id: msg.id, text: msg.text, fromName: msg.fromName || (isMe ? 'Tu' : activeConv.user?.name) })
        // pequeno feedback visual
        setToast('A responder: ' + (msg.text.length > 30 ? msg.text.slice(0, 30) + '…' : msg.text))
      }
      // anima retorno
      setTranslate(0)
      e.target.releasePointerCapture?.(e.pointerId)
    }

    return (
      <div className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'} ${sameAsPrev ? 'mt-0.5' : 'mt-3'}`}>
        {!isMe && (
          <div className="w-7 flex-shrink-0 self-end mb-1">
            {!sameAsNext && <UserAvatar name={activeConv.isGroup ? (msg.fromName || '?') : activeConv.user.name} size="xs" />}
          </div>
        )}

        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
          {!isMe && activeConv.isGroup && !sameAsPrev && (
            <span className="text-xs text-neutral-500 dark:text-[#b0b3b8] mb-1 ml-1">{msg.fromName}</span>
          )}

          {/* Reply preview */}
          {msg.replyTo && (
            <div className={`text-xs px-3 py-1.5 rounded-xl mb-1 border-l-2 border-primary-400 bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-500 dark:text-[#b0b3b8] max-w-full truncate`}>
              <span className="font-medium text-primary-600">{msg.replyTo.fromName}</span>: {msg.replyTo.text}
            </div>
          )}

          <div className="relative group/bubble"
            onContextMenu={e => openContextMenu(e, msg)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { dragging.current = false; setTranslate(0) }}
          >
            {/* indicador de 'arrastar para responder' */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 flex items-center justify-center opacity-0 transition-opacity"
              style={{ opacity: translate > 10 ? 1 : 0 }}>
              <Reply className="w-5 h-5 text-primary-500" />
            </div>

            <div className={clsx(
              'px-4 py-2.5 text-sm leading-relaxed break-words cursor-pointer',
              isMe ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-[#222222] text-neutral-900 dark:text-neutral-100',
              isHighlighted && 'ring-2 ring-amber-400',
              isPinned && 'ring-1 ring-amber-300',
              isMe ? [
                'rounded-3xl',
                sameAsNext ? 'rounded-br-lg' : 'rounded-br-3xl',
                sameAsPrev ? 'rounded-tr-lg' : 'rounded-tr-3xl',
              ] : [
                'rounded-3xl',
                sameAsNext ? 'rounded-bl-lg' : 'rounded-bl-3xl',
                sameAsPrev ? 'rounded-tl-lg' : 'rounded-tl-3xl',
              ]
            )} style={{ transform: `translateX(${translate}px)`, transition: dragging.current ? 'none' : 'transform 180ms ease' }}>
              {msg.text}
            </div>

            {/* Acções rápidas no hover */}
            <div className={clsx(
              'absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity',
              isMe ? '-left-20' : '-right-20'
            )}>
              <button onClick={() => setReplyTo(msg)} className="p-1.5 rounded-full bg-white dark:bg-[#2a2a2a] shadow text-neutral-500 dark:text-[#e4e6ea] hover:text-primary-600 transition-colors">
                <Reply className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => toggleLike(msg.id)} className="p-1.5 rounded-full bg-white dark:bg-[#2a2a2a] shadow text-neutral-500 dark:text-[#e4e6ea] hover:text-red-500 transition-colors">
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>

          {!sameAsNext && <span className="text-xs text-neutral-400 mt-1 px-1">{msg.time}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <div className="flex flex-col h-screen">
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* ── HEADER MOBILE: lista mostra "Mensagens", chat mostra nome da conversa ── */}
      <div className="md:hidden flex-shrink-0 bg-white dark:bg-[#1e1e1e] border-b border-neutral-100 dark:border-[#2a2a2a] h-14 flex items-center px-4 gap-3">
        {mobileView === 'chat' && activeConv ? (
          /* Header do chat no mobile */
          <>
            <button 
              onClick={() => { setMobileView('list'); setActive(null) }}
              className="p-2 -ml-1 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
              aria-label="Voltar para lista de conversas"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative flex-shrink-0">
              {activeConv.isGroup
                ? <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center"><Users className="w-4 h-4 text-white" /></div>
                : <Link to={`/profile/${activeConv.user.id}`}><UserAvatar name={activeConv.user.name} size="sm" /></Link>
              }
              {!activeConv.isGroup && <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1e1e] ${statusColor[activeConv.user.status] || 'bg-neutral-400'}`} />}
            </div>
            <div className="flex-1 min-w-0">
              {activeConv.isGroup
                ? <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">{activeConv.name}</p>
                : <Link to={`/profile/${activeConv.user.id}`} className="font-bold text-sm text-neutral-900 dark:text-white truncate hover:text-primary-600 transition-colors block">{activeConv.user.name}</Link>
              }
              <p className={`text-xs font-medium ${!activeConv.isGroup && activeConv.user.status === 'online' ? 'text-secondary-500' : 'text-neutral-400'}`}>
                {activeConv.isGroup ? `${activeConv.members} membros` : getStatusText(activeConv.user)}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!activeConv.isGroup && (
                <>
                  <button onClick={() => startCall('voice')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors" title="Iniciar chamada de voz"><Phone className="w-4 h-4" /></button>
                  <button onClick={() => startCall('video')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors" title="Iniciar videochamada"><Video className="w-4 h-4" /></button>
                </>
              )}
              <button onClick={() => setShowChatSearch(s => !s)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"><Search className="w-4 h-4" /></button>
            </div>
          </>
        ) : (
          /* Header da lista */
          <>
            <Link 
              to="/dashboard" 
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            {!searchExpanded ? (
              <>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex-1 -ml-2">Mensagens</h2>
                <button 
                  onClick={() => setSearchExpanded(true)} 
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"
                  aria-label="Pesquisar"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button onClick={() => showToast('💬 Nova conversa em breve')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="relative flex-1 animate-slide-up">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Pesquisar conversas..."
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-neutral-100 dark:bg-[#222222] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border-none transition-all"
                  value={searchQ} 
                  onChange={e => setSearchQ(e.target.value)} 
                />
                <button
                  onClick={() => { setSearchExpanded(false); setSearchQ('') }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── LISTA ── */}
        <div className={clsx(
          'flex flex-col bg-white dark:bg-[#1e1e1e] border-r border-neutral-100 dark:border-[#2a2a2a]',
          'w-full md:w-80 flex-shrink-0',
          mobileView === 'chat' && 'hidden md:flex'
        )}>
          {/* Header lista — só desktop */}
          <div className="hidden md:block px-5 pt-5 pb-3">
            <div className="hidden md:flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Mensagens</h2>
              <div className="flex items-center gap-1">
                {!searchExpanded && (
                  <button 
                    onClick={() => setSearchExpanded(true)} 
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"
                    aria-label="Pesquisar"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => showToast('💬 Nova conversa em breve')} 
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            {searchExpanded && (
              <div className="relative mb-4 animate-slide-up">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Pesquisar"
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-neutral-100 dark:bg-[#222222] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border-none transition-all"
                  value={searchQ} 
                  onChange={e => setSearchQ(e.target.value)} 
                />
                <button
                  onClick={() => { setSearchExpanded(false); setSearchQ('') }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex px-5 gap-4 border-b border-neutral-100 dark:border-[#2a2a2a]">
            {['Directo', 'Grupos'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-2.5 text-sm font-semibold transition-all border-b-2 ${
                  tab === t ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}>{t}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {!isReady ? (
              <div className="px-5 py-3 space-y-3 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-28 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                      <div className="h-3 w-40 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState title="Erro ao carregar mensagens" subtitle={error} onRetry={() => window.location.reload()} scope="messages.list" />
            ) : displayConvs.length === 0 ? (
              <EmptyState icon="💬" title="Nenhuma conversa encontrada" subtitle="Tenta ajustar a pesquisa ou inicia uma nova conversa." />
            ) : displayConvs.map(conv => {
              const name = conv.isGroup ? conv.name : conv.user.name
              const isActive = active === conv.id
              const status = conv.isGroup ? null : (conv.id === 1 ? 'online' : conv.id === 2 ? 'away' : 'offline')
              return (
                <button key={conv.id} onClick={() => openConv(conv.id)}
                  className={clsx('w-full flex items-center gap-3 px-5 py-3 transition-colors text-left',
                    isActive ? 'bg-neutral-100 dark:bg-[#222222]' : 'hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]/60'
                  )}>
                  <div className="relative flex-shrink-0">
                    {conv.isGroup
                      ? <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
                      : <UserAvatar name={name} size="md" />
                    }
                    {status && (
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e1e1e] ${statusColor[status]}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-neutral-900 dark:text-white' : 'font-semibold text-neutral-800 dark:text-neutral-200'}`}>{name}</p>
                      <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? 'font-semibold text-neutral-700 dark:text-neutral-300' : 'text-neutral-500 dark:text-[#b0b3b8]'}`}>{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && <span className="w-2.5 h-2.5 bg-primary-600 rounded-full flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── CHAT + INFO ── */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── CHAT ── */}
          <div className={clsx('flex-1 flex flex-col bg-white dark:bg-[#1e1e1e] min-w-0 min-h-0', mobileView === 'list' && 'hidden md:flex')}>
          {!isReady ? (
            <div className="flex-1 p-6 animate-pulse space-y-4">
              <div className="h-10 bg-neutral-200 dark:bg-[#2a2a2a] rounded-xl w-1/2" />
              <div className="h-20 bg-neutral-200 dark:bg-[#2a2a2a] rounded-2xl w-2/3" />
              <div className="h-20 bg-neutral-200 dark:bg-[#2a2a2a] rounded-2xl w-1/2 ml-auto" />
            </div>
          ) : error ? (
            <ErrorState title="Erro na conversa" subtitle={error} onRetry={() => window.location.reload()} scope="messages.chat" />
          ) : activeConv ? (
            <>
              {/* Header chat — só desktop */}
              <div className="hidden md:flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a] flex-shrink-0">
                <button 
                  onClick={() => setActive(null)}
                  className="p-2 -ml-1 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 transition-colors active:scale-95"
                  title="Fechar conversa"
                  aria-label="Fechar conversa"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-shrink-0">
                  {activeConv.isGroup
                    ? <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
                    : <Link to={`/profile/${activeConv.user.id}`}><UserAvatar name={activeConv.user.name} size="md" /></Link>
                  }
                  {!activeConv.isGroup && <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1e1e] ${statusColor[activeConv.user.status] || 'bg-neutral-400'}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  {activeConv.isGroup
                    ? <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">{activeConv.name}</p>
                    : <Link to={`/profile/${activeConv.user.id}`} className="font-bold text-sm text-neutral-900 dark:text-white truncate hover:text-primary-600 transition-colors block">{activeConv.user.name}</Link>
                  }
                  <p className={`text-xs font-medium ${!activeConv.isGroup && activeConv.user.status === 'online' ? 'text-secondary-500' : 'text-neutral-400'}`}>
                    {activeConv.isGroup ? `${activeConv.members} membros` : getStatusText(activeConv.user)}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!activeConv.isGroup && (
                    <>
                      <button onClick={() => startCall('voice')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 transition-colors" title="Iniciar chamada de voz"><Phone className="w-5 h-5" /></button>
                      <button onClick={() => startCall('video')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 transition-colors" title="Iniciar videochamada"><Video className="w-5 h-5" /></button>
                    </>
                  )}
                  <button onClick={() => setShowChatSearch(s => !s)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 transition-colors"><Search className="w-5 h-5" /></button>
                  <button onClick={toggleInfoPanel} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 transition-colors" title="Informações da conversa"><Info className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Pesquisa dentro do chat */}
              {showChatSearch && (
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-[#2a2a2a] flex items-center gap-2 animate-slide-up">
                  <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <input autoFocus type="text" placeholder="Pesquisar nesta conversa..."
                    className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                    value={chatSearch} onChange={e => setChatSearch(e.target.value)} />
                  <button onClick={() => { setShowChatSearch(false); setChatSearch('') }} className="text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mensagens fixadas */}
              {pinnedList.length > 0 && (
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-[#2a2a2a] bg-amber-50 dark:bg-amber-900/10">
                  <div className="flex items-center gap-2">
                    <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 truncate">
                      📌 {pinnedList[pinnedList.length - 1].text}
                    </p>
                  </div>
                </div>
              )}

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0 pb-20 md:pb-4" onClick={() => setContextMenu(null)}>
                {filteredMessages.map((msg, idx) => (
                  <MessageBubble key={msg.id} msg={msg} idx={idx} />
                ))}

                {showTyping && (
                  <div className="flex items-end gap-2 mt-3 animate-fade-in">
                    <div className="w-7 flex-shrink-0"><UserAvatar name={activeConv.isGroup ? 'G' : activeConv.user?.name} size="xs" /></div>
                    <div className="bg-neutral-100 dark:bg-[#222222] rounded-3xl rounded-bl-lg px-4 py-3 flex gap-1 items-center">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Context menu */}
              {contextMenu && (
                <div className="fixed z-50 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-2xl shadow-modal py-1 min-w-[160px] animate-fade-in"
                  style={{ bottom: 80, right: 20 }}
                  onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setReplyTo(contextMenu.msg); setContextMenu(null) }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Reply className="w-4 h-4" /> Responder
                  </button>
                  <button onClick={() => { togglePin(contextMenu.msgId); setContextMenu(null) }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Pin className="w-4 h-4" /> {pinnedMsgs.includes(contextMenu.msgId) ? 'Desafixar' : 'Fixar'}
                  </button>
                  {contextMenu.msg.from === user.id && (
                    <button onClick={() => { deleteMessage(active, contextMenu.msgId); setContextMenu(null) }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                      <Trash2 className="w-4 h-4" /> Apagar
                    </button>
                  )}
                </div>
              )}

              {/* Reply bar */}
              {replyTo && (
                <div className="px-4 py-2 border-t border-neutral-100 dark:border-[#2a2a2a] flex items-center gap-3 bg-neutral-50 dark:bg-[#222222] animate-slide-up">
                  <button onClick={() => setReplyTo(null)} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#333333] transition-colors font-semibold flex-shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                    Recuar
                  </button>
                  <Reply className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary-600">{replyTo.fromName || 'Tu'}</p>
                    <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] truncate">{replyTo.text}</p>
                  </div>
                </div>
              )}

              <div className="px-4 py-3 border-t border-neutral-100 dark:border-[#2a2a2a] flex-shrink-0 bg-white dark:bg-[#242526]" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                <input ref={imageInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={e => {
                  const files = Array.from(e.target.files || [])
                  if (files.length > 0) {
                    setAttachments(prev => [...prev, ...files])
                    showToast(`📎 ${files.length} anexo(s) adicionado(s)`)
                  }
                  e.target.value = ''
                }} />
                {attachments.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((file, idx) => (
                      <span key={`${file.name}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-100 dark:bg-[#222222] text-xs text-neutral-600 dark:text-neutral-300">
                        {file.name}
                        <button
                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button onClick={handleImageAttach} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-500 dark:text-[#e4e6ea] transition-colors flex-shrink-0">
                    <Image className="w-5 h-5" />
                  </button>
                  <div className="flex-1 flex items-end bg-neutral-100 dark:bg-[#222222] rounded-2xl px-4 py-2 gap-2">
                    <textarea placeholder="Mensagem... (Shift+Enter nova linha)"
                      className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none resize-none max-h-24"
                      rows={1}
                      value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }} />
                    <button onClick={() => showToast('😊 Emojis em breve')} className="text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex-shrink-0">
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                <Send className="w-8 h-8 text-neutral-400" />
              </div>
              <div>
                <p className="font-bold text-lg text-neutral-900 dark:text-white">As tuas mensagens</p>
                <p className="text-sm text-neutral-500 dark:text-[#b0b3b8] mt-1">Envia mensagens privadas a outros estudantes</p>
              </div>
              <button onClick={() => setMobileView('list')} className="md:hidden px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Enviar mensagem
              </button>
            </div>
          )}
          </div>

          {/* ── INFO PANEL ── */}
          {showInfoPanel && activeConv && (
            <div className="hidden md:flex w-80 flex-col bg-white dark:bg-[#242526] border-l border-neutral-100 dark:border-[#3a3b3c] overflow-y-auto">
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-neutral-100 dark:border-[#3a3b3c]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-neutral-900 dark:text-white">Informações</h3>
                  <button onClick={toggleInfoPanel} className="p-2 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] text-neutral-600 dark:text-neutral-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Utilizador */}
                {!activeConv.isGroup && activeConv.user && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-3">Utilizador</p>
                    <div className="flex flex-col items-center text-center">
                      <UserAvatar name={activeConv.user.name} size="lg" />
                      <p className="mt-3 font-bold text-sm text-neutral-900 dark:text-white">{activeConv.user.name}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">@{activeConv.user.username}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        activeConv.user.status === 'online'
                          ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {activeConv.user.status === 'online' ? '🟢 Online' : '🔘 Offline'}
                      </span>
                    </div>
                    <Link to={`/profile/${activeConv.user.id}`} className="mt-4 w-full px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-center block">
                      Ver perfil
                    </Link>
                  </div>
                )}

                {/* Grupo */}
                {activeConv.isGroup && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-3">Grupo</p>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <p className="mt-3 font-bold text-sm text-neutral-900 dark:text-white">{activeConv.name}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{activeConv.members} membros</p>
                    </div>
                  </div>
                )}

                {/* Estatísticas */}
                <div>
                  <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-3">Estatísticas</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-[#3a3b3c]">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Mensagens</span>
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">{activeConv.messages?.length || 0}</span>
                    </div>
                    {!activeConv.isGroup && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-[#3a3b3c]">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Desde</span>
                        <span className="font-bold text-sm text-neutral-900 dark:text-white">26 mai</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div>
                  <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-3">Ações</p>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-[#3a3b3c] rounded-lg hover:bg-neutral-200 dark:hover:bg-[#404142] transition-colors">
                      🔔 Silenciar conversa
                    </button>
                    <button className="w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      🗑️ Limpar conversa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Painel de chamada */}
      {callActive && activeConv?.user && (
        <CallScreen 
          user={activeConv.user} 
          callType={callType}
          onEnd={endCall}
        />
      )}
    </div>
    </div>
  )
}
