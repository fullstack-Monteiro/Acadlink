 import { getUniversityTag } from '../../utils/university'

/**
 * Etiqueta discreta que exibe a sigla da universidade do estudante.
 * Retorna null se university for null/undefined.
 */
export default function UniversityTag({ university, size = 'xs' }) {
  const tag = getUniversityTag(university)
  if (!tag) return null

  return (
    <span className={`
      inline-flex items-center px-1.5 py-0.5 rounded-md font-medium
      bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-700 dark:text-white
      ${size === 'xs' ? 'text-[10px]' : 'text-xs'}
    `}>
      {tag}
    </span>
  )
}
