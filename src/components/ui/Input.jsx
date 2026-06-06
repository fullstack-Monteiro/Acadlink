import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(function Input({
  label,
  error,
  icon,
  className,
  type = 'text',
  ...props
}, ref) {
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
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-neutral-200 dark:border-[#3a3b3c]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export default Input


export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700 dark:text-[#e4e6ea]">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full rounded-xl border bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] px-4 py-2.5 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-red-400' : 'border-neutral-200 dark:border-[#3a3b3c]',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
