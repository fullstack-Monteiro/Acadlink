import { useEffect } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info
  }

  const styles = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    warning: 'bg-amber-500 dark:bg-amber-600',
    info: 'bg-brand-500'
  }

  const Icon = icons[type] || Check

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-toast-in">
      <div className={`${styles[type]} text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 min-w-[200px] max-w-[90vw]`}>
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
