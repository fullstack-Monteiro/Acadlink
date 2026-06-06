import { useEffect, useRef, useState } from 'react'
import { MessageCircle, MoreHorizontal, Bookmark, Send, X, Repeat2, Link2, Flag, EyeOff, UserPlus, UserCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserAvatar from '../ui/UserAvatar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import UniversityTag from '../profile/UniversityTag'
import VerificationBadge from '../profile/VerificationBadge'
import SaveToCollectionModal from '../modals/SaveToCollectionModal'
import { stringifyUniversity } from '../../utils/university'
import MentionInput, { MentionText } from './MentionInput'
import { REACTIONS } from '../../data/mock'
import { useAuth } from '../../context/AuthContext'
import { usePosts } from '../../context/PostsContext'

function ReactionBar({ reactions, myReaction, onReact }) {
  const [open, setOpen] = useState(false)
  const [burst, setBurst] = useState(false)
  const timerRef = useRef(null)
  const safeReactions = reactions || {}
  const total = Object.values(safeReactions).reduce((a, b) => a + b, 0)
  const current = REACTIONS.find(r => r.key === myReaction)

  const react = (value) => {
    onReact(value)
    setBurst(true)
    setTimeout(() => setBurst(false), 280)
    setOpen(false)
  }

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(true), 400)
  }

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(false), 200)
  }

  return (
    <div className="relative">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setOpen(o => !o)}
        onClick={() => react(myReaction ? null : 'like')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95 ${
          myReaction
            ? 'bg-primary-50 dark:bg-white/10'
            : 'text-neutral-500 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#3a3b3c]'
        }`}
        style={myReaction && current ? { color: current.color } : {}}
      >
        {burst && (
          <span className="absolute inset-0 rounded-lg border border-primary-300/70 dark:border-primary-400/40 animate-ping pointer-events-none" />
        )}
        <span className={`text-base transition-transform duration-150 ${myReaction ? 'scale-110' : ''}`}>
          {current ? current.emoji : '👍'}
        </span>
        {total > 0 && <span className="text-xs opacity-70">{total}</span>}
      </button>

      {open && (
        <div
          onMouseEnter={() => { clearTimeout(timerRef.current); setOpen(true) }}
          onMouseLeave={handleMouseLeave}
          className="absolute bottom-11 left-0 bg-white dark:bg-[#242526] border border-neutral-100 dark:border-[#3a3b3c] rounded-full shadow-modal px-3 py-2 flex gap-1 z-20 animate-fade-in"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
        >
          {REACTIONS.map(r => (
            <button
              key={r.key}
              onClick={() => react(myReaction === r.key ? null : r.key)}
              title={r.label}
              className={`relative flex flex-col items-center group transition-all duration-150 ${
                myReaction === r.key ? 'scale-125' : 'hover:scale-125 hover:-translate-y-2'
              }`}
            >
              <span className="text-2xl leading-none">{r.emoji}</span>
              <span
                className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-neutral-800 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {r.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CommentLikeButton({ count }) {
  const [liked, setLiked] = useState(false)
  const [n, setN] = useState(count)
  const toggle = () => { setLiked(l => !l); setN(v => liked ? v - 1 : v + 1) }
  return (
    <button onClick={toggle} className={`text-xs font-semibold transition-colors ${liked ? 'text-primary-600' : 'text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-300'}`}>
      {liked ? '👍' : 'Like'}{n > 0 ? ` · ${n}` : ''}
    </button>
  )
}

function CommentsModal({ post, onClose }) {
  const { user } = useAuth()
  const { addComment } = usePosts()
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const comments = post.comments || []

  const submit = () => {
    if (!text.trim()) return
    addComment(post.id, {
      id: Date.now(),
      author: user,
      text: replyTo ? `@${replyTo} ${text}` : text,
      time: 'Agora',
      likes: 0,
    })
    setText('')
    setReplyTo(null)
    // scroll to bottom after adding
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  const handleReply = (name) => {
    setReplyTo(name)
    inputRef.current?.focus()
  }

  // lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-lg bg-white dark:bg-[#1e1e1e] rounded-t-3xl sm:rounded-2xl shadow-modal flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#3a3a3a]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a]">
          <span className="font-semibold text-neutral-900 dark:text-white text-sm">
            {comments.length} comentário{comments.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 transition-colors"
            aria-label="Fechar comentários"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post preview */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a] flex gap-3">
          <UserAvatar name={post.author.name} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{post.author.name}</p>
            <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] truncate">{post.author.course} · {post.time}</p>
            <p className="text-xs text-neutral-600 dark:text-[#b0b3b8] mt-1 line-clamp-2 leading-relaxed">{post.content}</p>
          </div>
        </div>

        {/* Comments list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-3xl mb-2">💬</span>
              <p className="text-sm font-medium text-neutral-500 dark:text-[#b0b3b8]">Sem comentários ainda</p>
              <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] mt-0.5">Sê o primeiro a comentar</p>
            </div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  <UserAvatar name={c.author.name} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Bubble */}
                  <div className="bg-neutral-50 dark:bg-[#2a2a2a] rounded-2xl rounded-tl-sm px-3 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                        {c.author.name}
                      </span>
                      {c.author.verified && (
                        <VerificationBadge university={c.author.verifiedUniversity} showLabel={false} />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-0.5 mb-1">
                      {c.author.course ?? ''}{c.author.university ? ` · ${c.author.university.split(' — ')[0]}` : ''}
                    </p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      <MentionText text={c.text} />
                    </p>
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-1 pl-1">
                    <span className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{c.time}</span>
                    <CommentLikeButton count={c.likes ?? 0} />
                    <button
                      onClick={() => handleReply(c.author.name.split(' ')[0])}
                      className="text-xs font-semibold text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-[#2a2a2a]" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-xs text-neutral-500 dark:text-[#b0b3b8]">A responder a <span className="font-semibold text-primary-600">@{replyTo}</span></span>
              <button onClick={() => setReplyTo(null)} className="text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-200 ml-auto transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <UserAvatar name={user?.name} size="sm" />
            <div className="flex-1 flex items-end gap-2 bg-neutral-50 dark:bg-[#2a2a2a] rounded-2xl px-3 py-2 border border-neutral-200 dark:border-[#3a3a3a] focus-within:ring-2 focus-within:ring-primary-500 transition-all">
              <MentionInput
                inputRef={inputRef}
                value={text}
                onChange={setText}
                onSubmit={submit}
                placeholder="Adiciona um comentário... (usa @ para mencionar)"
              />
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="flex-shrink-0 p-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all active:scale-95"
                aria-label="Enviar comentário"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShareModal({ post, onClose, onShare }) {
  const [shared, setShared] = useState(false)
  const [note, setNote] = useState('')

  const handleShare = () => {
    onShare?.()
    setShared(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-modal w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-neutral-900 dark:text-white">Partilhar post</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 dark:text-[#b0b3b8] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!shared ? (
          <>
            <textarea
              placeholder="Adiciona um comentário (opcional)..."
              className="w-full bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] mb-3"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <div className="bg-neutral-50 dark:bg-[#222222] rounded-xl p-3 mb-4 border border-neutral-200 dark:border-[#2a2a2a]">
              <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mb-1">{post.author.name} · {stringifyUniversity(post.author.university)}</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">{post.content}</p>
            </div>
            <button
              onClick={handleShare}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Repeat2 className="w-4 h-4" /> Partilhar no feed
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <span className="text-4xl">✅</span>
            <p className="font-semibold text-neutral-900 dark:text-white mt-3">Post partilhado!</p>
            <button onClick={onClose} className="mt-4 text-sm text-primary-600 hover:underline">Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}

function PostContent({ content }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.split('\n').length > 2 || content.length > 120

  if (!isLong) {
    return (
      <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed mb-3 whitespace-pre-line">
        <MentionText text={content} />
      </p>
    )
  }

  return (
    <div className="mb-3">
      <p className={`text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line ${!expanded ? 'line-clamp-2' : ''}`}>
        <MentionText text={content} />
      </p>
      <button
        onClick={() => setExpanded(e => !e)}
        className="text-xs font-semibold text-neutral-500 dark:text-[#e4e6ea] hover:text-primary-600 dark:hover:text-primary-400 transition-colors mt-0.5"
      >
        {expanded ? 'ver menos' : 'ver mais'}
      </button>
    </div>
  )
}

export default function PostCard({ post, onSaveToggle }) {
  const { user, toggleConnect, isConnected } = useAuth()
  const { reactPost, sharePost, toggleSave } = usePosts()
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [toast, setToast] = useState('')
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const menuItemsRef = useRef([])
  const shareRef = useRef(null)
  const isOwnPost = user?.id === post.author.id
  const connectedToAuthor = isConnected(post.author.id)

  useEffect(() => {
    if (!showMenu) return undefined
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  useEffect(() => {
    if (!showMenu) return undefined
    function handleEscape(event) {
      if (event.key === 'Escape') setShowMenu(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showMenu])

  useEffect(() => {
    if (!showMenu) return undefined
    const first = menuItemsRef.current[0]
    first?.focus()
    return undefined
  }, [showMenu])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!showShare) return undefined
    function handleClickOutside(e) {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showShare])

  const handleReact = (key) => reactPost(post.id, null, key)

  const handleSave = () => {
    if (post.saved) {
      toggleSave(post.id)
      onSaveToggle?.(post.id)
      setShowMenu(false)
      setToast('Post removido dos guardados')
    } else {
      setShowMenu(false)
      setShowSaveModal(true)
    }
  }

  const handleShare = () => {
    sharePost(post.id)
    setShowShare(false)
  }

  const moveMenuFocus = (step, fallbackIndex = 0) => {
    const items = menuItemsRef.current.filter(Boolean)
    if (items.length === 0) return
    const activeIndex = items.findIndex(item => item === document.activeElement)
    const nextIndex = activeIndex === -1 ? fallbackIndex : (activeIndex + step + items.length) % items.length
    items[nextIndex]?.focus()
  }

  const handleMenuKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveMenuFocus(1, 0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveMenuFocus(-1, menuItemsRef.current.filter(Boolean).length - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      menuItemsRef.current.filter(Boolean)[0]?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      const items = menuItemsRef.current.filter(Boolean)
      items[items.length - 1]?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setShowMenu(false)
      menuButtonRef.current?.focus()
    }
  }

  if (hidden) {
    return (
      <Card className="p-4 animate-fade-in">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500 dark:text-[#b0b3b8]">Post ocultado do teu feed.</p>
          <button
            onClick={() => setHidden(false)}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Desfazer
          </button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1 mr-2">
            <UserAvatar name={post.author.name} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors leading-tight truncate">
                  {post.author.name}
                </p>
                {post.author.verified && (
                  <VerificationBadge university={post.author.verifiedUniversity} showLabel={false} />
                )}
                <UniversityTag university={post.author.university} size="xs" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] dark:text-neutral-400 truncate">
                {post.author.course}
              </p>
              <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] dark:text-neutral-500">{post.time}</p>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge label={post.category} variant={post.category} />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(m => !m)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 dark:text-[#e4e6ea] transition-colors"
                aria-haspopup="menu"
                aria-expanded={showMenu}
                ref={menuButtonRef}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div role="menu" onKeyDown={handleMenuKeyDown} className="absolute right-0 top-8 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-xl shadow-modal z-10 py-1 min-w-[220px] animate-fade-in">
                  <button ref={el => { menuItemsRef.current[0] = el }} role="menuitem" tabIndex={-1} onClick={handleSave} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4" />
                    {post.saved ? 'Remover dos guardados' : 'Guardar post'}
                  </button>
                  <button ref={el => { menuItemsRef.current[1] = el }} role="menuitem" tabIndex={-1} onClick={() => { navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id); setShowMenu(false); setToast('Link copiado') }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">
                    <Link2 className="w-4 h-4" />
                    Copiar link
                  </button>
                  {!isOwnPost && (
                    <button ref={el => { menuItemsRef.current[2] = el }} role="menuitem" tabIndex={-1} onClick={() => { toggleConnect(post.author.id); setShowMenu(false); setToast(connectedToAuthor ? 'Conexão removida' : 'Conexão enviada') }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">
                      {connectedToAuthor ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {connectedToAuthor ? 'Remover conexão' : 'Conectar'}
                    </button>
                  )}
                  <button ref={el => { menuItemsRef.current[isOwnPost ? 2 : 3] = el }} role="menuitem" tabIndex={-1} onClick={() => { setHidden(true); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">
                    <EyeOff className="w-4 h-4" />
                    Ocultar post
                  </button>
                  <div className="my-1 border-t border-neutral-100 dark:border-[#2a2a2a]" />
                  <button ref={el => { menuItemsRef.current[isOwnPost ? 3 : 4] = el }} role="menuitem" tabIndex={-1} onClick={() => { alert('Post reportado. Obrigado pelo feedback.'); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-red-500 flex items-center gap-2.5">
                    <Flag className="w-4 h-4" />
                    Reportar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <PostContent content={post.content} />

        {post.video ? (
          <div className="mb-3 -mx-4 overflow-hidden rounded-3xl bg-black">
            <video
              controls
              src={post.video}
              poster={post.videoPoster || post.image || ''}
              className="w-full object-cover max-h-[32rem]"
            />
          </div>
        ) : post.image ? (
          <div className="mb-3 -mx-4 overflow-hidden rounded-3xl">
            <img
              src={post.image}
              alt=""
              className="w-full object-cover max-h-80 sm:max-h-96"
              loading="lazy"
            />
          </div>
        ) : null}

        {/* Resumo de reações — estilo Facebook */}
        {(() => {
          const reactions = post.reactions || {}
          const total = Object.values(reactions).reduce((a, b) => a + b, 0)
          if (total === 0) return null

          const topReactions = REACTIONS
            .filter(r => (reactions[r.key] || 0) > 0)
            .sort((a, b) => (reactions[b.key] || 0) - (reactions[a.key] || 0))
            .slice(0, 3)
          return (
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {topReactions.map(r => (
                    <span key={r.key} className="text-sm leading-none">{r.emoji}</span>
                  ))}
                </div>
              </div>
              {(post.commentCount || 0) > 0 && (
                <button onClick={() => setShowComments(true)} className="text-xs text-neutral-400 dark:text-[#b0b3b8] hover:underline">
                  {post.commentCount} comentário{post.commentCount !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          )
        })()}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-[#3a3b3c]">
          <ReactionBar reactions={post.reactions} myReaction={post.myReaction} onReact={handleReact} />

          <button
            onClick={() => setShowComments(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              showComments
                ? 'text-primary-600 bg-primary-50 dark:bg-white/10'
                : 'text-neutral-500 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#3a3b3c]'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            {post.commentCount > 0 && <span className="text-xs">{post.commentCount}</span>}
          </button>

          <div className="relative" ref={shareRef}>
            <button
              onClick={() => setShowShare(s => !s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                showShare
                  ? 'text-primary-600 bg-primary-50 dark:bg-white/10'
                  : 'text-neutral-500 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#3a3b3c]'
              }`}
            >
              <Repeat2 className="w-5 h-5" />
              {post.shares > 0 && <span className="text-xs">{post.shares}</span>}
            </button>
            {showShare && (
              <div className="absolute bottom-10 left-0 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-xl shadow-modal z-20 py-1 min-w-[200px] animate-fade-in">
                <button
                  onClick={() => { handleShare(); setShowShare(false); setToast('Post partilhado no feed') }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5"
                >
                  <Repeat2 className="w-4 h-4" />
                  Recompartilhar
                </button>
                <button
                  onClick={() => { setShowShare(false); setShowShareModal(true) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Recompartilhar com comentário
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className={`ml-auto p-1.5 rounded-lg transition-all active:scale-95 ${
              post.saved
                ? 'text-primary-600 bg-primary-50 dark:bg-white/10'
                : 'text-neutral-400 dark:text-[#e4e6ea] hover:bg-neutral-100 dark:hover:bg-[#2a2a2a]'
            }`}
            aria-label={post.saved ? 'Remover post guardado' : 'Guardar post'}
          >
            <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Card>

      {showComments && (
        <CommentsModal post={post} onClose={() => setShowComments(false)} />
      )}

      {showSaveModal && (
        <SaveToCollectionModal post={post} onClose={() => { setShowSaveModal(false); setToast('Post guardado') }} />
      )}

      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs shadow-modal z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {showShareModal && <ShareModal post={post} onClose={() => setShowShareModal(false)} onShare={handleShare} />}
    </>
  )
}
