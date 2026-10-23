import clsx from 'clsx'

const variants = {
  primary: 'text-white shadow-sm hover:shadow-md active:scale-95',
  secondary: 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm hover:shadow-md active:scale-95',
  ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#162240] text-neutral-700 dark:text-[#e8ecf4] active:scale-95',
  outline: 'border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 active:scale-95',
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
  const isPrimary = variant === 'primary'

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      style={isPrimary ? {
        background: 'linear-gradient(135deg, #1D6AFF 0%, #00A3FF 100%)',
        boxShadow: '0 4px 15px rgba(29,106,255,0.35)',
      } : undefined}
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
