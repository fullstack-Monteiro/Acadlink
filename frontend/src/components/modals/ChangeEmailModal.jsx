import { useState } from 'react'
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../services/api'

const INSTITUTIONAL_DOMAINS = [
  'uem.ac.mz',
  'uem.mz',
  'unizambeze.ac.mz',
  'ujc.ac.mz',
  'ustm.ac.mz',
  'ucm.ac.mz',
  'unilúrio.ac.mz',
  'ispm.ac.mz',
  'ispg.ac.mz',
]

export default function ChangeEmailModal({ isOpen, onClose, currentEmail, onSuccess }) {
  const [step, setStep] = useState(1) // 1: email, 2: código, 3: sucesso
  const [form, setForm] = useState({
    newEmail: '',
    code: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setStep(1)
    setForm({ newEmail: '', code: '' })
    setErrors({})
    onClose()
  }

  const validateEmail = () => {
    const newErrors = {}
    const email = form.newEmail.trim().toLowerCase()

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!email.includes('@')) {
      newErrors.email = 'Email inválido'
    } else {
      const domain = email.split('@')[1]
      const isInstitutional = INSTITUTIONAL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))
      
      if (!isInstitutional) {
        newErrors.email = 'Usa um email institucional válido (@uem.ac.mz, @unizambeze.ac.mz, etc.)'
      }
    }

    if (email === currentEmail) {
      newErrors.email = 'Este já é o teu email actual'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) return

    setLoading(true)
    setErrors({})

    try {
      await api.post('/users/change_email/', {
        new_email: form.newEmail.trim().toLowerCase(),
      })
      
      setStep(2)
    } catch (error) {
      setErrors({
        email: error.response?.data?.error || 'Erro ao enviar código. Tenta novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    if (!form.code.trim()) {
      setErrors({ code: 'Introduz o código de verificação' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await api.post('/users/verify_email_change/', {
        new_email: form.newEmail.trim().toLowerCase(),
        code: form.code.trim(),
      })
      
      setStep(3)
      
      setTimeout(() => {
        onSuccess?.(response.data)
        handleClose()
      }, 2000)
    } catch (error) {
      setErrors({
        code: error.response?.data?.error || 'Código inválido ou expirado',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setErrors({})

    try {
      await api.post('/users/change_email/', {
        new_email: form.newEmail.trim().toLowerCase(),
      })
      
      setErrors({ code: null })
      alert('Código reenviado com sucesso!')
    } catch (error) {
      setErrors({
        code: 'Erro ao reenviar código. Tenta novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md shadow-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-neutral-100 dark:border-[#2a2a2a] px-5 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-neutral-900 dark:text-white">
            Alterar Email Institucional
          </h2>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-[#b0b3b8]" />
          </button>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="p-5 space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Email actual: {currentEmail}</p>
                <p>Vamos enviar um código de verificação para o novo email.</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
                Novo Email Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={form.newEmail}
                  onChange={(e) => {
                    setForm(prev => ({ ...prev, newEmail: e.target.value }))
                    setErrors({})
                  }}
                  placeholder="nome@universidade.ac.mz"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-700' 
                      : 'border-neutral-200 dark:border-[#2a2a2a]'
                  } bg-white dark:bg-[#222222] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-[#222222] rounded-xl">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 font-medium">
                Emails aceites:
              </p>
              <div className="flex flex-wrap gap-1">
                {INSTITUTIONAL_DOMAINS.slice(0, 5).map(domain => (
                  <span key={domain} className="text-xs bg-white dark:bg-[#1e1e1e] px-2 py-1 rounded-md text-neutral-500 dark:text-neutral-400">
                    @{domain}
                  </span>
                ))}
                <span className="text-xs text-neutral-400 dark:text-neutral-500 px-2 py-1">
                  +{INSTITUTIONAL_DOMAINS.length - 5} mais
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'A enviar...' : 'Enviar Código'}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Enter Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="p-5 space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-2">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Código enviado!</p>
                <p>Verifica a caixa de entrada de <span className="font-semibold">{form.newEmail}</span></p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
                Código de Verificação
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, code: e.target.value }))
                  setErrors({})
                }}
                placeholder="000000"
                maxLength={6}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.code 
                    ? 'border-red-300 dark:border-red-700' 
                    : 'border-neutral-200 dark:border-[#2a2a2a]'
                } bg-white dark:bg-[#222222] text-center text-2xl font-mono font-bold tracking-widest text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
              />
              {errors.code && (
                <p className="text-xs text-red-500 mt-1">{errors.code}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline disabled:opacity-50"
            >
              Não recebeste o código? Reenviar
            </button>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'A verificar...' : 'Verificar'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-brand-900/20 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              Email Alterado!
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              O teu email institucional foi actualizado com sucesso para <span className="font-semibold">{form.newEmail}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

