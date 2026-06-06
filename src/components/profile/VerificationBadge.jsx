import { BadgeCheck } from 'lucide-react'
import { getUniversityTag } from '../../utils/university'

/**
 * Badge de verificação académica.
 * showLabel=true  → "✓ Verificado — UEM" (para perfil)
 * showLabel=false → só ícone ✓ (para listagens)
 */
export default function VerificationBadge({ university, size = 'sm', showLabel = false }) {
  const tag = getUniversityTag(university)
  if (!tag) return null

  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'

  if (!showLabel) {
    return (
      <BadgeCheck
        className={`${iconSize} text-secondary-500 flex-shrink-0`}
        title={`Verificado — ${tag}`}
      />
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-600 dark:text-secondary-400">
      <BadgeCheck className={`${iconSize} flex-shrink-0`} />
      Verificado — {tag}
    </span>
  )
}
