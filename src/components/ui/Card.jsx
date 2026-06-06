import clsx from 'clsx'

export default function Card({ children, className, hover, glass = false, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200',
        glass 
          ? 'bg-white/80 dark:bg-[#242526]/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg'
          : 'bg-white dark:bg-[#242526] border border-neutral-200 dark:border-[#3a3b3c] shadow-card',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
