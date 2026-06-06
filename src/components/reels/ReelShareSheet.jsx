import { useState } from 'react'
import { X, Copy, Check, MessageCircle, Share2 } from 'lucide-react'

/**
 * ReelShareSheet Component
 * 
 * Bottom sheet modal para compartilhar reels
 * Suporta compartilhamento interno (DMs) e cópia de link
 * 
 * Features:
 * - Compartilhar via DM
 * - Copiar link para clipboard
 * - Compartilhar em plataformas externas
 * - Feedback visual de sucesso
 */
export default function ReelShareSheet({ 
  reel, 
  isOpen, 
  onClose,
  onShareDM,
  onShareExternal
}) {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const getReelUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/reels/${reel?.id}`
    }
    return ''
  }

  const getShareText = () => {
    return `Confira este reel: "${reel?.description?.substring(0, 50)}..."`
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleCopyLink = async () => {
    try {
      const url = getReelUrl()
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar link:', error)
    }
  }

  const handleShareDM = async () => {
    setIsSharing(true)
    try {
      await onShareDM?.(reel)
    } catch (error) {
      console.error('Erro ao compartilhar via DM:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleShareExternal = async (platform) => {
    setIsSharing(true)
    try {
      const url = getReelUrl()
      const text = getShareText()
      let shareUrl = ''

      switch (platform) {
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
          break
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
          break
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          break
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          break
        default:
          return
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400')
      }

      await onShareExternal?.(reel, platform)
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    } finally {
      setIsSharing(false)
      onClose()
    }
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
      <div className="relative w-full bg-white dark:bg-[#242526] rounded-t-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-[#3a3b3c]">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Compartilhar
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
            aria-label="Fechar compartilhamento"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-[#b0b3b8]" />
          </button>
        </div>

        {/* Share Options */}
        <div className="px-4 py-4 space-y-2">
          {/* Share via DM */}
          <button
            onClick={handleShareDM}
            disabled={isSharing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900 dark:text-white">Enviar via Mensagem</p>
              <p className="text-xs text-neutral-500 dark:text-[#b0b3b8]">Compartilhar com amigos</p>
            </div>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              {copied ? (
                <Check className="w-5 h-5 text-blue-500" />
              ) : (
                <Copy className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900 dark:text-white">
                {copied ? 'Link copiado!' : 'Copiar link'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-[#b0b3b8]">
                {copied ? 'Pronto para compartilhar' : 'Copiar para clipboard'}
              </p>
            </div>
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-neutral-200 dark:border-[#3a3b3c]" />

          {/* External Platforms */}
          <p className="text-xs font-medium text-neutral-500 dark:text-[#b0b3b8] px-4 py-2">
            Compartilhar em
          </p>

          {/* WhatsApp */}
          <button
            onClick={() => handleShareExternal('whatsapp')}
            disabled={isSharing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900 dark:text-white">WhatsApp</p>
            </div>
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleShareExternal('twitter')}
            disabled={isSharing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">
              <span className="text-lg">𝕏</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900 dark:text-white">X (Twitter)</p>
            </div>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShareExternal('facebook')}
            disabled={isSharing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <span className="text-lg">f</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900 dark:text-white">Facebook</p>
            </div>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleShareExternal('linkedin')}
            disabled={isSharing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-blue-700/20 flex items-center justify-center">
              <span className="text-lg">in</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900 dark:text-white">LinkedIn</p>
            </div>
          </button>
        </div>

        {/* Close Button */}
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-[#3a3b3c]">
          <button
            onClick={onClose}
            className="w-full py-2 text-neutral-600 dark:text-[#b0b3b8] hover:text-neutral-900 dark:hover:text-white font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
