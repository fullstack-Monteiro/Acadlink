import { useState } from 'react'
import { X, Users, Globe, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const GROUP_TYPES = [
  { 
    value: 'public', 
    label: 'Público', 
    icon: Globe,
    description: 'Qualquer pessoa pode ver e participar' 
  },
  { 
    value: 'private', 
    label: 'Privado', 
    icon: Lock,
    description: 'Apenas membros aprovados podem ver' 
  },
]

export default function CreateGroupModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'public',
    university: user?.university || '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Nome do grupo é obrigatório'
    } else if (form.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!form.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (form.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setSubmitting(true)

    try {
      // Chamar callback de submit
      await onSubmit({
        ...form,
        adminIds: [user.id],
        moderatorIds: [],
        memberCount: 1,
      })
      
      // Resetar form
      setForm({
        name: '',
        description: '',
        type: 'public',
        university: user?.university || '',
      })
      
      // Fechar modal
      onClose()
    } catch (error) {
      setErrors({ submit: error.message || 'Erro ao criar grupo' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md shadow-modal max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1e1e1e] border-b border-neutral-100 dark:border-[#2a2a2a] px-5 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-neutral-900 dark:text-white">
            Criar Novo Grupo
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-[#b0b3b8]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nome do Grupo */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
              Nome do Grupo *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Engenharia Informática UEM"
              className={`w-full rounded-xl border ${
                errors.name 
                  ? 'border-red-300 dark:border-red-700' 
                  : 'border-neutral-200 dark:border-[#2a2a2a]'
              } bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
              Descrição *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreve o propósito e objectivos do grupo..."
              rows={4}
              className={`w-full rounded-xl border ${
                errors.description 
                  ? 'border-red-300 dark:border-red-700' 
                  : 'border-neutral-200 dark:border-[#2a2a2a]'
              } bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Tipo de Grupo */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2 block">
              Tipo de Grupo
            </label>
            <div className="space-y-2">
              {GROUP_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange('type', type.value)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${
                      form.type === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-[#2a2a2a] hover:bg-neutral-50 dark:hover:bg-[#222222]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      form.type === type.value
                        ? 'border-primary-600'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}>
                      {form.type === type.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {type.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {type.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Universidade */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
              Universidade (Opcional)
            </label>
            <input
              type="text"
              value={form.university}
              onChange={(e) => handleChange('university', e.target.value)}
              placeholder="Ex: UEM"
              className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] mt-1">
              Restringe o grupo a estudantes de uma universidade específica
            </p>
          </div>

          {/* Erro de Submit */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'A criar...' : 'Criar Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
