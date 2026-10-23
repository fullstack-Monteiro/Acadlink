import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000] flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo — tamanho Facebook */}
        <div className="flex flex-col items-center mb-10 animate-slide-up">
          <img src="/logo.png" alt="AcadLink" className="w-64 max-w-[70vw] h-auto object-contain" />
        </div>

        {/* Actions */}
        <div className="w-full max-w-xs flex flex-col gap-3 animate-fade-in">
          <Link to="/register">
            <Button fullWidth size="lg">Criar conta</Button>
          </Link>
          <Link to="/login">
            <Button fullWidth size="lg" variant="outline">Já tenho conta</Button>
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-neutral-400 pb-6">
        © 2026 AcadLink · Moçambique
      </p>
    </div>
  )
}
