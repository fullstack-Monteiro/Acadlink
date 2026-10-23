import { AlertCircle, X } from 'lucide-react'

export default function ErrorAlert({ message, onClose, type = 'error', action }) {
  if (!message) return null

  const bgColor = type === 'error' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
  const borderColor = type === 'error' ? 'border-red-200 dark:border-red-800' : 'border-yellow-200 dark:border-yellow-800'
  const textColor = type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'
  const iconColor = type === 'error' ? 'text-red-500' : 'text-yellow-500'

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300`}>
      <AlertCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className={`text-xs font-medium mt-2 ${textColor} hover:underline`}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
