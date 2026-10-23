import { useState } from 'react'
import { X, Upload, FileText, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDocumentUpload } from '../../hooks/useFileUpload'

const DOC_TYPES = [
  'Apontamentos',
  'Resumo',
  'Slides',
  'Exercícios',
  'Exame',
  'Trabalho',
  'Tese',
  'Artigo',
  'Outro',
]

export default function UploadDocumentModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth()
  const { upload, uploading, progress, error } = useDocumentUpload({
    endpoint: '/library/upload/',
    onSuccess: (data) => {
      setUploadComplete(true)
      setTimeout(() => {
        onSuccess?.(data)
        handleClose()
      }, 1500)
    },
  })

  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Apontamentos',
    course: user?.course || '',
    university: user?.university || '',
    year: '',
  })
  const [errors, setErrors] = useState({})
  const [uploadComplete, setUploadComplete] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setFile(null)
    setForm({
      title: '',
      description: '',
      type: 'Apontamentos',
      course: user?.course || '',
      university: user?.university || '',
      year: '',
    })
    setErrors({})
    setUploadComplete(false)
    onClose()
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Auto-preencher título com nome do arquivo
      if (!form.title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '')
        setForm(prev => ({ ...prev, title: fileName }))
      }
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!file) {
      newErrors.file = 'Seleciona um ficheiro'
    }

    if (!form.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!form.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await upload(file, {
        ...form,
        author_id: user.id,
      })
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  const getFileIcon = () => {
    if (!file) return '📎'
    const ext = file.name.split('.').pop().toLowerCase()
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
    }
    return icons[ext] || '📎'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-lg shadow-modal max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1e1e1e] border-b border-neutral-100 dark:border-[#2a2a2a] px-5 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-neutral-900 dark:text-white">
            Partilhar Documento
          </h2>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-[#b0b3b8]" />
          </button>
        </div>

        {/* Upload Complete */}
        {uploadComplete && (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-brand-900/20 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              Upload Concluído!
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              O teu documento foi partilhado com sucesso
            </p>
          </div>
        )}

        {/* Form */}
        {!uploadComplete && (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* File Upload */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2 block">
                Ficheiro *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
                id="doc-file-input"
              />
              <label
                htmlFor="doc-file-input"
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-colors ${
                  errors.file
                    ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                    : file
                    ? 'border-secondary-300 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/10'
                    : 'border-neutral-200 dark:border-[#2a2a2a] hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                }`}
              >
                {file ? (
                  <>
                    <span className="text-3xl">{getFileIcon()}</span>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white text-center">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      Clica para mudar ficheiro
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-neutral-400" />
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      Clica para seleccionar ficheiro
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      PDF, DOC, PPT — máx. 20MB
                    </p>
                  </>
                )}
              </label>
              {errors.file && (
                <p className="text-xs text-red-500 mt-1">{errors.file}</p>
              )}
            </div>

            {/* Título */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
                Título *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Apontamentos de Programação I"
                className={`w-full rounded-xl border ${
                  errors.title 
                    ? 'border-red-300 dark:border-red-700' 
                    : 'border-neutral-200 dark:border-[#2a2a2a]'
                } bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
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
                placeholder="Descreve o conteúdo do documento..."
                rows={3}
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

            {/* Tipo & Ano */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
                  Tipo
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  {DOC_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
                  Ano
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="Ex: 2024"
                  className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Curso & Universidade */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 block">
                Curso
              </label>
              <input
                type="text"
                value={form.course}
                onChange={(e) => handleChange('course', e.target.value)}
                placeholder="Ex: Engenharia Informática"
                className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">A fazer upload...</span>
                  <span className="font-medium text-primary-600">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-[#222222] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Erro */}
            {(error || errors.submit) && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error || errors.submit}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? `${progress}%` : 'Publicar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

