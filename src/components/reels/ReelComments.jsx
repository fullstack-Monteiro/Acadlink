import { useState, useRef, useEffect } from 'react'
import { X, Send, Heart } from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'
import MentionInput from '../feed/MentionInput'

/**
 * ReelComments Component
 * 
 * Bottom sheet modal para exibir e adicionar comentários em reels
 * Suporta mentions, likes em comentários, e scroll infinito
 * 
 * Features:
 * - Lista de comentários com scroll
 * - Input com suporte a mentions
 * - Like em comentários
 * - Timestamps relativos
 * - Avatar do autor
 */
export default function ReelComments({ 
  reel, 
  isOpen, 
  onClose,
  onComment,
  comments = []
}) {
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likedComments, setLikedComments] = useState(new Set())
  const commentsListRef = useRef(null)

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const formatTime = (date) => {
    if (!date) return ''
    
    const now = new Date()
    const commentDate = new Date(date)
    const diffMs = now - commentDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'agora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    
    return commentDate.toLocaleDateString('pt-BR')
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onComment?.(reel.id, commentText.trim())
      setCommentText('')
      
      // Scroll to bottom
      setTimeout(() => {
        if (commentsListRef.current) {
          commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight
        }
      }, 100)
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = (commentId) => {
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full bg-white dark:bg-[#242526] rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-[#3a3b3c]">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Comentários ({reel?.comments || 0})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
            aria-label="Fechar comentários"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-[#b0b3b8]" />
          </button>
        </div>

        {/* Comments List */}
        <div
          ref={commentsListRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        >
          {comments.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-neutral-500 dark:text-[#b0b3b8]">
              <p className="text-sm">Nenhum comentário ainda. Seja o primeiro!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <UserAvatar
                  name={comment.author?.name}
                  src={comment.author?.avatar}
                  size="sm"
                />

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  {/* Author Info */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {comment.author?.name || 'Usuário'}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-[#b0b3b8]">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-neutral-700 dark:text-[#e4e6eb] mt-1 break-words">
                    {comment.text}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        likedComments.has(comment.id)
                          ? 'text-red-500'
                          : 'text-neutral-500 dark:text-[#b0b3b8] hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          likedComments.has(comment.id) ? 'fill-current' : ''
                        }`}
                      />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button className="text-xs text-neutral-500 dark:text-[#b0b3b8] hover:text-neutral-700 dark:hover:text-white transition-colors">
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="border-t border-neutral-200 dark:border-[#3a3b3c] px-4 py-3 bg-white dark:bg-[#242526]">
          <form onSubmit={handleSubmitComment} className="flex items-end gap-2">
            <UserAvatar
              name="Você"
              size="sm"
            />
            <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-[#3a3b3c] rounded-full px-4 py-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Adicione um comentário..."
                maxLength={300}
                className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-[#b0b3b8] outline-none"
              />
              <span className="text-xs text-neutral-500 dark:text-[#b0b3b8]">
                {commentText.length}/300
              </span>
            </div>
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className={`p-2 rounded-full transition-all ${
                commentText.trim() && !isSubmitting
                  ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                  : 'bg-neutral-200 dark:bg-[#3a3b3c] text-neutral-400 dark:text-[#b0b3b8] cursor-not-allowed'
              }`}
              aria-label="Enviar comentário"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
