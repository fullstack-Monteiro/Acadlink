import { useState, useEffect, useRef } from 'react'
import { X, Send, SmilePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReels } from '../../context/ReelsContext'
import UserAvatar from '../ui/UserAvatar'
import LikeIcon from '../ui/LikeIcon'

const EMOJIS = ['😂', '❤️', '🔥', '👏', '😮', '😢', '💯', '🎉', '👍', '😍']

// Comentários mock para demonstração (fallback)
const MOCK_COMMENTS = [
  { id: 1, author: { name: 'Ana Paula',      id: 2 }, text: 'Muito bom! Adorei o conteúdo 🔥',        time: '2m',    likes: 12, replies: [] },
  { id: 2, author: { name: 'Rafael Chissano',id: 3 }, text: 'Isso mesmo! Continua assim 💯',           time: '5m',    likes: 8,  replies: [] },
  { id: 3, author: { name: 'Bruno Mucavele', id: 4 }, text: 'Partilhei com toda a turma 😂',            time: '12m',   likes: 3,  replies: [] },
  { id: 4, author: { name: 'Letícia Sumbana',id: 5 }, text: 'Precisava mesmo disto para o exame! 👏',  time: '1h',    likes: 21, replies: [] },
  { id: 5, author: { name: 'Daniel Massingue',id:6 }, text: 'Explica tão bem, obrigado!',               time: '2h',    likes: 6,  replies: [] },
]

export default function ReelComments({ reelId, onClose, onAddComment }) {
  const { user }            = useAuth()
  const { reels }           = useReels()
  const navigate            = useNavigate()
  const [comments, setComments] = useState([])
  const [input, setInput]   = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [likedComments, setLikedComments] = useState([])
  const [replyingTo, setReplyingTo] = useState(null)
  const [expandedReplies, setExpandedReplies] = useState({}) // Controla quais comentários têm replies expandidas
  const inputRef            = useRef(null)
  const listRef             = useRef(null)

  // Carregar comentários do reel actual
  useEffect(() => {
    const reel = reels.find(r => r.id === reelId)
    if (reel && reel.comments && reel.comments.length > 0) {
      // Usar comentários reais do contexto
      const formattedComments = reel.comments.map(c => ({
        id: c.id,
        author: { name: c.author?.name || c.author?.username || 'Utilizador', id: c.author?.id || 0 },
        text: c.content || c.text,
        time: formatTime(c.created_at),
        likes: c.likes || 0,
        replies: c.replies || []
      }))
      setComments(formattedComments)
    } else {
      // Usar comentários mock como fallback
      setComments(MOCK_COMMENTS)
    }
  }, [reelId, reels])

  // Formatar tempo relativo
  const formatTime = (dateString) => {
    if (!dateString) return 'agora'
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // segundos
    
    if (diff < 60) return 'agora'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  // focar input ao abrir
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleSend = () => {
    if (!input.trim()) return
    
    if (replyingTo) {
      // Adicionar resposta ao comentário
      const reply = {
        id:     Date.now(),
        author: { name: user?.name || 'Tu', id: user?.id || 0 },
        text:   input.trim(),
        time:   'agora',
        likes:  0,
        replyTo: replyingTo.author.name, // Guardar nome da pessoa respondida
        replyToId: replyingTo.author.id,  // Guardar ID da pessoa respondida
      }
      setComments(prev => prev.map(c =>
        c.id === replyingTo.id
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      ))
      setReplyingTo(null)
    } else {
      // Adicionar comentário novo
      const novo = {
        id:     Date.now(),
        author: { name: user?.name || 'Tu', id: user?.id || 0 },
        text:   input.trim(),
        time:   'agora',
        likes:  0,
        replies: [],
      }
      setComments(prev => [...prev, novo])
      onAddComment?.(reelId, input.trim())
    }
    
    setInput('')
    setShowEmojis(false)
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  const handleReply = (comment) => {
    setReplyingTo(comment)
    setInput(`@${comment.author.name} `)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setInput('')
  }

  const handleMentionClick = (authorId, authorName) => {
    // Fechar painel de comentários
    onClose?.()
    // Navegar para o perfil
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
    setComments(prev => prev.map(c =>
      c.id === id
        ? { ...c, likes: likedComments.includes(id) ? c.likes - 1 : c.likes + 1 }
        : c
    ))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={onClose}
      />

      {/* Painel */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col bg-white dark:bg-[#1e1e1e] rounded-t-3xl max-h-[75vh] animate-slide-up">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#333333]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-[#282828]">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white">
            {comments.length} comentários
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de comentários */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-5 py-3 space-y-4"
        >
          {comments.map(c => (
            <div key={c.id} className="space-y-3">
              {/* Comentário Principal */}
              <div className="flex items-start gap-3">
                <UserAvatar name={c.author.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="bg-neutral-100 dark:bg-[#282828] rounded-2xl rounded-tl-sm px-3 py-2.5">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-[#f5f5f7] mb-0.5">
                      {c.author.name}
                    </p>
                    <p className="text-sm text-neutral-800 dark:text-[#f5f5f7] leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <span className="text-xs text-neutral-400 dark:text-[#636366]">{c.time}</span>
                    <button
                      onClick={() => toggleLike(c.id)}
                      className="flex items-center gap-1 text-xs font-semibold transition-colors text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]"
                    >
                      <LikeIcon size={16} active={likedComments.includes(c.id)} />
                      {c.likes > 0 && <span className={likedComments.includes(c.id) ? 'text-blue-500' : ''}>{c.likes}</span>}
                    </button>
                    <button
                      onClick={() => handleReply(c)}
                      className="text-xs font-semibold text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2] transition-colors"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              </div>

              {/* Respostas (indentadas) */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-12 space-y-3">
                  {/* Botão "Ver mais respostas" quando há mais de 2 e não está expandido */}
                  {c.replies.length > 2 && !expandedReplies[c.id] && (
                    <button
                      onClick={() => toggleRepliesExpanded(c.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-[#636366] hover:text-neutral-700 dark:hover:text-[#aeaeb2] transition-colors py-1"
                    >
                      <div className="w-8 h-px bg-neutral-300 dark:bg-[#333333]" />
                      <span>Ver mais {c.replies.length - 2} {c.replies.length - 2 === 1 ? 'resposta' : 'respostas'}</span>
                    </button>
                  )}

                  {/* Mostrar apenas 2 respostas se não expandido, todas se expandido */}
                  {(expandedReplies[c.id] ? c.replies : c.replies.slice(-2)).map(r => (
                    <div key={r.id} className="flex items-start gap-3">
                      <UserAvatar name={r.author.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="bg-neutral-100 dark:bg-[#282828] rounded-2xl rounded-tl-sm px-3 py-2.5">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-[#f5f5f7] mb-0.5">
                            {r.author.name}
                          </p>
                          <p className="text-sm text-neutral-800 dark:text-[#f5f5f7] leading-relaxed">
                            {r.replyTo && (
                              <button
                                onClick={() => handleMentionClick(r.replyToId, r.replyTo)}
                                className="font-semibold text-brand-500 hover:underline cursor-pointer"
                              >
                                @{r.replyTo}
                              </button>
                            )}
                            {r.replyTo && ' '}
                            {r.text.startsWith(`@${r.replyTo}`) ? r.text.slice(r.replyTo.length + 2) : r.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 px-1">
                          <span className="text-xs text-neutral-400 dark:text-[#636366]">{r.time}</span>
                          <button
                            onClick={() => toggleLike(r.id)}
                            className="flex items-center gap-1 text-xs font-semibold transition-colors text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2]"
                          >
                            <LikeIcon size={16} active={likedComments.includes(r.id)} />
                            {r.likes > 0 && <span className={likedComments.includes(r.id) ? 'text-blue-500' : ''}>{r.likes}</span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botão "Ocultar respostas" quando expandido */}
                  {c.replies.length > 2 && expandedReplies[c.id] && (
                    <button
                      onClick={() => toggleRepliesExpanded(c.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-[#636366] hover:text-neutral-700 dark:hover:text-[#aeaeb2] transition-colors py-1"
                    >
                      <div className="w-8 h-px bg-neutral-300 dark:bg-[#333333]" />
                      <span>Ocultar respostas</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Picker de emojis */}
        {showEmojis && (
          <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-neutral-100 dark:border-[#282828]">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setInput(prev => prev + e)}
                className="text-2xl hover:scale-125 transition-transform active:scale-95"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="flex flex-col gap-2 px-4 py-3 border-t border-neutral-100 dark:border-[#282828]"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {/* Indicador de resposta */}
          {replyingTo && (
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 dark:bg-[#141414] rounded-lg">
              <p className="text-xs text-neutral-600 dark:text-[#aeaeb2]">
                Respondendo a <span className="font-semibold text-brand-500">@{replyingTo.author.name}</span>
              </p>
              <button
                onClick={cancelReply}
                className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-[#aeaeb2] transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <UserAvatar name={user?.name} size="sm" />

            <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-[#282828] rounded-full px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={replyingTo ? `Responder a ${replyingTo.author.name}…` : 'Adiciona um comentário…'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 dark:placeholder-[#636366] focus:outline-none"
              />
              <button
                onClick={() => setShowEmojis(s => !s)}
                className={`transition-colors ${showEmojis ? 'text-brand-500' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-[#aeaeb2]'}`}
                aria-label="Emojis"
              >
                <SmilePlus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all active:scale-95"
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
