import clsx from 'clsx'

const variants = {
  académico: 'bg-primary-100 text-primary-700 dark:bg-white/10 dark:text-primary-300',
  oportunidade: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
  evento: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  estágio: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  bolsa: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
  concurso: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  default: 'bg-neutral-100 text-neutral-600 dark:bg-[#3a3b3c] dark:text-[#e4e6ea]',
}

export default function Badge({ label, variant }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
      variants[variant] || variants.default
    )}>
      {label}
    </span>
  )
}
