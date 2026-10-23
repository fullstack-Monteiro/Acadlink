import { ThumbsUp } from 'lucide-react'

/**
 * LikeIcon — ThumbsUp branco em círculo gradiente azul estilo Facebook.
 *
 * Props:
 *   size  — número em px (default 20)
 *   active — bool: quando true mostra gradiente azul, quando false mostra cinza neutro
 *   className — classes extras no wrapper
 */
export default function LikeIcon({ size = 20, active = true, className = '' }) {
  const inner = Math.round(size * 0.55)

  if (!active) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-neutral-200 dark:bg-[#3a3a3a] flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <ThumbsUp
          style={{ width: inner, height: inner }}
          className="text-neutral-500 dark:text-[#636366]"
          fill="currentColor"
          strokeWidth={0}
        />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #42a5f5 0%, #1877F2 60%, #0d5fd4 100%)',
      }}
    >
      <ThumbsUp
        style={{ width: inner, height: inner }}
        className="text-white"
        fill="currentColor"
        strokeWidth={0}
      />
    </span>
  )
}
