import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CheckCircle, Github } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLoginAttempts } from '../../hooks/useLoginAttempts'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import ErrorAlert from '../../components/ui/ErrorAlert'
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal'
import AuthSidebar from '../../components/auth/AuthSidebar'
import { isValidEmail } from '../../utils/validation'

function getErrorMessage(err) {
  if (err.response?.data?.detail) return err.response.data.detail
  if (err.response?.data?.email) return err.response.data.email[0]
  if (err.response?.data?.password) return err.response.data.password[0]
  if (err.response?.status === 401) return 'Email ou senha incorretos'
  return err.message || 'Erro ao fazer login'
}

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const emailInputRef = useRef(null)
  const { isLocked, remainingTime, recordAttempt, reset, attemptsLeft } = useLoginAttempts()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  // Autofoco no email input
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Validar email em tempo real
  useEffect(() => {
    if (form.email) {
      setEmailValid(isValidEmail(form.email))
    } else {
      setEmailValid(false)
    }
  }, [form.email])

  // Carregar email salvo se "lembrar-me" estava ativo
  useEffect(() => {
    const saved = localStorage.getItem('acadlink_remember_email')
    if (saved) {
      setForm(f => ({ ...f, email: saved }))
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isLocked) {
      setError(`Conta bloqueada. Tenta novamente em ${remainingTime}s`)
      return
    }

    if (!form.email || !form.password) {
      setError('Preenche todos os campos.')
      return
    }

    if (!isValidEmail(form.email)) {
      setError('Email inválido')
      return
    }

    try {
      const ok = await login(form.email, form.password)
      if (ok) {
        reset()
        if (rememberMe) {
          localStorage.setItem('acadlink_remember_email', form.email)
        } else {
          localStorage.removeItem('acadlink_remember_email')
        }
        navigate('/dashboard')
      }
    } catch (err) {
      recordAttempt()
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && form.email && form.password && !loading && !isLocked) {
      handleSubmit(e)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login com ${provider}`)
    // Simular login com função básica em modo desenvolvimento
    const testUser = {
      id: Math.random(),
      username: provider,
      email: `user_${provider}@acadlink.local`,
      first_name: provider,
      last_name: 'Social',
      name: `${provider} User`,
      university: 'Universidade',
      course: 'Curso',
      year: 1,
      bio: `Utilizador via ${provider}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      is_verified: true,
      created_at: new Date().toISOString()
    }
    localStorage.setItem('access_token', `${provider}_token_${Date.now()}`)
    localStorage.setItem('test_mode', 'true')
    localStorage.setItem('test_user', JSON.stringify(testUser))
    reset()
    navigate('/dashboard')
  }

  return (
    <div className="h-screen bg-white dark:bg-[#0d0d0d] flex overflow-hidden">
      {/* Sidebar com imagens e frases */}
      <AuthSidebar />

      {/* Main content */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#0d0d0d]">
        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#e4e6ea] mb-1">Bem-vindo de volta</h1>
            <p className="text-neutral-500 dark:text-[#b0b3b8] text-sm">Entra na tua conta AcadLink</p>
          </div>

          <div className="bg-white dark:bg-[#242526] rounded-2xl border border-neutral-100 dark:border-[#3a3b3c] shadow-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Input
                  ref={emailInputRef}
                  label="Email"
                  type="email"
                  placeholder="exemplo@gmail.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  disabled={loading || isLocked}
                />
                {form.email && emailValid && (
                  <CheckCircle className="absolute right-3 top-8 text-green-500 w-5 h-5" />
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={handleKeyDown}
                    disabled={loading || isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors disabled:opacity-50"
                    disabled={loading || isLocked}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <ErrorAlert
                  message={error}
                  onClose={() => setError('')}
                  type={isLocked ? 'warning' : 'error'}
                  action={
                    attemptsLeft === 0
                      ? {
                          label: 'Recuperar Senha',
                          onClick: () => setShowForgotModal(true)
                        }
                      : null
                  }
                />
              )}

              {/* Attempts Warning */}
              {!isLocked && attemptsLeft < 3 && attemptsLeft > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-xs text-yellow-800 dark:text-yellow-200">
                  ⚠️ {attemptsLeft} tentativa{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={loading || isLocked}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="remember" className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  Lembrar-me
                </label>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  disabled={loading || isLocked}
                  className="text-sm text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Esqueci a senha
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={isLocked || !form.email || !form.password}
              >
                {isLocked ? `Bloqueado (${remainingTime}s)` : 'Entrar'}
              </Button>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-[#3a3b3c]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-[#242526] text-neutral-500 dark:text-neutral-400">Ou continua com</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading || isLocked}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-neutral-200 dark:border-[#3a3b3c] rounded-xl hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-neutral-700 dark:text-neutral-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                      {/* Top left - Blue */}
                      <path d="M12 12L12 3H18.5C18.5 7 15.5 12 12 12Z" fill="#4285F4"/>
                      {/* Top right - Red */}
                      <path d="M12 12L18.5 3H24V12C21 12 15.5 12 12 12Z" fill="#EA4335"/>
                      {/* Bottom right - Yellow */}
                      <path d="M12 12V18.5C15.5 15.5 21 12 24 12H18.5C18.5 12 15.5 12 12 12Z" fill="#FBBC04"/>
                      {/* Bottom left - Blue */}
                      <path d="M12 12H5.5C8 14 10 18.5 12 18.5V12Z" fill="#34A853"/>
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect x="3" y="3" width="18" height="18" rx="9" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  Continuar com Google
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  disabled={loading || isLocked}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-neutral-200 dark:border-[#3a3b3c] rounded-xl hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-neutral-700 dark:text-neutral-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                    <rect x="0" y="0" width="9" height="9" fill="#F25022"/>
                    <rect x="12" y="0" width="9" height="9" fill="#7FBA00"/>
                    <rect x="0" y="12" width="9" height="9" fill="#00A4EF"/>
                    <rect x="12" y="12" width="9" height="9" fill="#FFB900"/>
                  </svg>
                  Continuar com Microsoft
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={loading || isLocked}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-neutral-200 dark:border-[#3a3b3c] rounded-xl hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-neutral-700 dark:text-neutral-100"
                >
                  <Github className="w-5 h-5 text-neutral-900 dark:text-white" />
                  Continuar com GitHub
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-sm text-neutral-500 dark:text-white mt-4">
            Não tens conta?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              Criar conta
            </Link>
            {' · '}
            <Link to="/welcome" className="text-neutral-500 hover:underline text-xs">
              Voltar
            </Link>
          </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
    </div>
  )
}
