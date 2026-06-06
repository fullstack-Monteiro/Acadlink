import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function BackButton({ label = 'Voltar', to }) {
  const navigate = useNavigate()
  
  // Se não tem label, é para usar inline ao lado do título
  const isInline = !label
  
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className={`flex items-center gap-2 text-sm text-neutral-600 dark:text-white hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors ${isInline ? '' : 'mb-5'}`}
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
