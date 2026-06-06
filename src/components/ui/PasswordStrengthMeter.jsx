import { validatePassword } from '../../utils/validation'

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null

  const { score, level, feedback } = validatePassword(password)
  const maxScore = 6

  const colors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  }

  const labels = {
    weak: 'Fraca',
    medium: 'Média',
    strong: 'Forte'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Força da senha
        </span>
        <span className={`text-xs font-medium ${
          level === 'weak' ? 'text-red-500' :
          level === 'medium' ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {labels[level]}
        </span>
      </div>

      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${colors[level]}`}
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>

      {feedback.length > 0 && (
        <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          {feedback.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="text-red-500">•</span> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
