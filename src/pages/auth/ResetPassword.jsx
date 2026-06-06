import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import ErrorAlert from '../../components/ui/ErrorAlert'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Extrair token e email da URL
  useEffect(() => {
    const urlToken = searchParams.get('token')
    const urlEmail = searchParams.get('email')

    if (!urlToken || !urlEmail) {
      setError('Link inválido. Falta token ou email.')
      return
    }

    setToken(urlToken)
    setEmail(urlEmail)
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!newPassword || !confirmPassword) {
      setError('Preenche todos os campos')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (newPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email, token, newPassword)
      setSuccess(true)
      
      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err || 'Erro ao resetar senha')
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#000000] flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">Link Inválido</h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                Este link de recuperação é inválido ou expirou. Tenta novamente.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="mt-4 w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-[#18191a] dark:to-[#0f1419] flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {/* Card */}
        <div className="bg-white dark:bg-[#242526] rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <Lock className="w-12 h-12 text-white mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white">Resetar Senha</h1>
            <p className="text-blue-100 text-sm mt-1">Entra a tua nova senha</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <ErrorAlert message={error} onClose={() => setError('')} />
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-200">Sucesso!</h3>
                  <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                    Senha alterada com sucesso. Redirecionando para login...
                  </p>
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nova Senha"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <Input
                  label="Confirmar Senha"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  className="mt-6"
                >
                  Resetar Senha
                </Button>

                <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                  A senha deve ter pelo menos 8 caracteres
                </p>
              </form>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-neutral-200 dark:border-[#3a3b3c]">
              <button
                onClick={() => navigate('/login')}
                className="w-full text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>Problemas? Tenta fazer login novamente ou contacta o suporte.</p>
        </div>
      </div>
    </div>
  )
}
