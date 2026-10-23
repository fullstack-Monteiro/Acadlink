import { useState } from 'react'
import { X, AlertTriangle, Send } from 'lucide-react'

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam', description: 'Conteúdo comercial não solicitado' },
  { id: 'inappropriate', label: 'Conteúdo inapropriado', description: 'Nudez, violência ou ódio' },
  { id: 'harassment', label: 'Assédio ou bullying', description: 'Insultos ou ameaças' },
  { id: 'misinformation', label: 'Informação falsa', description: 'Desinformação ou fake news' },
  { id: 'copyright', label: 'Violação de direitos autorais', description: 'Uso não autorizado de conteúdo' },
  { id: 'scam', label: 'Fraude ou burla', description: 'Tentativa de enganar utilizadores' },
  { id: 'other', label: 'Outro', description: 'Outro motivo não listado' }
]

export default function ReportReelModal({ reel, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) return

    setIsSubmitting(true)
    try {
      await onSubmit?.(reel.id, selectedReason, description)
      onClose()
    } catch (err) {
      console.error('Erro ao reportar:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[110] max-w-lg mx-auto bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-[#282828]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Reportar reel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm text-neutral-600 dark:text-[#aeaeb2] mb-4">
            Ajuda-nos a manter a comunidade segura. Escolhe o motivo da reportagem:
          </p>

          {/* Reasons List */}
          <div className="space-y-2 mb-4">
            {REPORT_REASONS.map(reason => (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  selectedReason === reason.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                    : 'border-neutral-200 dark:border-[#282828] hover:border-neutral-300 dark:hover:border-[#333333]'
                }`}
              >
                <p className={`text-sm font-semibold ${
                  selectedReason === reason.id
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-neutral-900 dark:text-[#f5f5f7]'
                }`}>
                  {reason.label}
                </p>
                <p className="text-xs text-neutral-500 dark:text-[#636366] mt-0.5">
                  {reason.description}
                </p>
              </button>
            ))}
          </div>

          {/* Additional Info */}
          {selectedReason && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-[#f5f5f7] mb-2">
                Detalhes adicionais (opcional)
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreve o problema com mais detalhe..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-[#282828] text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 dark:placeholder-[#636366] focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-100 dark:border-[#282828]">
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="w-full py-3 rounded-xl bg-red-600 disabled:bg-neutral-300 dark:disabled:bg-[#333333] text-white disabled:text-neutral-400 font-semibold transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>A enviar...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar reportagem</span>
              </>
            )}
          </button>
          <p className="text-xs text-center text-neutral-500 dark:text-[#636366] mt-3">
            As tuas reportagens são anónimas. Vamos analisar em 24-48h.
          </p>
        </div>
      </div>
    </>
  )
}
