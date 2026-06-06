/**
 * EmptyState — componente reutilizável para estados vazios
 * Props: icon (emoji string), title, subtitle, action (node), illustration (boolean)
 */
export default function EmptyState({ icon = '📭', title, subtitle, action, illustration = true }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {illustration ? (
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full bg-primary-100/80 dark:bg-white/10" />
          <div className="absolute -right-2 top-2 w-6 h-6 rounded-full bg-accent-100 dark:bg-primary-900/40" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">{icon}</div>
        </div>
      ) : (
        <span className="text-5xl mb-4 select-none">{icon}</span>
      )}
      <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-base">{title}</p>
      {subtitle && <p className="text-sm text-neutral-400 mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
