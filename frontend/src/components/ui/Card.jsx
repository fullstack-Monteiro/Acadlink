import clsx from 'clsx'

export default function Card({ children, className, hover, glass = false, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200',
        glass
          ? 'bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/20 dark:border-[#333333]/60 shadow-lg'
          : 'bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#333333] shadow-card',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
