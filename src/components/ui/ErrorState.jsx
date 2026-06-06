import { useEffect } from 'react'
import { reportUiError } from '../../utils/reportUiError'

export default function ErrorState({
  title = 'Ocorreu um erro',
  subtitle = 'Nao foi possivel carregar esta tela agora.',
  onRetry,
  scope = 'unknown',
  meta,
}) {
  useEffect(() => {
    reportUiError({ scope, title, subtitle, meta })
  }, [scope, title, subtitle, meta])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-5">
        <div className="w-24 h-24 rounded-full bg-red-100/80 dark:bg-red-950/30" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">⚠️</div>
      </div>
      <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-base">{title}</p>
      <p className="text-sm text-neutral-400 mt-1 max-w-xs">{subtitle}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
