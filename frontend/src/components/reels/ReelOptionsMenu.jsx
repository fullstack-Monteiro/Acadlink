import { Link2, Share2, EyeOff, AlertTriangle, Info, X } from 'lucide-react'

export default function ReelOptionsMenu({ reel, onClose, onOption, onShowToast }) {
  const handleOptionClick = (option) => {
    onOption?.(reel.id, option)
    onClose()
  }

  const handleVibrate = () => {
    // Vibração leve (padrão: 50ms)
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const options = [
    {
      id: 'copy-link',
      icon: Link2,
      label: 'Copiar link',
      description: 'Copiar link do reel',
      action: async () => {
        const url = `${window.location.origin}/reels?id=${reel.id}`
        try {
          await navigator.clipboard.writeText(url)
          handleVibrate()
          onShowToast?.('Link copiado!', 'success')
          handleOptionClick('copy-link')
        } catch (err) {
          console.error('Erro ao copiar:', err)
          onShowToast?.('Erro ao copiar link', 'error')
        }
      }
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Partilhar via...',
      description: 'Partilhar noutras apps',
      action: async () => {
        const url = `${window.location.origin}/reels?id=${reel.id}`
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'AcadLink Reel',
              text: reel.description || 'Vê este reel incrível!',
              url
            })
          } catch (err) {
            console.log('Partilha cancelada')
          }
        } else {
          // Fallback: copiar link
          await navigator.clipboard.writeText(url)
          alert('Link copiado para a área de transferência!')
        }
        handleOptionClick('share')
      }
    },
    {
      id: 'not-interested',
      icon: EyeOff,
      label: 'Não tenho interesse',
      description: 'Ver menos conteúdo assim',
      variant: 'danger',
      action: () => {
        // TODO: Implementar lógica de "não interessado"
        handleOptionClick('not-interested')
      }
    },
    {
      id: 'report',
      icon: AlertTriangle,
      label: 'Reportar',
      description: 'Conteúdo inapropriado ou spam',
      variant: 'danger',
      action: () => {
        handleOptionClick('report')
      }
    },
    {
      id: 'about-account',
      icon: Info,
      label: 'Acerca desta conta',
      description: 'Ver informações do criador',
      action: () => {
        handleOptionClick('about-account')
      }
    }
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white dark:bg-[#1e1e1e] rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#333333]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-[#282828]">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white">
            Opções
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-[#282828] text-neutral-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reel Info */}
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-[#282828]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-[#282828] flex-shrink-0">
              {reel.thumbnail ? (
                <img 
                  src={reel.thumbnail} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 dark:bg-[#282828]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-[#f5f5f7] line-clamp-2">
                {reel.description || 'Sem descrição'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-[#636366] mt-0.5">
                {reel.author?.name || reel.creator?.name || 'Autor desconhecido'}
              </p>
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="px-5 py-3 space-y-1" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          {options.map(option => {
            const Icon = option.icon
            const isDanger = option.variant === 'danger'
            
            return (
              <button
                key={option.id}
                onClick={option.action}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${
                  isDanger
                    ? 'hover:bg-red-50 dark:hover:bg-red-950/20'
                    : 'hover:bg-neutral-50 dark:hover:bg-[#282828]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDanger
                    ? 'bg-red-100 dark:bg-red-950/30'
                    : 'bg-neutral-100 dark:bg-[#282828]'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isDanger
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-neutral-600 dark:text-[#aeaeb2]'
                  }`} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className={`text-sm font-semibold ${
                    isDanger
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-neutral-900 dark:text-[#f5f5f7]'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-[#636366] mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
