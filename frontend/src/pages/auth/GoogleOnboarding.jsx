import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, BookOpen, ChevronRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function GoogleOnboarding() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, updateUser } = useAuth()

  // Dados que vieram do Google via state de navegação
  const googleUser = location.state?.googleUser || {}

  const [step, setStep] = useState(1) // 1 = universidade/curso, 2 = bio
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    university: '',
    course: '',
    year: '',
    bio: ''
  })

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!form.university.trim()) {
      setError('Universidade é obrigatória')
      return
    }
    if (!form.course.trim()) {
      setError('Curso é obrigatório')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.put('/users/update_profile/', {
        course: form.course,
        year: form.year ? parseInt(form.year) : null,
        // bio vai para o Profile
      })

      // Atualizar bio no perfil se preenchida
      if (form.bio.trim()) {
        try {
          await api.patch('/users/update_profile/', { bio: form.bio })
        } catch (_) {
          // bio é opcional, ignora erro
        }
      }

      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Onboarding error:', err)
      // Se falhar a atualização, redireciona mesmo assim
      // O utilizador pode atualizar depois nas Settings
      navigate('/dashboard', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const skipOnboarding = () => {
    navigate('/dashboard', { replace: true })
  }

  // Nome do utilizador para mostrar no welcome
  const displayName = googleUser?.first_name || user?.first_name || 'Utilizador'

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
            Bem-vindo, {displayName}!
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Conta criada com Google. Falta só completar o teu perfil académico.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
          }`}>
            {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
          </div>
          <div className={`h-0.5 w-12 transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
          }`}>
            2
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#242526] rounded-2xl border border-neutral-100 dark:border-[#3a3b3c] shadow-sm p-6">

          {/* Step 1 — Universidade e Curso */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white mb-1">Dados académicos</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Onde estudas e o que estudas</p>
              </div>

              {/* Universidade */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Universidade <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ex: Universidade Eduardo Mondlane"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-white placeholder-neutral-400 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    value={form.university}
                    onChange={e => handleChange('university', e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Curso */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Curso <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ex: Engenharia Informática"
                    className="w-full rounded-xl border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-white placeholder-neutral-400 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    value={form.course}
                    onChange={e => handleChange('course', e.target.value)}
                  />
                </div>
              </div>

              {/* Ano */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Ano curricular</label>
                <select
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-white text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={form.year}
                  onChange={e => handleChange('year', e.target.value)}
                >
                  <option value="">Seleciona o ano</option>
                  {[1,2,3,4,5,6].map(y => (
                    <option key={y} value={y}>{y}º Ano</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2 — Bio */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white mb-1">Apresenta-te</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Uma pequena bio para o teu perfil (opcional)</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Bio</label>
                <textarea
                  placeholder="Ex: Estudante de Engenharia apaixonado por IA e desenvolvimento mobile..."
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-white placeholder-neutral-400 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  value={form.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  maxLength={300}
                  autoFocus
                />
                <p className="text-xs text-neutral-400 text-right">{form.bio.length}/300</p>
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Concluir e entrar
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Skip */}
        <p className="text-center mt-4">
          <button
            onClick={skipOnboarding}
            className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            Preencher mais tarde
          </button>
        </p>
      </div>
    </div>
  )
}
