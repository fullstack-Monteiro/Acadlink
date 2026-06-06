import clsx from 'clsx'

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm hover:shadow-md active:scale-95',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 active:bg-secondary-800 text-white shadow-sm hover:shadow-md active:scale-95',
  ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#404142] text-neutral-700 dark:text-[#e4e6ea] active:scale-95',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-95',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md active:scale-95',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  icon,
  fullWidth,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
