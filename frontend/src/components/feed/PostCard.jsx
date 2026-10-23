import { useEffect, useRef, useState } from 'react'
import { MessageCircle, MoreHorizontal, Bookmark, Send, X, Repeat2, Link2, Flag, EyeOff, UserPlus, UserCheck, ThumbsUp, Heart, Laugh, Zap, Frown, Flame } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserAvatar from '../ui/UserAvatar'
import LikeIcon from '../ui/LikeIcon'
import Badge from '../ui/Badge'
import UniversityTag from '../profile/UniversityTag'
import VerificationBadge from '../profile/VerificationBadge'
import SaveToCollectionModal from '../modals/SaveToCollectionModal'
import ReactionsModal from '../modals/ReactionsModal'
import { stringifyUniversity } from '../../utils/university'
import MentionInput, { MentionText } from './MentionInput'
import { REACTIONS } from '../../data/mock'
import { useAuth } from '../../context/AuthContext'
import { usePosts } from '../../context/PostsContext'

// Mapeamento de ícones de reação
const REACTION_ICONS = {
  ThumbsUp,
  Heart,
  Laugh,
  Zap,
  Frown,
  Flame,
}

function ReactionBar({ reactions, myReaction, onReact }) {
  const [open, setOpen] = useState(false)
  const [burst, setBurst] = useState(false)
  const timerRef = useRef(null)
  const safeReactions = reactions || {}
  const total = Object.values(safeReactions).reduce((a, b) => a + b, 0)
  const current = REACTIONS.find(r => r.key === myReaction)
  const CurrentIcon = current ? REACTION_ICONS[current.icon] : ThumbsUp

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
    <div className="relative flex-1">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setOpen(o => !o)}
        onClick={() => react(myReaction ? null : 'like')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95 w-full justify-center ${
          myReaction
            ? ''
            : 'text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]'
        }`}
        style={myReaction && current ? { color: current.color } : {}}
      >
        {burst && (
          <span className="absolute inset-0 rounded-lg border border-primary-300/70 dark:border-primary-400/40 animate-ping pointer-events-none" />
        )}
        {myReaction === 'like' ? (
          <LikeIcon size={22} active={true} className={`transition-transform duration-150 ${myReaction ? 'scale-110' : ''}`} />
        ) : (
          <CurrentIcon 
            className={`w-[19px] h-[19px] transition-transform duration-150 ${myReaction ? 'scale-110' : ''}`}
            fill={myReaction && current?.key === 'love' ? 'currentColor' : 'none'}
            strokeWidth={1.8}
          />
        )}
        <span className="hidden sm:inline text-xs">{current ? current.label : 'Gosto'}</span>
      </button>

      {open && (
        <div
          onMouseEnter={() => { clearTimeout(timerRef.current); setOpen(true) }}
          onMouseLeave={handleMouseLeave}
          className="absolute bottom-11 left-0 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#282828] rounded-full shadow-modal px-3 py-2 flex gap-1 z-20 animate-fade-in"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
        >
          {REACTIONS.map(r => {
            const Icon = REACTION_ICONS[r.icon]
            return (
              <button
                key={r.key}
                onClick={() => react(myReaction === r.key ? null : r.key)}
                title={r.label}
                className={`relative flex flex-col items-center group transition-all duration-150 p-2 rounded-full ${
                  myReaction === r.key ? 'scale-125' : 'hover:scale-125 hover:-translate-y-2'
                }`}
                style={r.key !== 'like' ? { color: r.color } : {}}
              >
                {r.key === 'like' ? (
                  <LikeIcon size={28} active={true} />
                ) : (
                  <Icon 
                    className="w-7 h-7" 
                    fill={r.key === 'love' ? 'currentColor' : 'none'}
                    strokeWidth={2}
                  />
                )}
                <span
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-neutral-800 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                  {r.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CommentsSection({ post }) {
  const { user } = useAuth()
  const { addComment } = usePosts()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [likedComments, setLikedComments] = useState([])
  const [expandedReplies, setExpandedReplies] = useState({})
  const inputRef = useRef(null)
  
  // Estruturar comentários com replies
  const [comments, setComments] = useState(() => {
    const rawComments = post.comments || []
    return rawComments.map(c => ({
      ...c,
      replies: c.replies || []
    }))
  })

  const submit = () => {
    if (!text.trim()) return
    
    if (replyingTo) {
      // Adicionar resposta ao comentário
      const reply = {
        id: Date.now(),
        author: user,
        text: text.trim(),
        time: 'Agora',
        likes: 0,
        replyTo: replyingTo.author.name,
        replyToId: replyingTo.author.id,
      }
      setComments(prev => prev.map(c =>
        c.id === replyingTo.id
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      ))
      setReplyingTo(null)
    } else {
      // Adicionar comentário novo
      const newComment = {
        id: Date.now(),
        author: user,
        text: text.trim(),
        time: 'Agora',
        likes: 0,
        replies: [],
      }
      setComments(prev => [...prev, newComment])
      addComment(post.id, newComment)
    }
    
    setText('')
  }

  const handleReply = (comment) => {
    if (!comment || !comment.author) return
    setReplyingTo(comment)
    const firstName = comment.author.name?.split(' ')[0] || 'usuário'
    setText(`@${firstName} `)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setText('')
  }

  const handleMentionClick = (e, authorId) => {
    e.preventDefault()
    e.stopPropagation()
    if (authorId) {
      navigate(`/profile/${authorId}`)
    }
  }

  const toggleRepliesExpanded = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const toggleLike = (id) => {
    setLikedComments(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, likes: likedComments.includes(id) ? c.likes - 1 : c.likes + 1 }
      }
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r =>
            r.id === id
              ? { ...r, likes: likedComments.includes(id) ? r.likes - 1 : r.likes + 1 }
              : r
          )
        }
      }
      return c
    }))
  }

  return (
    <div className="border-t border-neutral-100 dark:border-[#282828] pt-3 mt-3">
      {/* Comments list */}
      <div className="space-y-4 mb-3">
        {comments.length === 0 ? (
          <p className="text-xs text-neutral-400 dark:text-[#636366] text-center py-2">
            Sem comentários. Sê o primeiro a comentar.
          </p>
        ) : (
          comments.map(c => {
            // Validar dados do comentário
            if (!c || !c.author) return null
            
            return (
            <div key={c.id} className="space-y-3">
              {/* Comentário Principal */}
              <div className="flex gap-2.5">
                <div className="flex-shrink-0">
                  <UserAvatar name={c.author.name} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Bubble */}
                  <div className="bg-neutral-100 dark:bg-[#282828] rounded-2xl rounded-tl-sm px-3 py-2">
                    <Link
                      to={`/profile/${c.author.id}`}
                      className="text-xs font-semibold text-neutral-900 dark:text-[#f5f5f7] hover:underline inline-flex items-center gap-1"
                    >
                      {c.author.name}
                      {c.author.verified && (
                        <VerificationBadge university={c.author.verifiedUniversity} showLabel={false} />
                      )}
                    </Link>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed mt-0.5">
                      <MentionText text={c.text} />
                    </p>
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-1 pl-1 text-xs">
                    <span className="text-neutral-400 dark:text-[#636366]">{c.time}</span>
                    <button
                      onClick={() => toggleLike(c.id)}
                      className={`flex items-center gap-1 font-semibold transition-colors ${
                        likedComments.includes(c.id)
                          ? 'text-blue-500'
                          : 'text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]'
                      }`}
                    >
                      <LikeIcon size={16} active={likedComments.includes(c.id)} />
                      {c.likes > 0 && <span>{c.likes}</span>}
                    </button>
                    <button
                      onClick={() => handleReply(c)}
                      className="font-semibold text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2] transition-colors"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>

              {/* Respostas (indentadas) */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-10 space-y-3">
                  {/* Botão "Ver mais respostas" quando há mais de 2 e não está expandido */}
                  {c.replies.length > 2 && !expandedReplies[c.id] && (
                    <button
                      onClick={() => toggleRepliesExpanded(c.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-[#636366] hover:text-neutral-700 dark:hover:text-[#aeaeb2] transition-colors"
                    >
                      <div className="w-8 h-px bg-neutral-300 dark:bg-[#333333]" />
                      <span>Ver mais {c.replies.length - 2} {c.replies.length - 2 === 1 ? 'resposta' : 'respostas'}</span>
                    </button>
                  )}

                  {/* Mostrar apenas 2 respostas se não expandido, todas se expandido */}
                  {(expandedReplies[c.id] ? c.replies : c.replies.slice(-2)).map(r => {
                    if (!r || !r.author) return null
                    
                    return (
                    <div key={r.id} className="flex gap-2.5">
                      <div className="flex-shrink-0">
                        <UserAvatar name={r.author.name} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-neutral-100 dark:bg-[#282828] rounded-2xl rounded-tl-sm px-3 py-2">
                          <Link
                            to={`/profile/${r.author.id}`}
                            className="text-xs font-semibold text-neutral-900 dark:text-[#f5f5f7] hover:underline"
                          >
                            {r.author.name}
                          </Link>
                          <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed mt-0.5">
                            {r.replyTo && r.replyToId && (
                              <>
                                <Link
                                  to={`/profile/${r.replyToId}`}
                                  className="font-semibold text-brand-500 hover:underline"
                                >
                                  @{r.replyTo}
                                </Link>
                                {' '}
                              </>
                            )}
                            {r.text.startsWith(`@${r.replyTo}`) ? r.text.slice((r.replyTo?.length || 0) + 2) : r.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 pl-1 text-xs">
                          <span className="text-neutral-400 dark:text-[#636366]">{r.time}</span>
                          <button
                            onClick={() => toggleLike(r.id)}
                            className={`flex items-center gap-1 font-semibold transition-colors ${
                              likedComments.includes(r.id)
                                ? 'text-blue-500'
                                : 'text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]'
                            }`}
                          >
                            <LikeIcon size={16} active={likedComments.includes(r.id)} />
                            {r.likes > 0 && <span>{r.likes}</span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  )})}

                  {/* Botão "Ocultar respostas" quando expandido */}
                  {c.replies.length > 2 && expandedReplies[c.id] && (
                    <button
                      onClick={() => toggleRepliesExpanded(c.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-[#636366] hover:text-neutral-700 dark:hover:text-[#aeaeb2] transition-colors"
                    >
                      <div className="w-8 h-px bg-neutral-300 dark:bg-[#333333]" />
                      <span>Ocultar respostas</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )})
        )}
      </div>

      {/* Input area */}
      <div>
        {replyingTo && (
          <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-[#282828] rounded-lg mb-2 text-xs">
            <p className="text-neutral-600 dark:text-[#aeaeb2]">
              A responder a <span className="font-semibold text-brand-500">@{replyingTo.author?.name?.split(' ')[0] || 'usuário'}</span>
            </p>
            <button
              onClick={cancelReply}
              className="font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-[#aeaeb2] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <UserAvatar name={user?.name} size="sm" />
          <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-[#282828] rounded-full px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && submit()}
              placeholder={replyingTo ? `Responder a ${replyingTo.author?.name?.split(' ')[0] || 'usuário'}…` : "Escreve um comentário…"}
              className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 dark:placeholder-[#636366] outline-none"
            />
            {text.trim() && (
              <button
                onClick={submit}
                className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                Enviar
              </button>
            )}
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
          <h3 className="font-bold text-neutral-900 dark:text-[#f5f5f7]">Partilhar post</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-400 dark:text-[#aeaeb2] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!shared ? (
          <>
            <textarea
              placeholder="Adiciona um comentário (opcional)..."
              className="w-full bg-neutral-50 dark:bg-[#282828] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#3d3d3d] mb-3"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <div className="bg-neutral-50 dark:bg-[#282828] rounded-xl p-3 mb-4 border border-neutral-200 dark:border-[#3d3d3d]">
              <p className="text-xs text-neutral-500 dark:text-[#aeaeb2] mb-1">{post.author.name} · {stringifyUniversity(post.author.university)}</p>
              <p className="text-sm text-neutral-700 dark:text-[#f5f5f7] line-clamp-2">{post.content}</p>
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

function PostContent({ content, collapsedLines = 2 }) {
  const [expanded, setExpanded] = useState(false)
  const isMediaPreview = collapsedLines === 1
  const minLength = isMediaPreview ? 80 : 120
  const isLong = content.split('\n').length > collapsedLines || content.length > minLength

  if (!isLong) {
    return (
      <p className="text-[15px] text-neutral-800 dark:text-neutral-200 leading-relaxed mb-3 whitespace-pre-line">
        <MentionText text={content} />
      </p>
    )
  }

  if (isMediaPreview && !expanded) {
    return (
      <div className="mb-3">
        <div className="flex items-center gap-1 text-[15px] text-neutral-800 dark:text-neutral-200 leading-relaxed">
          <span className="min-w-0 overflow-hidden whitespace-nowrap">
            <MentionText text={content} />
          </span>
          <button
            onClick={() => setExpanded(true)}
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors focus:outline-none"
          >
            ...
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <p className={`text-[15px] text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line ${!expanded && !isMediaPreview ? `line-clamp-${collapsedLines}` : ''}`}>
        <MentionText text={content} />
      </p>
      {(expanded || !isMediaPreview) && (
        <button
          onClick={() => setExpanded(e => !e)}
          className={`text-xs font-semibold text-neutral-500 dark:text-[#aeaeb2] hover:text-primary-600 dark:hover:text-primary-400 transition-colors mt-0.5`}
        >
          {expanded ? 'ver menos' : 'ver mais'}
        </button>
      )}
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
  const [showReactionsModal, setShowReactionsModal] = useState(false)
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
      <div className="p-4 animate-fade-in">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500 dark:text-[#aeaeb2]">Post ocultado do teu feed.</p>
          <button
            onClick={() => setHidden(false)}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Desfazer
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <article className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 animate-fade-in border border-neutral-100 dark:border-transparent">
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
              <p className="text-xs text-neutral-500 dark:text-[#aeaeb2] truncate">
                {post.author.course}
              </p>
              <p className="text-xs text-neutral-400 dark:text-[#636366]">{post.time}</p>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge label={post.category} variant={post.category} />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(m => !m)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-400 dark:text-[#aeaeb2] transition-colors"
                aria-haspopup="menu"
                aria-expanded={showMenu}
                ref={menuButtonRef}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div role="menu" onKeyDown={handleMenuKeyDown} className="absolute right-0 top-8 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#282828] rounded-xl shadow-modal z-10 py-1 min-w-[220px] animate-fade-in">
                  <button ref={el => { menuItemsRef.current[0] = el }} role="menuitem" tabIndex={-1} onClick={handleSave} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-neutral-700 dark:text-[#f5f5f7] flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4" />
                    {post.saved ? 'Remover dos guardados' : 'Guardar post'}
                  </button>
                  <button ref={el => { menuItemsRef.current[1] = el }} role="menuitem" tabIndex={-1} onClick={() => { navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id); setShowMenu(false); setToast('Link copiado') }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-neutral-700 dark:text-[#f5f5f7] flex items-center gap-2.5">
                    <Link2 className="w-4 h-4" />
                    Copiar link
                  </button>
                  {!isOwnPost && (
                    <button ref={el => { menuItemsRef.current[2] = el }} role="menuitem" tabIndex={-1} onClick={() => { toggleConnect(post.author.id); setShowMenu(false); setToast(connectedToAuthor ? 'Conexão removida' : 'Conexão enviada') }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-neutral-700 dark:text-[#f5f5f7] flex items-center gap-2.5">
                      {connectedToAuthor ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {connectedToAuthor ? 'Remover conexão' : 'Conectar'}
                    </button>
                  )}
                  <button ref={el => { menuItemsRef.current[isOwnPost ? 2 : 3] = el }} role="menuitem" tabIndex={-1} onClick={() => { setHidden(true); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-neutral-700 dark:text-[#f5f5f7] flex items-center gap-2.5">
                    <EyeOff className="w-4 h-4" />
                    Ocultar post
                  </button>
                  <div className="my-1 border-t border-neutral-100 dark:border-[#282828]" />
                  <button ref={el => { menuItemsRef.current[isOwnPost ? 3 : 4] = el }} role="menuitem" tabIndex={-1} onClick={() => { alert('Post reportado. Obrigado pelo feedback.'); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-red-500 flex items-center gap-2.5">
                    <Flag className="w-4 h-4" />
                    Reportar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <PostContent content={post.content} collapsedLines={post.video || post.image ? 1 : 2} />

        {post.video ? (
          <div className="relative mb-3 -mx-4 overflow-hidden rounded-[10px] bg-black aspect-video">
            <video
              disablePictureInPicture
              disableRemotePlayback
              onContextMenu={(e) => e.preventDefault()}
              src={post.video}
              poster={post.videoPoster || post.image || ''}
              className="w-full h-full object-cover"
            />
            <div className="hidden">
              <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2 min-w-0 pointer-events-auto">
                <UserAvatar name={post.author.name} size="sm" />
                <span className="text-sm font-semibold text-white truncate">{post.author.name}</span>
              </Link>
            </div>
            <div className="hidden">
              <Badge label={post.category} variant={post.category} />
              <div className="relative">
                <button
                  onClick={() => setShowMenu(m => !m)}
                  className="p-1.5 rounded-lg bg-black/35 hover:bg-black/55 text-white transition-colors"
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
        ) : post.image ? (
          <div className="relative mb-3 -mx-4 overflow-hidden rounded-[10px] bg-black aspect-video">
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="hidden">
              <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2 min-w-0">
                <UserAvatar name={post.author.name} size="sm" />
                <span className="text-sm font-semibold text-white truncate">{post.author.name}</span>
              </Link>
            </div>
            <div className="hidden">
              <Badge label={post.category} variant={post.category} />
              <div className="relative">
                <button
                  onClick={() => setShowMenu(m => !m)}
                  className="p-1.5 rounded-lg bg-black/35 hover:bg-black/55 text-white transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={showMenu}
                  ref={menuButtonRef}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div role="menu" onKeyDown={handleMenuKeyDown} className="absolute right-0 top-8 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-xl shadow-modal z-10 py-1 min-w-[220px] animate-fade-in">
                    <button onClick={handleSave} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5"><Bookmark className="w-4 h-4" />{post.saved ? 'Remover dos guardados' : 'Guardar post'}</button>
                    <button onClick={() => { navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id); setShowMenu(false); setToast('Link copiado') }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5"><Link2 className="w-4 h-4" />Copiar link</button>
                    {!isOwnPost && <button onClick={() => { toggleConnect(post.author.id); setShowMenu(false); setToast(connectedToAuthor ? 'Conexão removida' : 'Conexão enviada') }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">{connectedToAuthor ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}{connectedToAuthor ? 'Remover conexão' : 'Conectar'}</button>}
                    <button onClick={() => { setHidden(true); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5"><EyeOff className="w-4 h-4" />Ocultar post</button>
                    <div className="my-1 border-t border-neutral-100 dark:border-[#2a2a2a]" />
                    <button onClick={() => { alert('Post reportado. Obrigado pelo feedback.'); setShowMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-red-500 flex items-center gap-2.5"><Flag className="w-4 h-4" />Reportar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {(() => {
          const reactions = post.reactions || {}
          const total = Object.values(reactions).reduce((a, b) => a + b, 0)
          if (total === 0) return null

          const topReactions = REACTIONS
            .filter(r => (reactions[r.key] || 0) > 0)
            .sort((a, b) => (reactions[b.key] || 0) - (reactions[a.key] || 0))
            .slice(0, 3)

          return (
            <div className="flex items-center justify-between mb-2 px-1">
              <button 
                onClick={() => setShowReactionsModal(true)}
                className="flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                {/* Círculos de ícone sobrepostos */}
                <div className="flex -space-x-1.5">
                  {topReactions.map(r => {
                    const Icon = REACTION_ICONS[r.icon]
                    return (
                      <span
                        key={r.key}
                        className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1e1e1e]"
                        style={{ backgroundColor: r.color }}
                      >
                        <Icon 
                          className="w-3 h-3 text-white" 
                          fill={r.key === 'love' ? 'currentColor' : 'none'}
                          strokeWidth={2.5}
                        />
                      </span>
                    )
                  })}
                </div>
                <span className="text-xs text-neutral-700 dark:text-[#aeaeb2] font-medium">{total}</span>
              </button>
              {(post.commentCount || 0) > 0 && (
                <button onClick={() => setShowComments(true)} className="text-xs text-neutral-400 dark:text-[#aeaeb2] hover:underline">
                  {post.commentCount} comentário{post.commentCount !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          )
        })()}

        {/* Actions — Gostar · Comentar · Partilhar */}
        <div className="flex items-center pt-2 border-t border-neutral-100 dark:border-transparent">
          {/* Gostar */}
          <ReactionBar reactions={post.reactions} myReaction={post.myReaction} onReact={handleReact} />

          {/* Comentar */}
          <button
            onClick={() => setShowComments(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors flex-1 justify-center ${
              showComments ? 'text-brand-500' : 'text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]'
            }`}
          >
            <MessageCircle className="w-[19px] h-[19px]" strokeWidth={1.8} />
          </button>

          {/* Partilhar */}
          <div className="relative flex-1" ref={shareRef}>
            <button
              onClick={() => setShowShare(s => !s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors w-full justify-center ${
                showShare ? 'text-brand-500' : 'text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]'
              }`}
            >
              <Repeat2 className="w-[19px] h-[19px]" strokeWidth={1.8} />
            </button>
            {showShare && (
              <div className="absolute bottom-10 left-0 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#282828] rounded-xl shadow-modal z-20 py-1 min-w-[200px] animate-fade-in">
                <button
                  onClick={() => { handleShare(); setShowShare(false); setToast('Post partilhado no feed') }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-neutral-700 dark:text-[#f5f5f7] flex items-center gap-2.5"
                >
                  <Repeat2 className="w-4 h-4" />
                  Recompartilhar
                </button>
                <button
                  onClick={() => { setShowShare(false); setShowShareModal(true) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-[#282828] text-neutral-700 dark:text-[#f5f5f7] flex items-center gap-2.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Recompartilhar com comentário
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section - Inline below post */}
        {showComments && <CommentsSection post={post} />}
      </article>

      {showSaveModal && (
        <SaveToCollectionModal post={post} onClose={() => { setShowSaveModal(false); setToast('Post guardado') }} />
      )}

      {showReactionsModal && (
        <ReactionsModal post={post} onClose={() => setShowReactionsModal(false)} />
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
