import { useState } from 'react'
import { X, Flag, AlertCircle } from 'lucide-react'

/**
 * ReelModerationSheet Component
 * 
 * Bottom sheet para reportar reels inapropriados
 * Permite seleção de motivo e comentário adicional
 * 
 * Features:
 * - Múltiplos motivos de reporte
 * - Comentário adicional
 * - Confirmação de envio
 * - Feedback visual
 */
export default function ReelModerationSheet({ 
  reel, 
  isOpen, 
  onClose,
  onReport
}) {
  const [selectedReason, setSelectedReason] = useState(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ══════════════════════════════════════════════════════════════════════════════
  // REPORT REASONS
  // ══════════════════════════════════════════════════════════════════════════════

  const reportReasons = [
    {
      id: 'inappropriate',
      label: 'Conteúdo Inapropriado',
      description: 'Violência, abuso ou conteúdo sexual'
    },
    {
      id: 'spam',
      label: 'Spam',
      description: 'Conteúdo repetitivo ou enganoso'
    },
    {
      id: 'harassment',
      label: 'Assédio',
      description: 'Bullying ou ameaças'
    },
    {
      id: 'misinformation',
      label: 'Desinformação',
      description: 'Informações falsas ou enganosas'
    },
    {
      id: 'copyright',
      label: 'Violação de Direitos Autorais',
      description: 'Conteúdo protegido por direitos autorais'
    },
    {
      id: 'other',
      label: 'Outro',
      description: 'Outro motivo'
    }
  ]

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleSubmitReport = async () => {
    if (!selectedReason) return

    setIsSubmitting(true)
    try {
      await onReport?.({
        reelId: reel.id,
        reason: selectedReason,
        comment: comment.trim()
      })
      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setSelectedReason(null)
        setComment('')
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error('Erro ao enviar reporte:', error)
    } finally {
      setIsSubmitting(false)
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
      <div className="relative w-full bg-white dark:bg-[#242526] rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-[#3a3b3c]">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Reportar Reel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-[#b0b3b8]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                Reporte Enviado
              </h3>
              <p className="text-sm text-neutral-600 dark:text-[#b0b3b8]">
                Obrigado por ajudar a manter a comunidade segura
              </p>
            </div>
          ) : (
            <>
              {/* Warning */}
              <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg border border-yellow-200 dark:border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Reportes falsos podem resultar em restrições na sua conta
                </p>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Por que você está reportando este reel?
                </p>
                {reportReasons.map(reason => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedReason === reason.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                        : 'border-neutral-200 dark:border-[#3a3b3c] hover:border-neutral-300 dark:hover:border-[#4a4b4c]'
                    }`}
                  >
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {reason.label}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-[#b0b3b8] mt-1">
                      {reason.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Comment */}
              {selectedReason && (
                <div>
                  <label className="text-sm font-medium text-neutral-900 dark:text-white block mb-2">
                    Detalhes adicionais (opcional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Descreva o problema..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2 bg-neutral-100 dark:bg-[#3a3b3c] text-neutral-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mt-1">
                    {comment.length}/500
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="border-t border-neutral-200 dark:border-[#3a3b3c] px-4 py-3 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-[#3a3b3c] text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-[#4a4b4c] transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitReport}
              disabled={!selectedReason || isSubmitting}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedReason && !isSubmitting
                  ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                  : 'bg-neutral-200 dark:bg-[#3a3b3c] text-neutral-400 dark:text-[#b0b3b8] cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Reportar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
