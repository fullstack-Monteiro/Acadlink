import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Github } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import AuthSidebar from '../../components/auth/AuthSidebar'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const nameInputRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    university: '',
    course: '',
    password: '',
    confirm: '',
    bio: ''
  })

  // Autofoco no primeiro campo
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Nenhuma validação - aceita tudo
    try {
      await register({
        username: form.name.toLowerCase().replace(/\s+/g, '_') || 'user',
        first_name: form.name.split(' ')[0] || 'User',
        last_name: form.name.split(' ').slice(1).join(' ') || form.name || 'User',
        email: form.email || 'user@acadlink.local',
        university_id: 1,
        course: form.course || 'Curso',
        year: 1,
        password: form.password || 'password123',
        password_confirm: form.confirm || 'password123'
      })
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      setSubmitError('Erro ao registrar')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Registar com ${provider}`)
    const testUser = {
      id: Math.random(),
      username: provider,
      email: `user_${provider}@acadlink.local`,
      first_name: provider,
      last_name: 'Social',
      name: `${provider} User`,
      university: form.university || 'Universidade',
      course: form.course || 'Curso',
      year: 1,
      bio: `Utilizador via ${provider}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      is_verified: true,
      created_at: new Date().toISOString()
    }
    localStorage.setItem('access_token', `${provider}_token_${Date.now()}`)
    localStorage.setItem('test_mode', 'true')
    localStorage.setItem('test_user', JSON.stringify(testUser))
    navigate('/dashboard')
  }

  return (
    <div className="h-screen bg-white dark:bg-[#0d0d0d] flex overflow-hidden">
      {/* Sidebar com imagens */}
      <AuthSidebar />

      {/* Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-[#0d0d0d]">
        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#e4e6ea] mb-1">Cria a tua conta</h1>
            <p className="text-neutral-500 dark:text-[#b0b3b8] text-sm">Junta-te à rede académica</p>
          </div>

          <div className="bg-white dark:bg-[#242526] rounded-2xl border border-neutral-100 dark:border-[#3a3b3c] shadow-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="João Silva"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="exemplo@gmail.com"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* University */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Universidade</label>
                <input
                  type="text"
                  placeholder="UEM"
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                  value={form.university}
                  onChange={e => setForm({...form, university: e.target.value})}
                  disabled={loading}
                />
              </div>

              {/* Course */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Curso</label>
                <input
                  type="text"
                  placeholder="Engenharia Informática"
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                  value={form.course}
                  onChange={e => setForm({...form, course: e.target.value})}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                    value={form.confirm}
                    onChange={e => setForm({...form, confirm: e.target.value})}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Bio (Opcional)</label>
                <textarea
                  placeholder="Fala um pouco sobre ti..."
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  value={form.bio}
                  onChange={e => setForm({...form, bio: e.target.value})}
                  disabled={loading}
                  maxLength={160}
                />
                <p className="text-xs text-neutral-500">{form.bio.length}/160</p>
              </div>

              {/* Error Alert */}
              {submitError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-200">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="mt-6"
              >
                Criar Conta
              </Button>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-[#3a3b3c]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-[#242526] text-neutral-500 dark:text-neutral-400">Ou regista-te com</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-neutral-200 dark:border-[#3a3b3c] rounded-xl hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-neutral-700 dark:text-neutral-100"
                >
                  <Github className="w-5 h-5 text-neutral-900 dark:text-white" />
                  Continuar com GitHub
                </button>
              </div>
            </form>
            </div>

            <p className="text-center text-sm text-neutral-500 dark:text-[#b0b3b8] mt-4">
              Já tens conta?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:underline">
                Entrar
              </Link>
              {' · '}
              <Link to="/welcome" className="text-neutral-500 hover:underline text-xs">
                Voltar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

