import { forwardRef } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import clsx from 'clsx'

const ValidatedInput = forwardRef(function ValidatedInput({
  label,
  error,
  status, // 'valid', 'invalid', 'warning'
  icon,
  className,
  type = 'text',
  showStatus = true,
  loading = false,
  ...props
}, ref) {
  const getStatusColor = () => {
    if (status === 'valid') return 'border-green-500 focus:ring-green-500'
    if (status === 'invalid') return 'border-red-500 focus:ring-red-500'
    if (status === 'warning') return 'border-yellow-500 focus:ring-yellow-500'
    return 'border-neutral-200 dark:border-[#3a3b3c]'
  }

  const getStatusIcon = () => {
    if (!showStatus) return null
    if (status === 'valid') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'invalid') return <X className="w-5 h-5 text-red-500" />
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-500" />
    return null
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700 dark:text-[#e4e6ea]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8a8d91] w-4 h-4">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] placeholder-neutral-400 dark:placeholder-[#8a8d91] transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-10 pr-10 py-2.5' : 'px-4 py-2.5',
            getStatusColor(),
            className
          )}
          disabled={loading}
          {...props}
        />
        {getStatusIcon() && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getStatusIcon()}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  )
})

export default ValidatedInput
