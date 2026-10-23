import clsx from 'clsx'

/**
 * Skeleton — bloco de loading com efeito shimmer.
 *
 * Props:
 *   className  — largura, altura, border-radius, etc.
 *   circle     — atalho para rounded-full (avatares)
 *
 * Exemplos:
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton circle className="w-10 h-10" />
 *   <Skeleton className="h-3 w-full rounded-full" />
 */
export default function Skeleton({ className = '', circle = false }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'animate-shimmer',
        circle ? 'rounded-full' : 'rounded-lg',
        className
      )}
    />
  )
}

/**
 * SkeletonGroup — wrapper semântico para grupos de skeletons.
 *
 * <SkeletonGroup className="space-y-3 p-4">
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton className="h-3 w-48" />
 * </SkeletonGroup>
 */
export function SkeletonGroup({ children, className = '' }) {
  return (
    <div role="status" aria-label="A carregar..." className={className}>
      {children}
      <span className="sr-only">A carregar...</span>
    </div>
  )
}
