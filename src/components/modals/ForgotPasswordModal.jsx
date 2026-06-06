import { useState } from 'react'
import { X, Mail, ChevronLeft } from 'lucide-react'
import { isValidEmail } from '../../utils/validation'
import api from '../../services/api'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ErrorAlert from '../ui/ErrorAlert'

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState('email') // email, sent, reset
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Preenche o email')
      return
    }

    if (!isValidEmail(email)) {
      setError('Email inválido')
      return
    }

    setLoading(true)
    try {
      await api.post('/users/forgot_password/', { email })
      setSuccess('Email de recuperação enviado! Verifica a tua caixa de entrada.')
      setStep('sent')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao enviar email')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token || !newPassword || !confirmPassword) {
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
      await api.post('/users/reset_password/', { 
        email, 
        token, 
        new_password: newPassword 
      })
      setSuccess('Senha alterada com sucesso! Podes fazer login agora.')
      setTimeout(() => {
        onClose()
        setStep('email')
        setEmail('')
        setToken('')
        setNewPassword('')
        setConfirmPassword('')
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao resetar senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#242526] rounded-2xl max-w-sm w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-[#3a3b3c]">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {step === 'email' ? 'Recuperar Senha' : 'Resetar Senha'}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && <ErrorAlert message={error} onClose={() => setError('')} />}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-800 dark:text-green-200">
              {success}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Entra o teu email e enviaremos um código de recuperação
              </p>
              <Input
                label="Email"
                type="email"
                placeholder="exemplo@gmail.com"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" fullWidth loading={loading}>
                Enviar Código
              </Button>
            </form>
          )}

          {step === 'sent' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Entra o token que recebeste no email e a tua nova senha
              </p>
              <Input
                label="Token de Recuperação"
                type="text"
                placeholder="token-aqui"
                value={token}
                onChange={e => setToken(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Nova Senha"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" fullWidth loading={loading}>
                Resetar Senha
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setToken('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setError('')
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
