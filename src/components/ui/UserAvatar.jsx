import clsx from 'clsx'

const DEFAULT_AVATAR_COLOR = 'bg-secondary-600'

function getColor(name = '') {
  return DEFAULT_AVATAR_COLOR
}

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const sizes = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

export default function UserAvatar({ name, src, size = 'md', className, online }) {
  return (
    <div className={clsx('relative flex-shrink-0', className)}>
      <div className={clsx(
        'rounded-full flex items-center justify-center font-semibold overflow-hidden text-white',
        sizes[size],
        !src && getColor(name)
      )}>
        {src
          ? <img src={src} alt={name} className="w-full h-full object-cover" />
          : <span>{getInitials(name)}</span>
        }
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary-500 border-2 border-white dark:border-neutral-900 rounded-full" />
      )}
    </div>
  )
}
